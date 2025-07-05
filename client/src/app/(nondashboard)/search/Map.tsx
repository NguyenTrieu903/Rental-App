"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api/propertyApi";
import { useRouter } from "next/navigation";

const Map = () => {
  const router = useRouter();

  useEffect(() => {
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

  const mapPosition =
    coordinates.length === 2
      ? ([coordinates[1], coordinates[0]] as [number, number])
      : ([34.05, -118.25] as [number, number]); // Default to LA

  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);
  console.log("Properties from DB:", properties);
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

        {properties?.map((property) => {
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
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  click: () => handleMarkerClick(property.id),
                }}
              >
                <Popup>
                  <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md w-64">
                    {/* Hình ảnh */}
                    <div className="w-full h-32 bg-gray-200 overflow-hidden">
                      {property.photoUrls && property.photoUrls[0] ? (
                        <img
                          src={property.photoUrls[0]}
                          alt={property.name || "Property"}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Thông tin */}
                    <div className="p-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-primary-600">
                        {property.name || "Property listing"}
                      </h3>

                      <div className="flex items-center mb-2">
                        <span className="text-lg font-bold text-primary-600">
                          ${property.pricePerMonth?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          / month
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                        {property.location?.address || "Address not available"}
                      </p>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkerClick(property.id);
                        }}
                        className="w-full py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded transition-colors text-sm flex items-center justify-center cursor-pointer"
                      >
                        View details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
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
