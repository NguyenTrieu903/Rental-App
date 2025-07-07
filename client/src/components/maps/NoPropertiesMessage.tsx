"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface NoPropertiesMessageProps {
  message: string;
}

const NoPropertiesMessage = ({ message }: NoPropertiesMessageProps) => {
  const map = useMap();

  useEffect(() => {
    const messageControl = new L.Control({ position: "topright" });

    messageControl.onAdd = () => {
      const div = L.DomUtil.create("div", "no-properties-message");
      div.innerHTML = `<div class="px-3 py-2 bg-white rounded-md shadow-md border border-gray-300 text-sm">
        ${message}
      </div>`;
      return div;
    };

    messageControl.addTo(map);

    return () => {
      messageControl.remove();
    };
  }, [map, message]);

  return null;
};

export default NoPropertiesMessage;
