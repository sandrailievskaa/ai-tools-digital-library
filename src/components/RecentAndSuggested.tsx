import { tools } from "@/data/tools";
import { ToolCard } from "./ToolCard";
import { Clock, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export function RecentAndSuggested({ onTagClick }: { onTagClick?: (tag: string) => void }) {
  const recent = tools.filter(t => t.isNew);
  const suggested = tools.filter(t => t.rating >= 4.7 && !t.isNew).slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Recently Added */}
      {recent.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-mint/10">
              <Clock className="w-4 h-4 text-mint" />
            </div>
            <h2 className="font-heading font-semibold text-xl text-foreground">Recently Added</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recent.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} onTagClick={onTagClick} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Smart Suggestions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 rounded-lg bg-ai-purple/10">
            <Lightbulb className="w-4 h-4 text-ai-purple" />
          </div>
          <h2 className="font-heading font-semibold text-xl text-foreground">Smart Suggestions</h2>
          <span className="text-xs text-muted-foreground bg-ai-purple/10 px-2 py-0.5 rounded-full">AI-powered</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {suggested.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} onTagClick={onTagClick} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
