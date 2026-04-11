import { ToolCard } from "./ToolCard";
import type { AITool } from "@/data/tools";
import { PackageOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ToolGridProps {
  tools: AITool[];
  title?: string;
  onTagClick?: (tag: string) => void;
  highlightTags?: string[];
}

export function ToolGrid({ tools, title, onTagClick, highlightTags }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <PackageOpen className="w-14 h-14 text-muted-foreground/30 mb-4" />
        </motion.div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No tools found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your search query or clearing some filters to see more results.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      {title && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="font-heading font-semibold text-xl text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground tabular-nums">{tools.length} results</span>
        </motion.div>
      )}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {tools.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={i}
              onTagClick={onTagClick}
              highlightTags={highlightTags}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
