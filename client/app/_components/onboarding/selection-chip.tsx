import { cn } from "@/lib/utils";

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const SelectionChip = ({ label, selected, onClick }: SelectionChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border-2 text-gray-500 px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
        selected
          ? "border-foreground bg-foreground text-card"
          : "border-border bg-card hover:border-muted-foreground hover:text-primary"
      )}
    >
      {label}
    </button>
  );
};

export default SelectionChip;