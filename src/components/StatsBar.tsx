import { tools } from "@/data/tools";
import { TrendingUp, Clock, BarChart3, Database, Tag, Layers } from "lucide-react";
import { motion } from "framer-motion";

export function StatsBar() {
  const categoriesCount = new Set(tools.map(t => t.category)).size;
  const totalTags = new Set(tools.flatMap(t => t.tags)).size;

  const stats = [
    { icon: Database, label: "Total Tools", value: tools.length, color: "text-primary", bg: "bg-primary/10" },
    { icon: Layers, label: "Categories", value: categoriesCount, color: "text-mint", bg: "bg-mint/10" },
    { icon: Tag, label: "Unique Tags", value: totalTags, color: "text-ai-purple", bg: "bg-ai-purple/10" },
    { icon: TrendingUp, label: "Trending", value: tools.filter(t => t.isTrending).length, color: "text-primary", bg: "bg-primary/10" },
    { icon: Clock, label: "New Entries", value: tools.filter(t => t.isNew).length, color: "text-mint", bg: "bg-mint/10" },
    { icon: BarChart3, label: "Avg Rating", value: (tools.reduce((a, t) => a + t.rating, 0) / tools.length).toFixed(1), color: "text-ai-purple", bg: "bg-ai-purple/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
          whileHover={{ y: -3, scale: 1.02 }}
          className="glass-card rounded-xl p-4 text-center cursor-default group transition-shadow hover:shadow-lg"
        >
          <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="font-heading font-bold text-xl text-foreground">{stat.value}</p>
          <p className="text-[11px] text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
