import { useParams, Link } from "react-router-dom";
import { tools } from "@/data/tools";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import { useBookmarks } from "@/context/BookmarkContext";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Bookmark, Star, Users, Calendar, Tag, Layers, Gauge, Briefcase } from "lucide-react";
import { useState } from "react";

export default function ToolDetail() {
  const { id } = useParams();
  const tool = tools.find(t => t.id === id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [search, setSearch] = useState("");

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar search={search} onSearchChange={setSearch} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Tool not found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to library</Link>
        </div>
      </div>
    );
  }

  const related = tools
    .filter(t => t.id !== tool.id && (t.category === tool.category || t.tags.some(tag => tool.tags.includes(tag))))
    .slice(0, 3);

  const bookmarked = isBookmarked(tool.id);

  const metadataFields = [
    { icon: Layers, label: "Category", value: tool.category },
    { icon: Gauge, label: "Difficulty", value: tool.difficulty },
    { icon: Briefcase, label: "Use Cases", value: tool.useCase.join(", ") },
    { icon: Users, label: "Users", value: tool.users },
    { icon: Star, label: "Rating", value: `${tool.rating} / 5.0` },
    { icon: Calendar, label: "Date Added", value: new Date(tool.dateAdded).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar search={search} onSearchChange={setSearch} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to library
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero banner */}
          <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 mb-8" style={{
            background: `linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--ai-purple) / 0.2))`
          }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading text-6xl sm:text-8xl font-bold text-foreground/8">
                {tool.name}
              </span>
            </div>
          </div>

          {/* Title and actions */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">{tool.name}</h1>
              <p className="text-lg text-muted-foreground">{tool.description}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => toggleBookmark(tool.id)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                  bookmarked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-secondary-foreground hover:border-primary"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`} />
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl gradient-btn text-sm font-medium flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Visit Tool
              </a>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{tool.longDescription}</p>
              </div>

              {/* Tags */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Keywords & Tags
                </h2>
                <p className="text-xs text-muted-foreground mb-3">Semantic classification terms for indexing and retrieval</p>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map(tag => (
                    <span key={tag} className="tag-badge text-sm px-3 py-1">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar metadata */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Metadata</h2>
                <div className="space-y-4">
                  {metadataFields.map(field => (
                    <div key={field.label} className="flex items-start gap-3">
                      <field.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{field.label}</p>
                        <p className="text-sm font-medium text-foreground">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <p className="section-label mb-2">Catalog Entry</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This resource is indexed with {tool.tags.length} semantic tags across {tool.useCase.length} use case classifications.
                  Part of the {tool.category} collection.
                </p>
              </div>
            </div>
          </div>

          {/* Related tools */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading font-semibold text-xl text-foreground mb-5">Related Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((t, i) => (
                  <ToolCard key={t.id} tool={t} index={i} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
