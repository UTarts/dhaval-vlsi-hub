import { useState, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/lib/api";

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchPosts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchPosts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
        onClick={onClose}
        data-testid="search-overlay"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, tutorials, guides..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
              autoFocus
              data-testid="search-input"
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              data-testid="search-close-button"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-gray-500 font-mono text-sm">
                Searching...
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-mono text-sm">
                No results found for "{query}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="divide-y divide-gray-100">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    onClick={onClose}
                    className="block p-4 hover:bg-blue-50 transition-colors group"
                    data-testid={`search-result-${post.slug}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 font-body">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wider rounded bg-blue-100 text-blue-700">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {post.reading_time} min read
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {query.length > 0 && query.length < 2 && (
              <div className="p-8 text-center text-gray-400 font-mono text-sm">
                Type at least 2 characters to search
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-4">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">ESC</kbd>
              <span>to close</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">↑</kbd>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">↓</kbd>
              <span>to navigate</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
