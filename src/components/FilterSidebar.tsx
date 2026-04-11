import { categories, difficulties, useCases, allTags, type Category, type Difficulty, type UseCase } from "@/data/tools";
import { Filter, X } from "lucide-react";
import { useState } from "react";

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

export function FilterSidebar(props: FilterSidebarProps) {
  const [showMobile, setShowMobile] = useState(false);
  const topTags = allTags.slice(0, 12);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </h3>
        {props.hasActiveFilters && (
          <button onClick={props.clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="section-label mb-2">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.filter(c => ["UI Design", "Analytics", "Automation", "Productivity", "Research", "Coding"].includes(c)).map(c => (
            <button
              key={c}
              onClick={() => props.toggleCategory(c)}
              className={props.selectedCategories.includes(c) ? "filter-chip-active" : "filter-chip"}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="section-label mb-2">Difficulty</p>
        <div className="flex flex-wrap gap-1.5">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => props.setSelectedDifficulty(props.selectedDifficulty === d ? null : d)}
              className={props.selectedDifficulty === d ? "filter-chip-active" : "filter-chip"}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Use Case */}
      <div>
        <p className="section-label mb-2">Use Case</p>
        <div className="flex flex-wrap gap-1.5">
          {useCases.map(u => (
            <button
              key={u}
              onClick={() => props.toggleUseCase(u)}
              className={props.selectedUseCases.includes(u) ? "filter-chip-active" : "filter-chip"}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="section-label mb-2">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {topTags.map(t => (
            <button
              key={t}
              onClick={() => props.toggleTag(t)}
              className={props.selectedTags.includes(t) ? "filter-chip-active" : "filter-chip"}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Digital Library Info */}
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-xs font-medium text-primary mb-1">📚 Digital Library System</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Resources organized with structured metadata, semantic classification, and keyword-based indexing for intelligent retrieval.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setShowMobile(!showMobile)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium mb-4"
      >
        <Filter className="w-4 h-4" />
        {showMobile ? "Hide Filters" : "Show Filters"}
        {props.hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
      </button>

      {/* Mobile sidebar */}
      {showMobile && (
        <div className="lg:hidden glass-card rounded-2xl p-5 mb-6">
          {content}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 glass-card rounded-2xl p-5">
          {content}
        </div>
      </aside>
    </>
  );
}
