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
    (state) => state.global.filters.coordinates
  );

  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);
  
  // Lấy tất cả properties trước khi xác định vị trí mặc định
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);
  
  // Xác định vị trí và zoom dựa trên filters hoặc tất cả properties
  const [mapPosition, setMapPosition] = useState<[number, number]>([34.05, -118.25]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  
  // Cập nhật vị trí map dựa trên filters hoặc tất cả properties
  useEffect(() => {
    if (coordinates?.length === 2) {
      // Nếu có tọa độ trong filter, sử dụng nó
      setMapPosition([coordinates[1], coordinates[0]]);
      setMapZoom(13);
    } else if (properties?.length) {
      // Nếu không có tọa độ filter nhưng có properties, tính toán bounds để hiển thị tất cả
      try {
        // Lấy tất cả tọa độ hợp lệ
        const validLocations = properties
          .filter(p => p.location?.coordinates?.latitude && p.location?.coordinates?.longitude)
          .map(p => [p.location.coordinates.latitude, p.location.coordinates.longitude]);
        
        if (validLocations.length > 0) {
          // Tính toán vị trí trung bình
          const sumLat = validLocations.reduce((sum, loc) => sum + loc[0], 0);
          const sumLng = validLocations.reduce((sum, loc) => sum + loc[1], 0);
          const avgLat = sumLat / validLocations.length;
          const avgLng = sumLng / validLocations.length;
          
          setMapPosition([avgLat, avgLng]);
          setMapZoom(validLocations.length === 1 ? 13 : 10); // Zoom ra nếu có nhiều điểm
        }
      } catch (err) {
        console.error("Error calculating map position:", err);
        setMapPosition([34.05, -118.25]); // Fallback to default
      }
    }
  }, [coordinates, properties]);

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
    <div className="h-[500px] w-full">
      <MapContainer
        center={mapPosition}
        zoom={mapZoom}
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
