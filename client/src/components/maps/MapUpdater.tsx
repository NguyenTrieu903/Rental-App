"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapUpdaterProps {
  position: [number, number];
  zoom?: number;
}

// Update the map view when position or zoom changes
const MapUpdater = ({ position, zoom }: MapUpdaterProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);

  return null;
};

export default MapUpdater;
