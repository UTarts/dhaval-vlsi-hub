import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import Footer from "./Footer";
import SearchOverlay from "@/components/shared/SearchOverlay";

export default function Layout({ children }) {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar onSearchClick={() => setShowSearch(true)} />
      <MobileNav onSearchClick={() => setShowSearch(true)} />
      
      <main className="flex-1 pt-20 md:pt-24">
        {children}
      </main>
      
      <Footer />
      
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </div>
  );
}
