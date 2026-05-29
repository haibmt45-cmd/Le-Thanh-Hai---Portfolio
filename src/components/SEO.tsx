import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Lê Thanh Hải | Portfolio", 
  description = "Portfolio của Lê Thanh Hải - Chuyên gia trong lĩnh vực sự kiện, nhiếp ảnh và video.", 
  keywords = "Lê Thanh Hải, portfolio, developer, event manager, nhiếp ảnh gia, video maker, event, design, vietnam", 
  image = "https://drive.google.com/thumbnail?id=1oHO4kreco9ff_UzeniNEoXUf9JImcfsm&sz=w1200", 
  url = "https://lethanhhai.com" 
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
