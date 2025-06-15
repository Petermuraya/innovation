
// Configuration and constants for the chatbot
export const KNOWLEDGE_CUTOFF = '2024-12-01';
export const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Upgraded to more intelligent model
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const CLUB_INFO = {
  upcomingEvents: [
    { name: "Advanced AI Workshop", date: "2024-12-20", registrationDeadline: "2024-12-15" },
    { name: "Blockchain Development Bootcamp", date: "2025-01-15", registrationDeadline: "2025-01-10" },
    { name: "Full-Stack Development Marathon", date: "2025-02-10", registrationDeadline: "2025-02-05" },
    { name: "Innovation & Entrepreneurship Summit", date: "2025-03-05", registrationDeadline: "2025-02-28" }
  ],
  popularProjects: [
    "KUIC Student Portal Redesign",
    "Campus Navigation App with AR",
    "AI-powered Library Assistant",
    "E-waste Recycling Platform",
    "Smart Attendance System with Facial Recognition",
    "Blockchain-based Certificate Verification",
    "IoT Campus Energy Management"
  ],
  faqs: {
    registration: "Registration typically takes 2-3 business days for approval. Pro tip: Complete your profile for faster processing!",
    membership: "All active Karatina University students are eligible. We also accept alumni and industry professionals as associate members.",
    events: "Most events are free for members. Premium workshops may have small fees (usually KES 200-500).",
    projects: "Members can submit projects through the dashboard. We provide mentorship, resources, and showcase opportunities.",
    blog: "Members can write and publish blog posts after admin verification. Great way to share knowledge and build your portfolio!",
    careers: "We connect members with internships, job opportunities, and industry mentors. Check the careers section regularly!",
    certificates: "Earn certificates for completing workshops, hackathons, and contributing to club projects."
  },
  websiteFeatures: {
    dashboard: "Personal workspace with projects, events, certificates, and profile management",
    blogging: "Write and publish blog posts with rich media support",
    projects: "Submit and showcase your projects with detailed tech stack information",
    events: "Browse and register for upcoming events and workshops with calendar integration",
    careers: "Access job opportunities, internships, and career resources",
    leaderboard: "View member rankings based on participation and achievements",
    elections: "Participate in club elections and vote for leadership positions",
    certificates: "View and download your achievement certificates",
    communities: "Join specialized tech communities (Web Dev, Mobile, AI/ML, Cybersecurity, IoT)",
    payments: "Manage membership payments and event fees securely",
    constitution: "Access club constitution and governance documents"
  },
  techStacks: {
    web: ["React", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask"],
    mobile: ["React Native", "Flutter", "Kotlin", "Swift", "Ionic"],
    ai: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV"],
    blockchain: ["Solidity", "Web3.js", "Ethereum", "Hyperledger"],
    cloud: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
    database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Supabase"]
  }
};
