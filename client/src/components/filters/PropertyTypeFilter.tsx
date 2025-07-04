import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiltersState } from "@/state";
import { PropertyTypeIcons } from "@/lib/constants";
interface PropertyTypeProps {
  propertyType: string;
  onFilterChange: (
    key: keyof FiltersState,
    value: any,
    isMin: boolean | null
  ) => void;
}

export const PropertyTypeFilter = ({
  propertyType,
  onFilterChange,
}: PropertyTypeProps) => {
  return (
    <Select
      value={propertyType || "any"}
      onValueChange={(value) => onFilterChange("propertyType", value, null)}
    >
      <SelectTrigger className="w-auto rounded-xl border-primary-400">
        <SelectValue placeholder="Home Type" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="any">Any Property Type</SelectItem>
        {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
          <SelectItem key={type} value={type}>
            <div className="flex items-center">
              <Icon className="w-auto h-4 mr-2" />
              <span>{type}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
