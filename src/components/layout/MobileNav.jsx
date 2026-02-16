import { Link, useLocation } from "react-router-dom";
import { Menu, X, Cpu, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
];

export default function MobileNav({ onSearchClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden glass border-b border-gray-200"
        data-testid="mobile-navbar"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Cpu size={20} className="text-blue-600" />
            <span className="font-heading font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dhaval Shukla
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onSearchClick}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              data-testid="mobile-search-button"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              data-testid="mobile-menu-button"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              data-testid="mobile-nav-overlay"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-[57px] right-0 bottom-0 w-64 bg-white border-l border-gray-200 z-50 md:hidden shadow-2xl"
              data-testid="mobile-nav-menu"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to ||
                    (link.to !== "/" && location.pathname.startsWith(link.to));
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      className={`px-4 py-3 text-sm font-mono uppercase tracking-wider transition-all duration-200 rounded-lg ${
                        isActive
                          ? "text-blue-600 bg-blue-50 font-semibold"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
