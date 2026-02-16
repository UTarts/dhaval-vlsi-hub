import { Link, useLocation } from "react-router-dom";
import { Search, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/projects", label: "Projects" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ onSearchClick }) {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 glass rounded-full px-2 py-2 shadow-lg"
      data-testid="desktop-navbar"
    >
      <Link
        to="/"
        className="flex items-center gap-2 px-3 py-1.5 mr-2"
        data-testid="nav-logo"
      >
        <Cpu size={18} className="text-blue-600" />
        <span className="font-heading font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          DS
        </span>
      </Link>

      {navLinks.map((link) => {
        const isActive = location.pathname === link.to ||
          (link.to !== "/" && location.pathname.startsWith(link.to));
        return (
          <Link
            key={link.to}
            to={link.to}
            data-testid={`nav-link-${link.label.toLowerCase()}`}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 rounded-full ${
              isActive
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      <button
        onClick={onSearchClick}
        data-testid="nav-search-button"
        className="ml-2 p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
        title="Search (Ctrl+K)"
      >
        <Search size={15} />
      </button>
    </motion.nav>
  );
}
