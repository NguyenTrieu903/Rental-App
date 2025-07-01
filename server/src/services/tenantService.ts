import { PrismaClient, Tenant } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { ERROR_MESSAGES } from "../utils/contants";

const prisma = new PrismaClient();

export class TenantService {
  async findTenantByCognitoId(cognitoId: string, includeFavorites = false) {
    return prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: includeFavorites,
      },
    });
  }

  async createTenant(data: {
    cognitoId: string;
    name: string;
    email: string;
    phoneNumber: string;
  }) {
    return prisma.tenant.create({
      data,
    });
  }

  async updateTenant(
    cognitoId: string,
    data: { name?: string; email?: string; phoneNumber?: string }
  ) {
    return prisma.tenant.update({
      where: { cognitoId },
      data,
    });
  }

  async getCurrentResidences(cognitoId: string) {
    const properties = await prisma.property.findMany({
      where: { tenants: { some: { cognitoId } } },
      include: {
        location: true,
      },
    });

    return Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`;
        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );
  }

  async addFavoriteProperty(cognitoId: string, propertyId: number) {
    const tenant = await this.findTenantByCognitoId(cognitoId, true);
    if (!tenant) {
      throw new Error(`Tenant with id ${cognitoId} not found`);
    }

    const existingFavorites = tenant.favorites || [];
    if (existingFavorites.some((fav) => fav.id === propertyId)) {
      throw new Error(ERROR_MESSAGES.PROPERTY_ALREADY_FAVORITE);
    }

    return prisma.tenant.update({
      where: { cognitoId },
      data: {
        favorites: {
          connect: { id: propertyId },
        },
      },
      include: { favorites: true },
    });
  }

  async removeFavoriteProperty(cognitoId: string, propertyId: number) {
    return prisma.tenant.update({
      where: { cognitoId },
      data: {
        favorites: {
          disconnect: { id: propertyId },
        },
      },
      include: { favorites: true },
    });
  }
}
