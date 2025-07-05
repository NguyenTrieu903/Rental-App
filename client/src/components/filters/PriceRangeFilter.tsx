import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPriceValue } from "@/lib/utils";
import { FiltersState } from "@/state";
import { FILLTER } from "@/utils/constant";

interface PriceRangeFilterProps {
  priceRange: [number | null, number | null];
  onFilterChange: (
    key: keyof FiltersState,
    value: any,
    isMin: boolean | null
  ) => void;
}

export const PriceRangeFilter = ({
  priceRange,
  onFilterChange,
}: PriceRangeFilterProps) => {
  return (
    <div className="flex gap-1">
      {/* Minimum Price Selector */}
      <Select
        value={priceRange[0]?.toString() || "any"}
        onValueChange={(value) => {
          onFilterChange("priceRange", value, true);
        }}
      >
        <SelectTrigger className="w-auto rounded-xl border-primary-400">
          <SelectValue>{formatPriceValue(priceRange[0], true)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="any">Any Min Price</SelectItem>
          {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
            <SelectItem key={price} value={price.toString()}>
              ${price / 1000}k+
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Maximum Price Selector */}
      <Select
        value={priceRange[1]?.toString() || "any"}
        onValueChange={(value) => onFilterChange("priceRange", value, false)}
      >
        <SelectTrigger className="w-auto rounded-xl border-primary-400">
          <SelectValue>{formatPriceValue(priceRange[1], false)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="any">Any Max Price</SelectItem>
          {[1000, 2000, 3000, 5000, 10000].map((price) => (
            <SelectItem key={price} value={price.toString()}>
              &lt;${price / 1000}k
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
