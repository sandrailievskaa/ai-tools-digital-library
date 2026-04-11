import { Search, Moon, Sun, BookMarked, Library } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface NavbarProps {
  search: string;
  onSearchChange: (val: string) => void;
}

export function Navbar({ search, onSearchChange }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
              <Library className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg text-foreground">AI Library</span>
              <span className="text-xs text-muted-foreground block -mt-1">Digital Catalog</span>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools, categories, tags..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              className="search-input w-full pl-10 pr-4"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/?bookmarks=true"
              className="relative p-2.5 rounded-xl hover:bg-secondary transition-colors"
              title="Bookmarks"
            >
              <BookMarked className="w-5 h-5 text-muted-foreground" />
              {bookmarks.size > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px]">
                  {bookmarks.size}
                </span>
              )}
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-secondary transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
