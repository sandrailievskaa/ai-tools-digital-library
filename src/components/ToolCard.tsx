import { motion } from "framer-motion";
import { Bookmark, ExternalLink, Star, TrendingUp, Sparkles } from "lucide-react";
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
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(tool.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass-card-hover rounded-2xl overflow-hidden group"
    >
      {/* Card header with gradient */}
      <div className="relative h-36 overflow-hidden" style={{
        background: `linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--ai-purple) / 0.15))`
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-4xl font-bold text-foreground/10 group-hover:text-foreground/15 transition-colors">
            {tool.name.split(" ")[0]}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {tool.isTrending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/90 text-primary-foreground">
              <TrendingUp className="w-3 h-3" /> Trending
            </span>
          )}
          {tool.isNew && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-mint/90 text-mint-foreground">
              <Sparkles className="w-3 h-3" /> New
            </span>
          )}
        </div>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.preventDefault(); toggleBookmark(tool.id); }}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link to={`/tool/${tool.id}`}>
              <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
            </Link>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium ${categoryColors[tool.category] || "bg-secondary text-secondary-foreground"}`}>
              {tool.category}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span>{tool.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{tool.tags.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className={tool.difficulty === "Beginner" ? "difficulty-beginner" : "difficulty-advanced"}>
            {tool.difficulty}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{tool.users} users</span>
            <a href={tool.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
