import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFiltersFullOpen } from "@/state";
import { useAppSelector } from "@/state/redux";
import { Filter } from "lucide-react";
import { useDispatch } from "react-redux";

export const AllFiltersButton = () => {
  const dispatch = useDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  return (
    <Button
      variant="outline"
      className={cn(
        "gap-2 rounded-xl border-primary-400 hover:bg-primary-500 cursor-pointer hover:text-primary-100",
        isFiltersFullOpen && "bg-secondary-600 text-primary-100"
      )}
      onClick={() => dispatch(toggleFiltersFullOpen())}
    >
      <Filter className="w-4 h-4" />
      <span>All Filters</span>
    </Button>
  );
};
