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

interface BedFilterProps {
  beds: string;
  onFilterChange: (
    key: keyof FiltersState,
    value: any,
    isMin: boolean | null
  ) => void;
}

export const BedFilter = ({ beds, onFilterChange }: BedFilterProps) => {
  return (
    <div className="flex gap-1">
      <Select
        value={beds}
        onValueChange={(value) => onFilterChange("beds", value, null)}
      >
        <SelectTrigger className="w-auto rounded-xl border-primary-400">
          <SelectValue placeholder="Beds" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="any">Any Beds</SelectItem>
          <SelectItem value="1">1+ bed</SelectItem>
          <SelectItem value="2">2+ beds</SelectItem>
          <SelectItem value="3">3+ beds</SelectItem>
          <SelectItem value="4">4+ beds</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
