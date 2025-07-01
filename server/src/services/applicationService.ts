import { PrismaClient, Tenant } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { ERROR_MESSAGES } from "../utils/contants";

const prisma = new PrismaClient();

export class ApplicationService {}
