// server/src/controllers/propertyControllers.test.ts

import { Request, Response } from "express";
import { getProperties, getProperty, createProperty } from "./propertyControllers";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

jest.mock("@prisma/client");
jest.mock("axios");

const prisma = new PrismaClient();

describe("Property Controllers", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    // Mock the response object
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    res = { status } as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProperties", () => {
    it("should return properties based on query parameters", async () => {
      req = {
        query: {
          favoriteIds: "1,2,3",
          priceMin: "1000",
          propertyType: "APARTMENT",
        },
      };

      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([
        { id: 1, pricePerMonth: 1200 },
        { id: 2, pricePerMonth: 1500 },
      ]);

      await getProperties(req as Request, res as Response);

      expect(prisma.$queryRaw).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, pricePerMonth: 1200 },
        { id: 2, pricePerMonth: 1500 },
      ]);
    });

    it("should handle error during property retrieval", async () => {
      req = { query: {} };

      (prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

      await getProperties(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error retrieving properties: Database error" });
    });
  });

  describe("getProperty", () => {
    it("should return a single property with coordinates", async () => {
      req = { params: { id: "1" } };

      (prisma.property.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
        location: { id: 1 },
      });
      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ coordinates: "POINT(-73.97 40.77)" }]);

      await getProperty(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        location: {
          id: 1,
          coordinates: {
            longitude: -73.97,
            latitude: 40.77,
          },
        },
      });
    });

    it("should handle error when property is not found", async () => {
      req = { params: { id: "999" } };

      (prisma.property.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await getProperty(req as Request, res as Response);

      expect(res.json).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle error during property retrieval", async () => {
      req = { params: { id: "1" } };

      (prisma.property.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

      await getProperty(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error retrieving property Database error" });
    });
  });

  describe("createProperty", () => {
    it("should create a new property successfully", async () => {
      req = {
        files: [],
        body: {
          address: "123 Main St",
          city: "Anytown",
          state: "NY",
          country: "USA",
          postalCode: "12345",
          managerCognitoId: "user123",
          pricePerMonth: "1200",
          amenities: "POOL,GYM",
        },
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: [{ lon: "-73.97", lat: "40.77" }],
      });

      (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);
      (prisma.property.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        address: "123 Main St",
        city: "Anytown",
        state: "NY",
        country: "USA",
        postalCode: "12345",
      });

      await createProperty(req as Request, res as Response);

      expect(prisma.$queryRaw).toHaveBeenCalled();
      expect(prisma.property.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        address: "123 Main St",
        city: "Anytown",
        state: "NY",
        country: "USA",
        postalCode: "12345",
      });
    });

    it("should handle error during property creation", async () => {
      req = {
        files: [],
        body: {
          address: "123 Main St",
          city: "Anytown",
          state: "NY",
          country: "USA",
          postalCode: "12345",
          managerCognitoId: "user123",
        },
      };

      (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Geocoding error"));

      await createProperty(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error creating property: Geocoding error" });
    });
  });
});