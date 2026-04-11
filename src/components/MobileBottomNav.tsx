import { Home, Search, Bookmark } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useBookmarks } from "@/context/BookmarkContext";
import { motion } from "framer-motion";

export function MobileBottomNav() {
  const location = useLocation();
  const { bookmarks } = useBookmarks();
  const isHome = location.pathname === "/" && !location.search.includes("bookmarks");
  const isBookmarks = location.search.includes("bookmarks");

  const items = [
    { icon: Home, label: "Home", to: "/", active: isHome },
    { icon: Search, label: "Search", to: "/?focus=search", active: false },
    { icon: Bookmark, label: "Saved", to: "/?bookmarks=true", active: isBookmarks, badge: bookmarks.size },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-nav border-t border-border/40">
      <div className="flex items-center justify-around h-14 px-4">
        {items.map(item => (
          <Link
            key={item.label}
            to={item.to}
            className="relative flex flex-col items-center gap-0.5 py-1 px-3"
          >
            <div className="relative">
              <item.icon className={`w-5 h-5 transition-colors ${item.active ? "text-primary" : "text-muted-foreground"}`} />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] font-medium transition-colors ${item.active ? "text-primary" : "text-muted-foreground"}`}>
              {item.label}
            </span>
            {item.active && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
