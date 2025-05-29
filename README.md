# 🚀 Karatina University Innovation Club Website

Welcome to the official website for the **Karatina University Innovation Club** — a vibrant community of students, technologists, designers, and entrepreneurs passionate about driving digital transformation, innovation, and problem-solving in Kenya and beyond.

This website showcases our projects, upcoming events, initiatives, and provides a platform for students to learn, collaborate, and innovate together.

---

## 📚 Table of Contents

- [📖 About the Club](#-about-the-club)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📖 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [🎨 UI Design System](#-ui-design-system)
- [📝 Project Structure](#-project-structure)
- [🚀 Deployment](#-deployment)
- [📄 License](#-license)
- [🙌 Acknowledgements](#-acknowledgements)
- [📞 Contact](#-contact)

---

## 📖 About the Club

The **Karatina University Innovation Club** is a student-led tech and entrepreneurship community that inspires, educates, and empowers students to leverage technology for social impact.  

We provide opportunities to learn new skills, work on real-world projects, participate in hackathons, and connect with industry leaders.

---

## ✨ Features

- 🌐 Official website for club activities
- 📣 Announcements and upcoming events
- 📷 Project portfolio and case studies
- 📄 Membership registration form (powered by Supabase)
- 📝 Blog and news updates
- 📊 Dashboard for administrators
- 🎨 Responsive and accessible design
- 🌈 Light & Dark Mode support

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, TailwindCSS, Shadcn/UI
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, Storage)
- **Database:** Supabase Cloud PostgreSQL
- **Version Control:** Git + GitHub
- **Deployment:** Vercel (preferred)

---

## 📖 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/karatina-innovation-club/official-website.git
cd official-website
# 📖 Getting Started

### 2️⃣ Install Dependencies

```bash
npm install
3️⃣ Configure Environment Variables
Create a .env.local file in your project root and add the following:

ini
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
4️⃣ Run the Development Server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to view the app.

⚙️ Environment Variables
Key	Purpose
NEXT_PUBLIC_SUPABASE_URL	Supabase Project API URL
NEXT_PUBLIC_SUPABASE_ANON_KEY	Public API key for the frontend
NEXT_PUBLIC_SITE_URL	Site domain or localhost URL

🎨 UI Design System
TailwindCSS for utility-first styling

Shadcn/UI for prebuilt, accessible, and customizable components

Custom brand colors & typography

Google Fonts integration for clean, modern typography