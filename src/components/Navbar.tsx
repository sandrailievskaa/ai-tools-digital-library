import { Search, Moon, Sun, BookMarked, Library, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface NavbarProps {
  search: string;
  onSearchChange: (val: string) => void;
}

export function Navbar({ search, onSearchChange }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search from mobile nav
  useEffect(() => {
    if (window.location.search.includes("focus=search")) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav-scrolled" : "glass-nav"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-4 transition-all duration-500 ${
          scrolled ? "h-14" : "h-16"
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center"
            >
              <Library className="w-5 h-5" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                AI Library
              </span>
              <span className="text-[10px] text-muted-foreground block -mt-1 tracking-wider uppercase">
                Digital Catalog
              </span>
            </div>
          </Link>

          {/* Search */}
          <motion.div
            animate={{ maxWidth: isSearchFocused ? 640 : 480 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 relative"
          >
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
              isSearchFocused ? "text-primary" : "text-muted-foreground"
            }`} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tools, categories, tags..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="search-input w-full pl-10 pr-10"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              to="/?bookmarks=true"
              className="relative p-2.5 rounded-xl hover:bg-secondary transition-all duration-200 active:scale-95 btn-glow"
              title="Bookmarks"
            >
              <BookMarked className="w-5 h-5 text-muted-foreground" />
              {bookmarks.size > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1"
                >
                  {bookmarks.size}
                </motion.span>
              )}
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, rotate: 15 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-secondary transition-colors btn-glow"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
