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

  // handle marker click to navigate to property details
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

        {/* Update position */}
        <MapUpdater position={mapPosition} />

        {/* Render properties */}
        {properties?.map((property) => (
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
