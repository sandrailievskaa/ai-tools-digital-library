import { tools } from "@/data/tools";
import { TrendingUp, Clock, BarChart3, Database, Tag, Layers } from "lucide-react";
import { motion } from "framer-motion";

export function StatsBar() {
  const categories = new Set(tools.map(t => t.category)).size;
  const totalTags = new Set(tools.flatMap(t => t.tags)).size;

  const stats = [
    { icon: Database, label: "Total Tools", value: tools.length, color: "text-primary" },
    { icon: Layers, label: "Categories", value: categories, color: "text-mint" },
    { icon: Tag, label: "Unique Tags", value: totalTags, color: "text-ai-purple" },
    { icon: TrendingUp, label: "Trending", value: tools.filter(t => t.isTrending).length, color: "text-primary" },
    { icon: Clock, label: "New Entries", value: tools.filter(t => t.isNew).length, color: "text-mint" },
    { icon: BarChart3, label: "Avg Rating", value: (tools.reduce((a, t) => a + t.rating, 0) / tools.length).toFixed(1), color: "text-ai-purple" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
          <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
          <p className="font-heading font-bold text-xl text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
