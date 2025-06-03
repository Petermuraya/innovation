
import { Helmet } from 'react-helmet-async';

interface MetaHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const MetaHead = ({ 
  title = "Karatina Innovation Club - Leading Innovation in Kenya",
  description = "Join Karatina Innovation Club, Kenya's premier innovation community. Connect with innovators, participate in events, showcase projects, and advance your tech career.",
  keywords = "innovation, technology, Kenya, Karatina, programming, coding, tech community, startups, projects, events",
  image = "/placeholder.svg",
  url = "https://kic.lovable.app",
  type = "website"
}: MetaHeadProps) => {
  const fullTitle = title.includes("KIC") ? title : `${title} | KIC`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Karatina Innovation Club" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Karatina Innovation Club" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Security Headers */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="X-Frame-Options" content="DENY" />
      <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
      <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
    </Helmet>
  );
};

export default MetaHead;
