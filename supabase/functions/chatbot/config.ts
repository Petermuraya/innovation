
// Configuration and constants for the chatbot
export const KNOWLEDGE_CUTOFF = '2024-06-01';
export const GROQ_MODEL = 'llama3-70b-8192';
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const CLUB_INFO = {
  upcomingEvents: [
    { name: "Web Development Bootcamp", date: "2024-07-15", registrationDeadline: "2024-07-10" },
    { name: "AI Hackathon", date: "2024-08-20", registrationDeadline: "2024-08-10" },
    { name: "Tech Career Fair", date: "2024-09-05", registrationDeadline: "2024-08-25" },
    { name: "Innovation Showcase", date: "2024-09-20", registrationDeadline: "2024-09-15" }
  ],
  popularProjects: [
    "KUIC Student Portal Redesign",
    "Campus Navigation App",
    "AI-powered Library Assistant",
    "E-waste Recycling Platform",
    "Smart Attendance System"
  ],
  faqs: {
    registration: "Registration typically takes 2-3 business days for approval.",
    membership: "All active Karatina University students are eligible to join.",
    events: "Most events are free for members, some workshops may have small fees.",
    projects: "Members can submit projects through the dashboard for review and showcase.",
    blog: "Members can write and publish blog posts after admin verification."
  },
  websiteFeatures: {
    dashboard: "Personal workspace with projects, events, certificates, and profile management",
    blogging: "Write and publish blog posts with image/video attachments",
    projects: "Submit and showcase your projects with tech stack details",
    events: "Browse and register for upcoming events and workshops",
    careers: "Access job opportunities and career resources",
    leaderboard: "View member rankings based on participation and achievements",
    elections: "Participate in club elections and vote for leadership positions",
    certificates: "View and download your achievement certificates",
    communities: "Join specialized communities within the club",
    payments: "Manage membership payments and event fees"
  }
};
