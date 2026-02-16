const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables from .env

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const SITE_URL = "https://dhavalshukla.com"; // Your real domain

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log("Generating sitemap...");

  // 1. Define your static pages
  const staticPages = [
    "",
    "/about",
    "/blog",
    "/projects",
    "/resources",
    "/contact"
  ];

  // 2. Fetch dynamic blog posts from Supabase
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true);

  if (error) {
    console.error("Error fetching posts:", error);
    process.exit(1);
  }

  // 3. Build the XML string
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add Static Pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add Dynamic Blog Posts
  posts.forEach(post => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  // 4. Write to the public folder
  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log("✅ Sitemap generated at ./public/sitemap.xml");
}

generateSitemap();