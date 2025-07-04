"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api/propertyApi";
import { useRouter } from "next/navigation";

// Component để cập nhật center của map khi filters thay đổi
function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}

// Fix Leaflet icons
const Map = () => {
  const router = useRouter();

  // Fix for default markers not showing
  useEffect(() => {
    // Fix icon issues when building with webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  const coordinates = useAppSelector(
    (state) => state.global.filters.coordinates || [34.05, -118.25]
  );

  // Convert to [latitude, longitude] format for Leaflet
  const mapPosition =
    coordinates.length === 2
      ? ([coordinates[1], coordinates[0]] as [number, number])
      : ([34.05, -118.25] as [number, number]); // Default to LA

  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  // Custom icon cho properties
  const propertyIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Thay đổi thành icon tùy chỉnh nếu có
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const handleMarkerClick = (id: string) => {
    router.push(`/property/${id}`);
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={mapPosition}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Component để cập nhật center của map khi filters thay đổi */}
        <MapUpdater position={mapPosition} />

        {/* Marker cho vị trí hiện tại được chọn từ filter */}
        <Marker position={mapPosition}>
          <Popup>Selected location</Popup>
        </Marker>

        {/* Hiển thị tất cả properties từ DB */}
        {properties?.map((property) => {
          // Kiểm tra xem property có dữ liệu location hợp lệ không
          if (
            property.location?.coordinates?.latitude &&
            property.location?.coordinates?.longitude
          ) {
            return (
              <Marker
                key={property.id}
                position={[
                  property.location.coordinates.latitude,
                  property.location.coordinates.longitude,
                ]}
                icon={propertyIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(property.id),
                }}
              >
                <Popup>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-base">{property.title}</h3>
                    <p className="text-primary-600 font-semibold">
                      ${property.pricePerMonth}/tháng
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.location.address}
                    </p>
                    <button
                      className="bg-primary-500 text-white py-1 px-2 rounded-md text-xs mt-1"
                      onClick={() => handleMarkerClick(property.id)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
