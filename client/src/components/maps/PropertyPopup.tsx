"use client";

import React from "react";
import { Popup } from "react-leaflet";

interface PropertyPopupProps {
  property: any;
  onViewDetails: (id: string) => void;
}

const PropertyPopup = ({ property, onViewDetails }: PropertyPopupProps) => {
  return (
    <Popup>
      <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md w-64">
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

        <div className="p-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-primary-600">
            {property.name || "Property listing"}
          </h3>

          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-primary-600">
              ${property.pricePerMonth?.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">/ month</span>
          </div>

          <p className="text-sm text-gray-500 line-clamp-1 mb-3">
            {property.location?.address || "Address not available"}
          </p>

          <button
            onClick={(e) => {
              e.preventDefault();
              onViewDetails(property.id);
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
  );
};

export default PropertyPopup;
