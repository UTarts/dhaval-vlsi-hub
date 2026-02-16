const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const SITE_URL = "https://dhavalshukla.com"; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log("Generating sitemap...");

  const staticPages = [
    "",
    "/about",
    "/blog",
    "/projects",
    "/resources",
    "/contact"
  ];

  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true);

  if (error) {
    console.error("Error fetching posts:", error);
    process.exit(1);
  }

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add Static Pages
  staticPages.forEach(page => {
    // LOGIC CHANGE: If page is empty (Home), priority is 1.0, else 0.8
    const priority = page === "" ? "1.0" : "0.8";
    
    sitemap += `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
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

  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log("✅ Sitemap generated at ./public/sitemap.xml");
}

generateSitemap();