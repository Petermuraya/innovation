
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
- 💳 Payment processing for memberships
- 🏆 Project leaderboard and member rankings
- 📜 Certificate management system

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS, Shadcn/UI Components
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form with Zod validation
- **Routing:** React Router DOM
- **State Management:** TanStack Query
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, Storage)
- **Payment Processing:** M-Pesa integration via Supabase Edge Functions
- **SEO:** React Helmet Async
- **3D Graphics:** Three.js with React Three Fiber
- **Deployment:** Vercel (recommended)

---

## 📖 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** - [Download here](https://git-scm.com/)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/karatina-innovation-club/official-website.git
cd official-website
```

### 2️⃣ Install Dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3️⃣ Environment Configuration

Copy the environment variable templates:

```bash
# Copy the environment template
cp .env.sample .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site Configuration
VITE_BASE_URL=http://localhost:5173
VITE_SITE_NAME=Karatina Innovation Club
VITE_CONTACT_EMAIL=info@karatinatech.com

# Optional: Analytics
VITE_GA_TRACKING_ID=your-google-analytics-id
```

### 4️⃣ Supabase Setup (Required for Backend Features)

1. Create a [Supabase account](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key to `.env.local`
4. Run the database migrations (if any) from the `supabase/migrations` folder

### 5️⃣ Run the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the application.

### 6️⃣ Build for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

### 7️⃣ Preview Production Build

```bash
# Using npm
npm run preview

# Using yarn
yarn preview

# Using pnpm
pnpm preview
```

---

## ⚙️ Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase Project API URL | Yes | - |
| `VITE_SUPABASE_ANON_KEY` | Public API key for the frontend | Yes | - |
| `VITE_BASE_URL` | Site domain or localhost URL | Yes | `http://localhost:5173` |
| `VITE_SITE_NAME` | Site name for SEO | No | `Karatina Innovation Club` |
| `VITE_CONTACT_EMAIL` | Contact email for the organization | No | `info@karatinatech.com` |
| `VITE_GA_TRACKING_ID` | Google Analytics tracking ID | No | - |

---

## 🎨 UI Design System

- **TailwindCSS** for utility-first styling
- **Shadcn/UI** for prebuilt, accessible, and customizable components
- **Custom brand colors** & typography defined in `tailwind.config.ts`
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for consistent iconography
- **Google Fonts** integration for clean, modern typography
- **Dark/Light mode** support with `next-themes`

### Color Palette

```css
/* Primary Colors */
--primary: 220 90% 56%;        /* Blue */
--primary-foreground: 0 0% 98%;

/* Secondary Colors */
--secondary: 220 14.3% 95.9%;
--secondary-foreground: 220.9 39.3% 11%;

/* Custom KIC Colors */
--kic-blue: #2563EB;
--kic-lightGray: #F8FAFC;
--kic-darkGray: #1E293B;
```

---

## 📝 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── home/           # Homepage specific components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── payments/       # Payment processing components
│   └── seo/            # SEO optimization components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── contexts/           # React context providers
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase client and types
├── styles/             # Global styles
└── assets/             # Static assets
```

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

### Other Platforms

The built application can be deployed to any static hosting service:
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**
- **AWS S3 + CloudFront**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation when needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for backend-as-a-service
- [Vercel](https://vercel.com/) for hosting and deployment
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for icons
- All contributors and club members

---

## 📞 Contact

- **Website:** [https://karatinatech.com](https://karatinatech.com)
- **Email:** info@karatinatech.com
- **GitHub:** [@karatina-innovation-club](https://github.com/karatina-innovation-club)
- **Twitter:** [@KaratinaTech](https://twitter.com/KaratinaTech)

---

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/karatina-innovation-club/official-website/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact us at info@karatinatech.com for additional support

---

**Made with ❤️ by the Karatina University Innovation Club**
