import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiltersState, setFilters } from "@/state";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface LocationSearchProps {
  initialValue: string;
  onFilterChange: (
    key: keyof FiltersState,
    value: any,
    isMin: boolean | null
  ) => void;
}

export const LocationSearch = ({
  initialValue,
  onFilterChange,
}: LocationSearchProps) => {
  const [searchInput, setSearchInput] = useState(initialValue);
  const dispatch = useDispatch();

  const handleLocationSearch = () => {
    onFilterChange("location", searchInput, null);
  };

  return (
    <div className="flex items-center">
      <Input
        placeholder="Search location"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-40 rounded-l-xl rounded-r-none border-primary-400 border-r-0"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLocationSearch();
        }}
      />
      <Button
        onClick={handleLocationSearch}
        className={`rounded-r-xl rounded-l-none border-l-none border-primary-400 shadow-none 
          border hover:bg-secondary-600 hover:text-primary-50 cursor-pointer`}
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};
