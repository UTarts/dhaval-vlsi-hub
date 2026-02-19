import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Clock, LogOut, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function PostManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }
    fetchPosts();
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post: " + error.message);
    }
  };

  // NEW: Logic to handle clicking the View (Eye) icon
  const handleViewPost = (post) => {
    if (post.published) {
      // If published, open the public blog post in a new tab
      window.open(`/blog/${post.slug}`, "_blank");
    } else {
      // If it's a draft, show an alert directing them to the editor preview
      alert("This post is not published yet. Please click the 'Edit' icon next to it to view its preview.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-mono">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manage Posts
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-gray-600 font-mono">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors font-semibold"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">All Posts ({posts.length})</h2>
            <p className="text-sm text-gray-600 font-body mt-1">Manage, edit, and delete your blog posts</p>
          </div>
          <Link
            to="/admin/posts/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            data-testid="create-new-post-button"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create New Post</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        {/* Posts Table */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-gray-500 font-body mb-4">No posts yet. Create your first post!</p>
            <Link
              to="/admin/posts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              <Plus size={18} />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold hidden lg:table-cell">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold hidden xl:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-mono uppercase tracking-wider text-gray-700 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-blue-50 transition-colors"
                      data-testid={`post-row-${post.id}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 font-body line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 font-mono mt-1 flex items-center gap-2">
                            <Clock size={12} />
                            {post.reading_time} min
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider rounded-full bg-blue-100 text-blue-700">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider rounded-full ${
                            post.published
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-sm text-gray-600 font-mono">
                          <Eye size={14} />
                          {post.views || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <span className="text-sm text-gray-600 font-mono">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* UPDATED: Changed from Link to button with logic */}
                          <button
                            onClick={() => handleViewPost(post)}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                            title="View Post"
                            data-testid={`view-post-${post.id}`}
                          >
                            <Eye size={16} />
                          </button>

                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            title="Edit Post"
                            data-testid={`edit-post-${post.id}`}
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete Post"
                            data-testid={`delete-post-${post.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}