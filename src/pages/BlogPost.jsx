import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Eye, ArrowLeft, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import BlockRenderer from "@/components/shared/BlockRenderer";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setPost(data);
        
        // Simple view increment (Read-then-update approach for simplicity)
        // In a production app with high traffic, use an RPC function instead.
        if (data) {
            await supabase
            .from("posts")
            .update({ views: (data.views || 0) + 1 })
            .eq("id", data.id);
        }

      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shimmer" style={{ height: "600px" }}></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 font-body mb-8">The post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      {post && (
        <SEO 
          title={post.title} 
          description={post.excerpt} 
          image={post.featured_image} 
          type="article"
        />
      )}
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold mb-8 transition-colors group"
          data-testid="back-to-blog-link"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
        >
          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 font-semibold">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600 font-mono">
                <Calendar size={14} />
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600 font-mono">
                <Clock size={14} />
                {post.reading_time} min read
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-600 font-mono">
                <Eye size={14} />
                {post.views} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 font-body mb-8 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
                {post.excerpt}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 mb-8"></div>

            {/* Article Body */}
            <div className="prose max-w-none">
              <BlockRenderer blocks={post.content} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-gray-500" />
                  <span className="text-sm font-mono uppercase tracking-wider text-gray-600 font-semibold">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-lg text-sm font-mono border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  DS
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">
                    {post.author || "Dhaval Shukla"}
                  </h3>
                  <p className="text-gray-600 font-body text-sm">
                    Physical Design Lead Engineer sharing insights on VLSI design and semiconductor technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}