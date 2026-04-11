import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      <div className="skeleton-shimmer h-36" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="skeleton-shimmer h-5 w-3/4" />
            <div className="skeleton-shimmer h-4 w-16 rounded-md" />
          </div>
          <div className="skeleton-shimmer h-4 w-10 rounded-md" />
        </div>
        <div className="space-y-1.5">
          <div className="skeleton-shimmer h-3.5 w-full" />
          <div className="skeleton-shimmer h-3.5 w-2/3" />
        </div>
        <div className="flex gap-1.5">
          <div className="skeleton-shimmer h-5 w-14 rounded-md" />
          <div className="skeleton-shimmer h-5 w-18 rounded-md" />
          <div className="skeleton-shimmer h-5 w-12 rounded-md" />
        </div>
        <div className="pt-3 border-t border-border/30 flex justify-between">
          <div className="skeleton-shimmer h-4 w-16 rounded-md" />
          <div className="skeleton-shimmer h-4 w-20 rounded-md" />
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
