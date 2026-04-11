import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category, Difficulty, UseCase } from "@/data/tools";

interface ActiveFilterChipsProps {
  selectedCategories: Category[];
  toggleCategory: (c: Category) => void;
  selectedDifficulty: Difficulty | null;
  setSelectedDifficulty: (d: Difficulty | null) => void;
  selectedUseCases: UseCase[];
  toggleUseCase: (u: UseCase) => void;
  selectedTags: string[];
  toggleTag: (t: string) => void;
  search: string;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ActiveFilterChips(props: ActiveFilterChipsProps) {
  if (!props.hasActiveFilters) return null;

  const chips: { label: string; type: string; onRemove: () => void }[] = [];

  if (props.search) {
    chips.push({ label: `"${props.search}"`, type: "search", onRemove: () => {} });
  }
  props.selectedCategories.forEach(c => {
    chips.push({ label: c, type: "category", onRemove: () => props.toggleCategory(c) });
  });
  if (props.selectedDifficulty) {
    const d = props.selectedDifficulty;
    chips.push({ label: d, type: "difficulty", onRemove: () => props.setSelectedDifficulty(null) });
  }
  props.selectedUseCases.forEach(u => {
    chips.push({ label: u, type: "usecase", onRemove: () => props.toggleUseCase(u) });
  });
  props.selectedTags.forEach(t => {
    chips.push({ label: t, type: "tag", onRemove: () => props.toggleTag(t) });
  });

  const colorMap: Record<string, string> = {
    search: "bg-muted text-muted-foreground",
    category: "bg-primary/10 text-primary border-primary/20",
    difficulty: "bg-ai-purple/10 text-ai-purple border-ai-purple/20",
    usecase: "bg-mint/10 text-mint border-mint/20",
    tag: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap items-center gap-2 pb-4"
    >
      <span className="text-xs text-muted-foreground font-medium">Active filters:</span>
      <AnimatePresence mode="popLayout">
        {chips.map(chip => (
          <motion.button
            key={`${chip.type}-${chip.label}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={chip.onRemove}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 active:scale-95 ${colorMap[chip.type] || ""}`}
          >
            {chip.label}
            {chip.type !== "search" && <X className="w-3 h-3" />}
          </motion.button>
        ))}
      </AnimatePresence>
      <button
        onClick={props.clearFilters}
        className="text-xs text-muted-foreground hover:text-foreground underline transition-colors ml-1"
      >
        Clear all
      </button>
    </motion.div>
  );
}
