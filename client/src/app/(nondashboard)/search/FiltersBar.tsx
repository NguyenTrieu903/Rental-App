import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
} from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bed, Filter, Grid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyTypeIcons } from "@/lib/constants";
import { FILLTER } from "@/utils/constant";
import {
  AllFiltersButton,
  LocationSearch,
  PriceRangeFilter,
  ViewModeToggle,
  BedFilter,
  BathFilter,
} from "@/components/filters";
import { PropertyTypeFilter } from "@/components/filters/PropertyTypeFilter";
const FiltersBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [searchInput, setSearchInput] = useState(filters.location);

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathName}?${updatedSearchParams.toString()}`);
  });

  const handleFilterChange = (
    key: keyof FiltersState,
    value: any,
    isMin: boolean | null
  ) => {
    let newValue = value;
    if (key === FILLTER.PRICE_RANGE || key === FILLTER.SQUARE_FEET) {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === "any" ? null : Number(value);
      }
      newValue = currentArrayRange;
    } else if (key === FILLTER.COORDINATES) {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    } else {
      newValue = value === "any" ? "any" : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };
  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchInput
        )}&limit=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "RentalApp/1.0",
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lon = parseFloat(data[0].lon);
        const lat = parseFloat(data[0].lat);

        dispatch(
          setFilters({
            location: searchInput,
            coordinates: [lon, lat],
          })
        );

        console.log(
          `Location found: ${data[0].display_name}, coordinates: [${lon}, ${lat}]`
        );
      } else {
        console.log("No location found for the search term");
      }
    } catch (err) {
      console.error("Error search location:", err);
    }
  };

  return (
    <div className="flex justify-between items-center w-full py-5">
      <div className="flex justify-between items-center gap-4 p-2">
        <AllFiltersButton />
        <LocationSearch
          initialValue={filters.location}
          onFilterChange={handleLocationSearch}
        />
        <div className="flex gap-1">
          <PriceRangeFilter
            priceRange={filters.priceRange}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex gap-1">
          <BedFilter beds={filters.beds} onFilterChange={handleFilterChange} />
          <BathFilter
            baths={filters.baths}
            onFilterChange={handleFilterChange}
          />
        </div>
        <PropertyTypeFilter
          propertyType={filters.propertyType}
          onFilterChange={handleFilterChange}
        />
      </div>
      <ViewModeToggle />
    </div>
  );
};

export default FiltersBar;
