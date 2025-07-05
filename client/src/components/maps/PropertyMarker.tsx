"use client";

import React from "react";
import { Marker } from "react-leaflet";
import { propertyIcon } from "./IconConfig";
import PropertyPopup from "./PropertyPopup";

interface PropertyMarkerProps {
  property: any;
  onMarkerClick: (id: string) => void;
}

const PropertyMarker = ({ property, onMarkerClick }: PropertyMarkerProps) => {
  if (
    !property.location?.coordinates?.latitude ||
    !property.location?.coordinates?.longitude
  ) {
    return null;
  }

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
        click: () => onMarkerClick(property.id),
      }}
    >
      <PropertyPopup property={property} onViewDetails={onMarkerClick} />
    </Marker>
  );
};

export default PropertyMarker;
