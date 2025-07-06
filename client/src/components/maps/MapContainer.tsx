"use client";

import React, { useEffect } from "react";
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api/propertyApi";
import { useRouter } from "next/navigation";
import { configureLeafletIcons } from "./IconConfig";
import MapUpdater from "./MapUpdater";
import PropertyMarker from "./PropertyMarker";
import NoPropertiesMessage from "./NoPropertiesMessage";

const MapContainer = () => {
  const router = useRouter();

  useEffect(() => {
    configureLeafletIcons();
  }, []);

  const filters = useAppSelector((state) => state.global.filters);
  const coordinates = filters.coordinates || [34.05, -118.25];

  // change location to [latitude, longitude] format
  const mapPosition =
    coordinates.length === 2
      ? ([coordinates[1], coordinates[0]] as [number, number])
      : ([34.05, -118.25] as [number, number]); // Mặc định là LA

  // call api to get properties based on filters
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  if (isLoading)
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="text-primary-600 font-medium">Loading map data...</div>
      </div>
    );

  if (isError)
    return (
      <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-red-500 font-medium mb-2">
          Failed to fetch properties
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );

  const handleMarkerClick = (id: string) => {
    router.push(`/property/${id}`);
  };

  return (
    <div className="h-full w-full">
      <LeafletMapContainer
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater position={mapPosition} />

        {properties && properties.length === 0 && (
          <NoPropertiesMessage message="No real estate found in this area" />
        )}

        {/* Render properties markers */}
        {properties &&
          properties.map((property) => (
            <PropertyMarker
              key={property.id}
              property={property}
              onMarkerClick={handleMarkerClick}
            />
          ))}
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainer;
