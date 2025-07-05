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
  const handleLocationSearch = () => {};
  // return (
  //   <div className="flex justify-between items-center w-full py-5">
  //     <div className="flex justify-between items-center gap-4 p-2">
  //       {/* All Filters */}
  //       <Button
  //         variant="outline"
  //         className={cn(
  //           "gap-2 rounded-xl border-primary-400 hover:bg-primary-500 cursor-pointer hover:text-primary-100",
  //           isFiltersFullOpen && "bg-secondary-600 text-primary-100"
  //         )}
  //         onClick={() => dispatch(toggleFiltersFullOpen())}
  //       >
  //         <Filter className="w-4 h-4" />
  //         <span>All Filters</span>
  //       </Button>

  //       {/* Search Location */}
  //       <div className="flex items-center">
  //         <Input
  //           placeholder="Search location"
  //           value={searchInput}
  //           onChange={(e) => setSearchInput(e.target.value)}
  //           className="w-40 rounded-l-xl rounded-r-none border-primary-400 border-r-0"
  //         />
  //         <Button
  //           onClick={handleLocationSearch}
  //           className={`rounded-r-xl rounded-l-none border-l-none border-primary-400 shadow-none
  //             border hover:bg-secondary-600 hover:text-primary-50 cursor-pointer`}
  //         >
  //           <Search className="w-4 h-4" />
  //         </Button>
  //       </div>

  //       {/* Price Range */}
  //       <div className="flex gap-1">
  //         {/* Minimum Price Selector */}
  //         <Select
  //           value={filters.priceRange[0]?.toString() || "any"}
  //           onValueChange={(value) =>
  //             handleFilterChange("priceRange", value, true)
  //           }
  //         >
  //           <SelectTrigger className="w-22 rounded-xl border-primary-400">
  //             <SelectValue>
  //               {formatPriceValue(filters.priceRange[0], true)}
  //             </SelectValue>
  //           </SelectTrigger>
  //           <SelectContent className="bg-white">
  //             <SelectItem value="any">Any Min Price</SelectItem>
  //             {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
  //               <SelectItem key={price} value={price.toString()}>
  //                 ${price / 1000}k+
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>

  //         {/* Maximum Price Selector */}
  //         <Select
  //           value={filters.priceRange[1]?.toString() || "any"}
  //           onValueChange={(value) =>
  //             handleFilterChange("priceRange", value, false)
  //           }
  //         >
  //           <SelectTrigger className="w-22 rounded-xl border-primary-400">
  //             <SelectValue>
  //               {formatPriceValue(filters.priceRange[1], false)}
  //             </SelectValue>
  //           </SelectTrigger>
  //           <SelectContent className="bg-white">
  //             <SelectItem value="any">Any Max Price</SelectItem>
  //             {[1000, 2000, 3000, 5000, 10000].map((price) => (
  //               <SelectItem key={price} value={price.toString()}>
  //                 &lt;${price / 1000}k
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex justify-between items-center w-full py-5">
      <div className="flex justify-between items-center gap-4 p-2">
        <AllFiltersButton />
        <LocationSearch
          initialValue={filters.location}
          onFilterChange={handleFilterChange}
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
