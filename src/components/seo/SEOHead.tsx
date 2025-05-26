
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  keywords?: string;
}

const SEOHead = ({ 
  title, 
  description, 
  canonical, 
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website",
  keywords
}: SEOHeadProps) => {
  const fullTitle = `${title} | Karatina Innovation Club`;
  const baseUrl = "https://karatinatech.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Karatina Innovation Club" />
    </Helmet>
  );
};

export default SEOHead;
