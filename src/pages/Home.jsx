import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Clock, Eye, Sparkles, Code2, Cpu, BookOpen, FileText, Wrench, Users, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/shared/SEO";
import { supabase } from "@/lib/supabaseClient";

// Icon dictionary to match strings from the admin dashboard to actual SVG components
const iconMap = {
  Code2, Cpu, Eye, TrendingUp, BookOpen, FileText, Wrench, Users, GraduationCap
};

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Smart Fallback State: Keeps layout perfect before database loads
  const [pageData, setPageData] = useState({
    hero_title: "Dhaval Shukla",
    hero_subtitle: "Physical Design Lead Engineer",
    hero_description: "Crafting AI chips at the nanometer scale. Sharing knowledge on VLSI design, EDA tools, physical design flows, and semiconductor engineering careers.",
    hero_image: "https://tzaxthrqwfgbrcqmtuec.supabase.co/storage/v1/object/public/images/dhavalshukla.jpg",
    stats: [
      { icon: "Code2", label: "Blog Posts", value: "50+" },
      { icon: "Cpu", label: "Projects", value: "15+" },
      { icon: "Eye", label: "Total Views", value: "10K+" },
      { icon: "TrendingUp", label: "Years Experience", value: "8+" },
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CMS Data and Posts simultaneously
        const [settingsRes, postsRes] = await Promise.all([
          supabase.from("site_settings").select("value").eq("id", "home_page").single(),
          supabase.from("posts").select("*").eq("published", true).eq("featured", true).order("created_at", { ascending: false }).limit(3)
        ]);

        if (settingsRes.data?.value) {
          setPageData(settingsRes.data.value);
        }
        
        if (postsRes.data) {
          setFeaturedPosts(postsRes.data);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO 
        title="Home" 
        description={`Welcome to the hub for VLSI Physical Design by ${pageData.hero_title}. ${pageData.hero_description}`}
      />
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 shadow-sm mb-6">
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-sm font-mono text-gray-700 uppercase tracking-wider">Welcome to VLSI Hub</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {pageData.hero_title}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 font-semibold font-body mb-4">
                {pageData.hero_subtitle}
              </p>
              
              <p className="text-base md:text-lg text-gray-600 font-body mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {pageData.hero_description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/blog"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
                >
                  Explore Blog
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/projects"
                  className="px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  View Projects
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative w-[15rem] md:w-[25rem] mx-auto">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-200">
                  <Cpu size={24} className="text-blue-600" />
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-1/3 -left-6 bg-white p-3 rounded-xl shadow-lg border border-gray-200">
                  <Code2 size={24} className="text-purple-600" />
                </motion.div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-20 -right-6 bg-white p-3 rounded-xl shadow-lg border border-gray-200">
                  <TrendingUp size={24} className="text-pink-600" />
                </motion.div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-3 border-2 border-gray-100">
                    <div className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-blue-50 to-purple-50">
                      <img
                        src={pageData.hero_image}
                        alt={pageData.hero_title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"></div>
                    </div>
                  </div>
                  <div className="absolute -z-10 top-8 -right-8 w-full h-full border-2 border-blue-200 rounded-3xl"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats CMS Rendering */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {pageData.stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Eye;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center hover:shadow-lg transition-all duration-200 border border-gray-200 card-hover"
                >
                  <IconComponent size={24} className="mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">Featured Articles</h2>
              <p className="text-gray-600 font-body">Latest tutorials and guides on VLSI design</p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group">
              View all <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shimmer h-64"></div>)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <Link to={`/blog/${post.slug}`} className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 card-hover group h-full">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider rounded-full bg-blue-100 text-blue-700">{post.category}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-mono"><Clock size={12} /> {post.reading_time} min</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm font-body line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
                        Read more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">View all articles <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-10 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Learn VLSI Design?</h2>
            <p className="text-lg text-blue-100 font-body mb-8 max-w-2xl mx-auto">
              Explore comprehensive tutorials, real-world projects, and industry insights to accelerate your semiconductor engineering career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/resources" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">Browse Resources</Link>
              <Link to="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-200">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}