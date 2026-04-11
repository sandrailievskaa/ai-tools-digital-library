import { motion } from "framer-motion";
import { Bookmark, ExternalLink, Star, TrendingUp, Sparkles, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useBookmarks } from "@/context/BookmarkContext";
import type { AITool } from "@/data/tools";

const categoryColors: Record<string, string> = {
  "UI Design": "bg-primary/15 text-primary",
  Analytics: "bg-ai-purple/15 text-ai-purple",
  Automation: "bg-mint/15 text-mint",
  Education: "bg-primary/15 text-primary",
  "Demo Tools": "bg-ai-purple/15 text-ai-purple",
  Productivity: "bg-mint/15 text-mint",
  Research: "bg-ai-purple/15 text-ai-purple",
  Coding: "bg-primary/15 text-primary",
};

interface ToolCardProps {
  tool: AITool;
  index: number;
  onTagClick?: (tag: string) => void;
  highlightTags?: string[];
}

export function ToolCard({ tool, index, onTagClick, highlightTags = [] }: ToolCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(tool.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      className="glass-card-hover rounded-2xl overflow-hidden group relative"
    >
      {/* Card header with gradient */}
      <div className="relative h-36 overflow-hidden" style={{
        background: `linear-gradient(135deg, hsla(var(--primary), 0.12), hsla(var(--ai-purple), 0.12))`
      }}>
        {/* Animated bg on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-ai-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-4xl font-bold text-foreground/8 group-hover:text-foreground/12 transition-all duration-500 group-hover:scale-110">
            {tool.name.split(" ")[0]}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {tool.isTrending && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm"
            >
              <TrendingUp className="w-3 h-3" /> Trending
            </motion.span>
          )}
          {tool.isNew && (
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-mint/90 text-mint-foreground backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3" /> New
            </motion.span>
          )}
        </div>

        {/* Quick Actions - revealed on hover */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); toggleBookmark(tool.id); }}
            className="p-2 rounded-lg bg-background/90 backdrop-blur-sm hover:bg-background transition-colors shadow-md"
          >
            <Bookmark className={`w-4 h-4 transition-all duration-300 ${bookmarked ? "fill-primary text-primary scale-110" : "text-muted-foreground"}`} />
          </motion.button>
          <Link
            to={`/tool/${tool.id}`}
            className="p-2 rounded-lg bg-background/90 backdrop-blur-sm hover:bg-background transition-colors shadow-md"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </Link>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-2 rounded-lg bg-background/90 backdrop-blur-sm hover:bg-background transition-colors shadow-md"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        </div>

        {/* Always-visible bookmark for mobile */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.preventDefault(); toggleBookmark(tool.id); }}
          className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background transition-colors group-hover:opacity-0 lg:block"
        >
          <Bookmark className={`w-4 h-4 transition-all duration-300 ${bookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </motion.button>
      </div>

      {/* Card body */}
      <Link to={`/tool/${tool.id}`} className="block p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              {tool.name}
            </h3>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium ${categoryColors[tool.category] || "bg-secondary text-secondary-foreground"}`}>
              {tool.category}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="font-medium">{tool.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {tool.description}
        </p>

        {/* Tags - clickable */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map(tag => (
            <button
              key={tag}
              onClick={e => { e.preventDefault(); onTagClick?.(tag); }}
              className={highlightTags.includes(tag) ? "tag-badge-highlight" : "tag-badge"}
            >
              {tag}
            </button>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-xs text-muted-foreground self-center">+{tool.tags.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <span className={tool.difficulty === "Beginner" ? "difficulty-beginner" : "difficulty-advanced"}>
            {tool.difficulty}
          </span>
          <span className="text-xs text-muted-foreground">{tool.users} users</span>
        </div>
      </Link>
    </motion.div>
  );
}
