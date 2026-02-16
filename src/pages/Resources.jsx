import { useEffect, useState } from "react";
import { ExternalLink, BookOpen, Video, Wrench, FileText, Users, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/components/shared/SEO";

const iconMap = {
  BookOpen,
  Video,
  Wrench,
  FileText,
  Users,
  GraduationCap,
  PlayCircle: Video,
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || BookOpen;
    return Icon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      course: "from-blue-500 to-cyan-500",
      tool: "from-purple-500 to-pink-500",
      book: "from-green-500 to-teal-500",
      documentation: "from-orange-500 to-red-500",
      community: "from-indigo-500 to-purple-500",
      video: "from-red-500 to-pink-500",
    };
    return colors[category] || "from-blue-500 to-purple-500";
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <SEO 
        title="Learning Resources" 
        description="Curated list of the best books, courses, and tools for learning VLSI Physical Design and SystemVerilog."
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Learning Resources
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
            Curated collection of books, courses, tools, and communities to accelerate your VLSI learning journey.
          </p>
        </motion.div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shimmer h-48"></div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-body text-lg">No resources available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => {
              const Icon = getIcon(resource.icon);
              const colorClass = getCategoryColor(resource.category);

              return (
                <motion.a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 card-hover group"
                  data-testid={`resource-${resource.id}`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Category Badge */}
                  <span className="inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 mb-3">
                    {resource.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm font-body mb-4 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                    Learn More
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-blue-100 font-body mb-6 max-w-2xl mx-auto">
            Have a suggestion for a resource that should be included? Let me know and I'll add it to the list!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            data-testid="resources-contact-button"
          >
            Suggest a Resource
          </a>
        </motion.div>
      </div>
    </div>
  );
}