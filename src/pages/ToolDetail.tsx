import { useParams, Link } from "react-router-dom";
import { tools } from "@/data/tools";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useBookmarks } from "@/context/BookmarkContext";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Bookmark, Star, Users, Calendar, Tag, Layers, Gauge, Briefcase, Lightbulb } from "lucide-react";
import { useState } from "react";

export default function ToolDetail() {
  const { id } = useParams();
  const tool = tools.find(t => t.id === id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [search, setSearch] = useState("");

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedBackground />
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

  const youMayLike = tools
    .filter(t => t.id !== tool.id && !related.find(r => r.id === t.id) && t.rating >= 4.5)
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
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <AnimatedBackground />
      <Navbar search={search} onSearchChange={setSearch} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to library
          </Link>
        </motion.div>

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden h-48 sm:h-56 mb-8"
          style={{
            background: `linear-gradient(135deg, hsla(var(--primary), 0.15), hsla(var(--ai-purple), 0.15))`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-6xl sm:text-8xl font-bold text-foreground/6">
              {tool.name}
            </span>
          </div>
        </motion.div>

        {/* Title and actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">{tool.name}</h1>
            <p className="text-lg text-muted-foreground">{tool.description}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleBookmark(tool.id)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all btn-glow ${
                bookmarked
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary text-secondary-foreground hover:border-primary/50"
              }`}
            >
              <Bookmark className={`w-4 h-4 transition-all duration-300 ${bookmarked ? "fill-primary scale-110" : ""}`} />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl gradient-btn text-sm font-medium flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Visit Tool
            </motion.a>
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{tool.longDescription}</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Keywords & Tags
              </h2>
              <p className="text-xs text-muted-foreground mb-3">Semantic classification terms for indexing and retrieval</p>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map(tag => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="tag-badge text-sm px-3 py-1 cursor-pointer"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Metadata</h2>
              <div className="space-y-4">
                {metadataFields.map((field, i) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="p-1.5 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                      <field.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <p className="text-sm font-medium text-foreground">{field.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <p className="section-label mb-2">Catalog Entry</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This resource is indexed with {tool.tags.length} semantic tags across {tool.useCase.length} use case classifications.
                Part of the <span className="text-primary font-medium">{tool.category}</span> collection.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-14"
          >
            <h2 className="font-heading font-semibold text-xl text-foreground mb-5">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((t, i) => (
                <ToolCard key={t.id} tool={t} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* You may also like */}
        {youMayLike.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-ai-purple/10">
                <Lightbulb className="w-4 h-4 text-ai-purple" />
              </div>
              <h2 className="font-heading font-semibold text-xl text-foreground">You May Also Like</h2>
              <span className="text-xs text-muted-foreground bg-ai-purple/10 px-2 py-0.5 rounded-full">Suggested</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {youMayLike.map((t, i) => (
                <ToolCard key={t.id} tool={t} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <MobileBottomNav />
    </div>
  );
}
