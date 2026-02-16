import { Link } from "react-router-dom";
import { Cpu, Github, Linkedin, Twitter, Youtube, Lock, LockOpen, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="border-t border-gray-200 bg-white pb-24 md:pb-0" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Cpu size={24} className="text-blue-600" />
              <span className="font-heading font-bold text-xl uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dhaval Shukla
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm font-body">
              Physical Design Lead Engineer crafting AI chips at the nanometer scale.
              Sharing knowledge on VLSI, EDA tools, and engineering careers.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  data-testid={`footer-social-${social.label.toLowerCase()}`}
                  className="p-2 border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
              Navigate
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/about", label: "About" },
                { to: "/blog", label: "Blog" },
                { to: "/projects", label: "Projects" },
                { to: "/resources", label: "Resources" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-body"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
              Topics
            </h4>
            <div className="flex flex-col gap-2">
              {["Physical Design", "Floorplanning", "TCL Scripting", "Linux", "Career Guides"].map((topic) => (
                <Link
                  key={topic}
                  to="/blog"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-body"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Updated Footer Bottom with Logo */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs text-gray-500 font-mono text-center">
            <span>&copy; {new Date().getFullYear()} Dhaval Shukla. All rights reserved.</span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="flex items-center justify-center gap-2">
              Designed & Developed by
              <a 
                href="https://www.utarts.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5"
              >
                <img 
                  src="https://tzaxthrqwfgbrcqmtuec.supabase.co/storage/v1/object/public/images/UTArt_Logo.webp" 
                  alt="UT Arts Logo" 
                  className="h-6 w-6 rounded-full object-cover border border-gray-200"
                />
                UT Arts
                <ExternalLink size={10} />
              </a>
            </span>
          </div>
          
          <Link
            to={user ? "/admin" : "/admin/login"}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors font-mono group"
            data-testid="footer-admin-link"
          >
            {user ? (
              <>
                <LockOpen size={14} className="group-hover:text-blue-600" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <Lock size={14} className="group-hover:text-blue-600" />
                <span>Admin</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </footer>
  );
}