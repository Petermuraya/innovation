
import { Helmet } from 'react-helmet-async';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

interface StructuredDataProps {
  type: 'organization' | 'events' | 'webpage';
  events?: Event[];
}

const StructuredData = ({ type, events }: StructuredDataProps) => {
  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Karatina Innovation Club",
    "alternateName": "KIC",
    "url": "https://karatinatech.com",
    "logo": "https://karatinatech.com/logo.png",
    "description": "Karatina University Innovation Club - Building technology leaders of tomorrow",
    "sameAs": [
      "https://twitter.com/KaratinaInnoClub",
      "https://linkedin.com/company/karatina-innovation-club"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "General",
      "email": "info@karatinatech.com"
    }
  });

  const generateEventsSchema = () => {
    if (!events || events.length === 0) return null;
    
    return events.map(event => ({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": `${event.date}T${event.time}`,
      "location": {
        "@type": "Place",
        "name": event.location
      },
      "organizer": {
        "@type": "Organization",
        "name": "Karatina Innovation Club"
      },
      "eventStatus": "https://schema.org/EventScheduled"
    }));
  };

  const generateWebPageSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Karatina Innovation Club",
    "description": "Building technology leaders of tomorrow through innovation and collaboration",
    "publisher": {
      "@type": "Organization",
      "name": "Karatina Innovation Club"
    }
  });

  let schema;
  switch (type) {
    case 'organization':
      schema = generateOrganizationSchema();
      break;
    case 'events':
      schema = generateEventsSchema();
      break;
    case 'webpage':
      schema = generateWebPageSchema();
      break;
    default:
      schema = null;
  }

  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
