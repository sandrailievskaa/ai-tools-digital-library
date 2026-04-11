import { categories, difficulties, useCases, allTags, type Category, type Difficulty, type UseCase } from "@/data/tools";
import { Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
  selectedCategories: Category[];
  toggleCategory: (c: Category) => void;
  selectedDifficulty: Difficulty | null;
  setSelectedDifficulty: (d: Difficulty | null) => void;
  selectedUseCases: UseCase[];
  toggleUseCase: (u: UseCase) => void;
  selectedTags: string[];
  toggleTag: (t: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-2 group"
      >
        <p className="section-label">{title}</p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  const [showMobile, setShowMobile] = useState(false);
  const topTags = allTags.slice(0, 12);
  const activeCategories = categories.filter(c =>
    ["UI Design", "Analytics", "Automation", "Productivity", "Research", "Coding"].includes(c)
  );

  const content = (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <div className="p-1 rounded-md bg-primary/10">
            <Filter className="w-3.5 h-3.5 text-primary" />
          </div>
          Filters
        </h3>
        {props.hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={props.clearFilters}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </motion.button>
        )}
      </div>

      {/* Categories */}
      <FilterGroup title="Category">
        <div className="flex flex-wrap gap-1.5">
          {activeCategories.map(c => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.92 }}
              onClick={() => props.toggleCategory(c)}
              className={props.selectedCategories.includes(c) ? "filter-chip-active" : "filter-chip"}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </FilterGroup>

      {/* Difficulty */}
      <FilterGroup title="Difficulty">
        <div className="flex flex-wrap gap-1.5">
          {difficulties.map(d => (
            <motion.button
              key={d}
              whileTap={{ scale: 0.92 }}
              onClick={() => props.setSelectedDifficulty(props.selectedDifficulty === d ? null : d)}
              className={props.selectedDifficulty === d ? "filter-chip-active" : "filter-chip"}
            >
              {d}
            </motion.button>
          ))}
        </div>
      </FilterGroup>

      {/* Use Case */}
      <FilterGroup title="Use Case">
        <div className="flex flex-wrap gap-1.5">
          {useCases.map(u => (
            <motion.button
              key={u}
              whileTap={{ scale: 0.92 }}
              onClick={() => props.toggleUseCase(u)}
              className={props.selectedUseCases.includes(u) ? "filter-chip-active" : "filter-chip"}
            >
              {u}
            </motion.button>
          ))}
        </div>
      </FilterGroup>

      {/* Tags */}
      <FilterGroup title="Tags" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {topTags.map(t => (
            <motion.button
              key={t}
              whileTap={{ scale: 0.92 }}
              onClick={() => props.toggleTag(t)}
              className={props.selectedTags.includes(t) ? "filter-chip-active" : "filter-chip"}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </FilterGroup>

      {/* Digital Library Info */}
      <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5">
          <span>📚</span> Digital Library System
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Resources organized with structured metadata, semantic classification, and keyword-based indexing.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowMobile(!showMobile)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium mb-4 btn-glow transition-all"
      >
        <Filter className="w-4 h-4" />
        {showMobile ? "Hide Filters" : "Show Filters"}
        {props.hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </motion.button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="glass-card rounded-2xl p-5 mb-6">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 glass-card rounded-2xl p-5 custom-scrollbar max-h-[calc(100vh-7rem)] overflow-y-auto">
          {content}
        </div>
      </aside>
    </>
  );
}
