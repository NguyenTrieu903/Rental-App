"use client";

import { useGetPropertyQuery } from "@/state/api/propertyApi";
import { Compass, MapPin } from "lucide-react";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Import động để tránh lỗi SSR với Leaflet
const PropertyLocationMap = dynamic(() => import("./PropertyLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center rounded-lg">
      <p>Loading map...</p>
    </div>
  ),
});

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <div className="py-16">Loading location data...</div>;
  if (isError || !property) {
    return <div className="py-16">Location information not available</div>;
  }

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
        Map and Location
      </h3>
      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>

      {/* Map container */}
      <div className="relative mt-4 h-[300px] rounded-lg overflow-hidden">
        {property.location?.coordinates && (
          <PropertyLocationMap
            latitude={property.location.coordinates.latitude}
            longitude={property.location.coordinates.longitude}
            address={property.location?.address}
            propertyName={property.name || property.title || "Property"}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyLocation;
