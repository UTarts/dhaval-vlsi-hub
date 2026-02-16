import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image, url, type = "website" }) {
  const siteTitle = "Dhaval Shukla | VLSI Physical Design & Career Guidance";
  const defaultDescription = "Expert tutorials on VLSI Physical Design, SystemVerilog, and EDA tools. Career guidance for aspiring semiconductor engineers.";
  
  const defaultImage = "https://tzaxthrqwfgbrcqmtuec.supabase.co/storage/v1/object/public/images/dhavalshukla.jpg"; 

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | Dhaval Shukla` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title ? `${title} | Dhaval Shukla` : siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | Dhaval Shukla` : siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}