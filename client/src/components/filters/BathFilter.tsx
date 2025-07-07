import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiltersState } from "@/state";

interface BathFilterProps {
  baths: string;
  onFilterChange: (
    key: keyof FiltersState,
    value: any,
    isMin: boolean | null
  ) => void;
}

export const BathFilter = ({ baths, onFilterChange }: BathFilterProps) => {
  return (
    <Select
      value={baths}
      onValueChange={(value) => onFilterChange("baths", value, null)}
    >
      <SelectTrigger className="w-auto rounded-xl border-primary-400">
        <SelectValue placeholder="Baths" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="any">Any Baths</SelectItem>
        <SelectItem value="1">1+ baths</SelectItem>
        <SelectItem value="2">2+ baths</SelectItem>
        <SelectItem value="3">3+ baths</SelectItem>
        <SelectItem value="4">4+ baths</SelectItem>
      </SelectContent>
    </Select>
  );
};
