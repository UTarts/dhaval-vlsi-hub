import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/components/shared/SEO";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase
        .from("contacts")
        .insert([formData]);

      if (error) throw error;
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <SEO 
        title="Contact Me" 
        description="Get in touch for collaboration, consulting, or career guidance in the semiconductor industry."
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
            Have a question, feedback, or collaboration opportunity? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <Mail size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900">Send a Message</h2>
            </div>

            {success ? (
              <div className="py-12 text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 font-body mb-6">
                  Thank you for reaching out. I'll get back to you soon!
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-mono uppercase tracking-wider text-gray-700 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-body"
                    placeholder="Your name"
                    data-testid="contact-name-input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-mono uppercase tracking-wider text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-body"
                    placeholder="your.email@example.com"
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-mono uppercase tracking-wider text-gray-700 font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-body resize-none"
                    placeholder="Tell me about your project, question, or feedback..."
                    data-testid="contact-message-input"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm font-body">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="contact-submit-button"
                >
                  {loading ? "Sending..." : "Send Message"}
                  <Send size={18} />
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
                Why Reach Out?
              </h3>
              <ul className="space-y-3 text-gray-700 font-body">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Questions about VLSI design or physical design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Career guidance and mentorship opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Collaboration on projects or tutorials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Consulting services for semiconductor companies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Feedback and suggestions for the blog</span>
                </li>
              </ul>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Response Time
              </h3>
              <p className="text-gray-700 font-body text-sm">
                I typically respond within 24-48 hours. For urgent inquiries, please mention it in your message.
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">
                Connect on Social Media
              </h3>
              <p className="text-gray-600 font-body text-sm mb-4">
                Follow me for daily updates, tips, and industry insights.
              </p>
              <div className="flex gap-3">
                <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors">
                  GitHub
                </a>
                <a href="#" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                  YouTube
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}