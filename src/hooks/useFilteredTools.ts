import { useMemo, useState } from "react";
import { tools, type Category, type Difficulty, type UseCase } from "@/data/tools";

export function useFilteredTools() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return tools.filter(tool => {
      const q = search.toLowerCase();
      const matchesSearch = !q || tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some(t => t.toLowerCase().includes(q)) ||
        tool.category.toLowerCase().includes(q);

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(tool.category);
      const matchesDifficulty = !selectedDifficulty || tool.difficulty === selectedDifficulty;
      const matchesUseCase = selectedUseCases.length === 0 || tool.useCase.some(u => selectedUseCases.includes(u));
      const matchesTags = selectedTags.length === 0 || selectedTags.some(t => tool.tags.includes(t));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesUseCase && matchesTags;
    });
  }, [search, selectedCategories, selectedDifficulty, selectedUseCases, selectedTags]);

  const toggleCategory = (c: Category) =>
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const toggleUseCase = (u: UseCase) =>
    setSelectedUseCases(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]);

  const toggleTag = (t: string) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedDifficulty(null);
    setSelectedUseCases([]);
    setSelectedTags([]);
  };

  const hasActiveFilters = search || selectedCategories.length > 0 || selectedDifficulty || selectedUseCases.length > 0 || selectedTags.length > 0;

  return {
    search, setSearch,
    selectedCategories, toggleCategory,
    selectedDifficulty, setSelectedDifficulty,
    selectedUseCases, toggleUseCase,
    selectedTags, toggleTag,
    filtered, clearFilters, hasActiveFilters,
  };
}
