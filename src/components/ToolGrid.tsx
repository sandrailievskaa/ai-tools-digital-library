import { ToolCard } from "./ToolCard";
import type { AITool } from "@/data/tools";
import { PackageOpen } from "lucide-react";

interface ToolGridProps {
  tools: AITool[];
  title?: string;
}

export function ToolGrid({ tools, title }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageOpen className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No tools found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-xl text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">{tools.length} results</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tools.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} index={i} />
        ))}
      </div>
    </div>
  );
}
