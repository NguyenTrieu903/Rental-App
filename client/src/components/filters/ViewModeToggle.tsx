import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setViewMode } from "@/state";
import { useAppSelector } from "@/state/redux";
import { Grid, List } from "lucide-react";
import { useDispatch } from "react-redux";

export const ViewModeToggle = () => {
  const dispatch = useDispatch();
  const viewMode = useAppSelector((state) => state.global.viewMode);

  return (
    <div className="flex border rounded-xl overflow-hidden">
      <Button
        variant="ghost"
        className={cn(
          "rounded-none border-0",
          viewMode === "grid" && "bg-secondary-600 text-primary-100"
        )}
        onClick={() => dispatch(setViewMode("grid"))}
      >
        <Grid className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "rounded-none border-0",
          viewMode === "list" && "bg-secondary-600 text-primary-100"
        )}
        onClick={() => dispatch(setViewMode("list"))}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
};
