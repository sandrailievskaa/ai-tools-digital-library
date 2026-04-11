import { tools } from "@/data/tools";
import { ToolCard } from "./ToolCard";
import { TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function TrendingSection() {
  const trending = tools.filter(t => t.isTrending).slice(0, 4);
  const recent = tools.filter(t => t.isNew).slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Trending */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-xl text-foreground">Trending Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {trending.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Recently Added */}
      {recent.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-mint" />
            <h2 className="font-heading font-semibold text-xl text-foreground">Recently Added</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recent.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
