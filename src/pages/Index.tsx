import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ToolGrid } from "@/components/ToolGrid";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { RecentAndSuggested } from "@/components/RecentAndSuggested";
import { StatsBar } from "@/components/StatsBar";
import { ActiveFilterChips } from "@/components/ActiveFilterChips";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { useFilteredTools } from "@/hooks/useFilteredTools";
import { useSearchParams } from "react-router-dom";
import { useBookmarks } from "@/context/BookmarkContext";
import { tools as allTools } from "@/data/tools";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Index = () => {
  const filters = useFilteredTools();
  const [searchParams] = useSearchParams();
  const { isBookmarked } = useBookmarks();
  const showBookmarks = searchParams.get("bookmarks") === "true";
  const [loading, setLoading] = useState(true);

  // Simulate initial load for skeleton effect
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const displayTools = showBookmarks
    ? allTools.filter(t => isBookmarked(t.id))
    : filters.filtered;

  const handleTagClick = (tag: string) => {
    filters.toggleTag(tag);
  };

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <AnimatedBackground />
      <Navbar search={filters.search} onSearchChange={filters.setSearch} />

      {!filters.hasActiveFilters && !showBookmarks && (
        <>
          <HeroSection />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StatsBar />
            <TrendingCarousel />
            <div className="mt-10">
              <RecentAndSuggested onTagClick={handleTagClick} />
            </div>
          </div>
          <div className="border-t border-border/30 my-10" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {(filters.hasActiveFilters || showBookmarks) && <div className="pt-6" />}

        {/* Active filter chips */}
        <ActiveFilterChips
          search={filters.search}
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
            {loading ? (
              <SkeletonGrid count={6} />
            ) : (
              <motion.div
                key={showBookmarks ? "bookmarks" : "all"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ToolGrid
                  tools={displayTools}
                  title={showBookmarks ? "Your Bookmarks" : filters.hasActiveFilters ? "Search Results" : "All Tools"}
                  onTagClick={handleTagClick}
                  highlightTags={filters.selectedTags}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default Index;
