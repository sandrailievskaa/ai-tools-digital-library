import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ToolGrid } from "@/components/ToolGrid";
import { TrendingSection } from "@/components/TrendingSection";
import { StatsBar } from "@/components/StatsBar";
import { useFilteredTools } from "@/hooks/useFilteredTools";
import { useSearchParams } from "react-router-dom";
import { useBookmarks } from "@/context/BookmarkContext";
import { tools as allTools } from "@/data/tools";

const Index = () => {
  const filters = useFilteredTools();
  const [searchParams] = useSearchParams();
  const { isBookmarked } = useBookmarks();
  const showBookmarks = searchParams.get("bookmarks") === "true";

  const displayTools = showBookmarks
    ? allTools.filter(t => isBookmarked(t.id))
    : filters.filtered;

  return (
    <div className="min-h-screen bg-background">
      <Navbar search={filters.search} onSearchChange={filters.setSearch} />
      
      {!filters.hasActiveFilters && !showBookmarks && (
        <>
          <HeroSection />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StatsBar />
            <TrendingSection />
          </div>
          <div className="border-t border-border/50 my-10" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {(filters.hasActiveFilters || showBookmarks) && <div className="pt-6" />}
        
        <div className="flex gap-8">
          <FilterSidebar
            selectedCategories={filters.selectedCategories}
            toggleCategory={filters.toggleCategory}
            selectedDifficulty={filters.selectedDifficulty}
            setSelectedDifficulty={filters.setSelectedDifficulty}
            selectedUseCases={filters.selectedUseCases}
            toggleUseCase={filters.toggleUseCase}
            selectedTags={filters.selectedTags}
            toggleTag={filters.toggleTag}
            clearFilters={filters.clearFilters}
            hasActiveFilters={filters.hasActiveFilters}
          />
          <div className="flex-1 min-w-0">
            <ToolGrid
              tools={displayTools}
              title={showBookmarks ? "Your Bookmarks" : filters.hasActiveFilters ? "Search Results" : "All Tools"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
