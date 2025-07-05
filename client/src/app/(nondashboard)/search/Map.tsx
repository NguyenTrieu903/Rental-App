"use client";

import dynamic from "next/dynamic";

const DynamicMapContainer = dynamic(
  () => import("@/components/maps/MapContainer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    ),
  }
);

const Map = () => {
  return <DynamicMapContainer />;
};

export default Map;
