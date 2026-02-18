import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Eye, Mail, TrendingUp, Plus, LogOut, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        // 1. Get Posts Stats
        const { data: posts } = await supabase.from("posts").select("id, views, published, category, title, slug");
        
        const totalPosts = posts?.length || 0;
        const publishedPosts = posts?.filter(p => p.published).length || 0;
        const totalViews = posts?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

        // 2. Get Messages Stats
        const { count: totalContacts } = await supabase.from("contacts").select("*", { count: 'exact', head: true });
        const { count: unreadContacts } = await supabase.from("contacts").select("*", { count: 'exact', head: true }).eq('read', false);

        // 3. Category Distribution
        const categoryMap = {};
        posts?.forEach(p => {
            const cat = p.category || 'Uncategorized';
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const categoryDistribution = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

        // 4. Top Posts
        const topPosts = [...(posts || [])].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

        setAnalytics({
            total_posts: totalPosts,
            published_posts: publishedPosts,
            total_views: totalViews,
            total_contacts: totalContacts || 0,
            unread_contacts: unreadContacts || 0,
            top_posts: topPosts,
            category_distribution: categoryDistribution,
            // Mocking daily views graph for now as we don't have a 'views_history' table yet
            daily_views: Array.from({ length: 7 }, (_, i) => ({
                date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                views: Math.floor(Math.random() * 50) + 10
            }))
        });

      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-mono">Loading dashboard...</p>
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
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-gray-600 font-mono">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors font-semibold"
                data-testid="admin-logout-button"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-semibold"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/posts"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-semibold"
            >
              Manage Posts
            </Link>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-semibold"
            >
              View Site
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/admin/posts/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            data-testid="admin-create-post-button"
          >
            <Plus size={18} />
            Create New Post
          </Link>
          <Link
            to="/admin/posts"
            className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            Manage Posts
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <FileText size={18} />
            Site Settings & Content
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            View Site
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { icon: FileText, label: "Total Posts", value: analytics?.total_posts || 0, color: "from-blue-500 to-cyan-500" },
            { icon: Eye, label: "Total Views", value: analytics?.total_views || 0, color: "from-purple-500 to-pink-500" },
            { icon: Mail, label: "New Messages", value: analytics?.unread_contacts || 0, color: "from-green-500 to-teal-500" },
            { icon: TrendingUp, label: "Published", value: analytics?.published_posts || 0, color: "from-orange-500 to-red-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-mono uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Views Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Views (Last 7 Days)</h3>
            {analytics?.daily_views && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics.daily_views}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Top Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Top Posts</h3>
            <div className="space-y-3">
              {analytics?.top_posts?.slice(0, 5).map((post, index) => (
                <div key={index} className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-mono whitespace-nowrap">
                    <Eye size={12} />
                    {post.views}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Category Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics?.category_distribution?.map((cat, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold font-heading text-blue-600 mb-1">{cat.count}</div>
                <div className="text-sm text-gray-700 font-mono capitalize">{cat.category}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}