import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, ArrowRight, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/components/shared/SEO";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all published posts
        let query = supabase
          .from("posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        const { data: postsData, error: postsError } = await query;
        if (postsError) throw postsError;
        setPosts(postsData);

        // Fetch categories (we'll aggregate from all posts for simplicity)
        if (selectedCategory === "all") {
           const { data: allPosts, error: allError } = await supabase
            .from("posts")
            .select("category")
            .eq("published", true);
            
           if(!allError && allPosts) {
             const catMap = allPosts.reduce((acc, post) => {
               const cat = post.category || "Uncategorized";
               acc[cat] = (acc[cat] || 0) + 1;
               return acc;
             }, {});
             
             const catArray = Object.entries(catMap).map(([name, count]) => ({ name, count }));
             setCategories([{ name: "all", count: allPosts.length }, ...catArray]);
           }
        }

      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen py-12 px-4">
      <SEO 
        title="VLSI Tutorials & Articles" 
        description="Browse in-depth articles on Floorplanning, Static Timing Analysis (STA), TCL Scripting, and Linux for VLSI engineers."
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Blog & Tutorials
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
            In-depth articles on VLSI design, physical design, EDA tools, and semiconductor engineering.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-mono uppercase tracking-wider text-gray-600 font-semibold">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wider transition-all duration-200 ${
                  selectedCategory === cat.name
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
                data-testid={`category-filter-${cat.name}`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shimmer h-96"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-body text-lg">No posts found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 card-hover group h-full flex flex-col"
                  data-testid={`blog-post-${post.slug}`}
                >
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider rounded-full bg-blue-100 text-blue-700">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                        <Clock size={12} />
                        {post.reading_time} min
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                        <Eye size={12} />
                        {post.views}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-body line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
                        Read
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}