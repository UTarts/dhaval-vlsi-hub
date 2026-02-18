import "@/App.css";
import React, { Suspense, lazy } from "react"; // Added imports
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";

// Lazy Load Pages
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Projects = lazy(() => import("@/pages/Projects"));
const Resources = lazy(() => import("@/pages/Resources"));
const Contact = lazy(() => import("@/pages/Contact"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const PostEditor = lazy(() => import("@/pages/admin/PostEditor"));
const PostManager = lazy(() => import("@/pages/admin/PostManager"));
const SiteManager = lazy(() => import("@/pages/admin/SiteManager"));

// Loading Spinner Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/resources" element={<Layout><Resources /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<PostManager />} />
            <Route path="/admin/posts/new" element={<PostEditor />} />
            <Route path="/admin/posts/edit/:id" element={<PostEditor />} />
            <Route path="/admin/settings" element={<SiteManager />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;