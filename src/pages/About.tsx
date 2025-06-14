
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Users, Target, Lightbulb, Award } from "lucide-react";

// Updated team data
const teamMembers = [
  {
    name: "Brenda Chepngeno",
    role: "Vice-Secretary",
    image: "https://i.postimg.cc/B6zjYGxK/brenda.png",
    bio: "Computer Science student and Full Stack Developer.",
    linkedin: "https://www.linkedin.com/in/brenda-chepngeno-048058267"
  },
  {
    name: "Juliana Kavinya Safari",
    role: "Deputy President",
    image: "https://i.postimg.cc/0jfX7cgr/safari.jpg",
    bio: "Computer Science student passionate about leadership and tech communities.",
    linkedin: "https://www.linkedin.com/in/juliana-safari-6833b12a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/JulianaKavinya"
  },
  {
    name: "Jane Muraya",
    role: "Cybersecurity Lead",
    image: "https://i.postimg.cc/NF6SpmV2/jane.jpg",
    bio: "Cybersecurity enthusiast dedicated to digital safety and ethical hacking.",
    linkedin: "https://www.linkedin.com/in/jane-muraya-a00b63277",
    github: "https://github.com/Janemura"
  },
  {
    name: "Kalama Brian Ziro",
    role: "Organizing Secretary",
    image: "https://i.postimg.cc/bwx0rLnt/brian.jpg",
    bio: "BSc Actuarial Science student with a keen interest in data-driven decisions.",
    linkedin: "https://www.linkedin.com/in/brian-ziro-045356357?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/BrianZiro"
  },
  {
    name: "Fabian Musau",
    role: "Web Community Lead & Innovation Club Secretary",
    image: "https://i.postimg.cc/y8NHLpTm/fabian.png",
    bio: "Third-year Computer Science student passionate about web development and innovation.",
    linkedin: "https://www.linkedin.com/in/fabian-musau/"
  },
  {
    name: "Benjamin Justin",
    role: "President & Blockchain and Web3 Community Lead",
    image: "https://i.postimg.cc/hPDvqrrj/benja.jpg",
    bio: "BSc Information Technology student pioneering blockchain and decentralized tech communities.",
    linkedin: "https://www.linkedin.com/in/benjamin-justin-3291572b1"
  }
];

// Sample partners data
const partners = [
  {
    name: "Akiliedge Solutions",
    logo: "https://i.postimg.cc/sxmVXMzS/logo1-BEr67y-XY.png",
    url: "https://www.akiliedgesolutions.co.ke/",
  },
  {
    name: "InnovateHub",
    logo: "https://via.placeholder.com/150x80?text=InnovateHub",
    url: "#",
  },
  {
    name: "CodeLabs",
    logo: "https://via.placeholder.com/150x80?text=CodeLabs",
    url: "#",
  },
  {
    name: "Digital Kenya",
    logo: "https://via.placeholder.com/150x80?text=Digital+Kenya",
    url: "#",
  },
];

const values = [
  {
    icon: Target,
    title: "Innovation First",
    description: "We prioritize creative solutions and cutting-edge technology to solve real-world problems."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Building a supportive network where members collaborate, learn, and grow together."
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description: "Fostering an environment of constant skill development and knowledge sharing."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Striving for the highest standards in all our projects and initiatives."
  }
];

const About = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-100/20 to-transparent -z-10" />

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container-custom">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h1 className="font-bold mb-8 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-transparent">
              About <span className="text-emerald-600">Karatina Innovation Club</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              We are a community of tech enthusiasts, innovators, and problem-solvers 
              dedicated to fostering innovation and technology leadership.
            </p>
          </AnimatedSection>
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl animate-float-medium delay-1000" />
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our community culture.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <AnimatedSection 
                key={index}
                delay={index * 150}
                animationType="scaleIn"
              >
                <Card className="h-full text-center p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animationType="fadeInLeft">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-emerald-100">
                <h2 className="text-3xl font-bold mb-6 text-emerald-600 flex items-center">
                  <Target className="w-8 h-8 mr-3" />
                  Our Mission
                </h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Our mission is to empower students with the knowledge, skills, and resources needed to
                  become innovators and technology leaders. We strive to create an environment where
                  students can learn, collaborate, and build solutions that address real-world problems.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Through workshops, hackathons, project collaborations, and industry connections, we 
                  aim to bridge the gap between academic learning and practical application in the 
                  technology field.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animationType="fadeInRight" delay={200}>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 shadow-xl text-white">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Lightbulb className="w-8 h-8 mr-3" />
                  Our Vision
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-emerald-50">
                  We envision a future where Karatina University is recognized as a hub for technological
                  innovation, producing graduates who are not just job-seekers but job-creators and problem-solvers.
                </p>
                <p className="text-lg leading-relaxed text-emerald-50">
                  Our vision is to build a strong community of tech-savvy individuals who collaborate to 
                  develop innovative solutions, contribute to open-source projects, and make a positive 
                  impact in society through technology.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-emerald-50">
        <div className="container-custom">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Our Journey</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <AnimatedSection delay={200}>
                <p className="text-xl leading-relaxed mb-6">
                  Founded in 2020, Karatina Innovation Club began as a small group of computer science students
                  who wanted to extend their learning beyond the classroom. What started as informal coding sessions
                  quickly grew into a structured club with a clear mission to foster innovation and technology leadership.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={400}>
                <p className="text-xl leading-relaxed mb-6">
                  Over the years, we have grown from a handful of members to hundreds of active participants across
                  various disciplines. Our initiatives have expanded from basic coding workshops to comprehensive
                  programs including hackathons, industry talks, project incubation, and community outreach.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={600}>
                <p className="text-xl leading-relaxed mb-12">
                  Today, we continue to evolve and adapt to the ever-changing technology landscape, ensuring that
                  our members are equipped with relevant skills and connected to opportunities in the tech industry.
                </p>
              </AnimatedSection>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { year: "2020", event: "Club Founded" },
                { year: "2021", event: "First Hackathon" },
                { year: "2023", event: "5 Tech Communities" },
                { year: "2025", event: "National Recognition" }
              ].map((milestone, index) => (
                <AnimatedSection 
                  key={index}
                  delay={800 + index * 100}
                  animationType="scaleIn"
                >
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center border border-emerald-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <p className="text-3xl font-bold text-emerald-600 mb-2">{milestone.year}</p>
                    <p className="text-sm font-medium text-gray-600">{milestone.event}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals who work tirelessly to lead and grow our community
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <AnimatedSection 
                key={index}
                delay={index * 150}
                animationType="fadeInUp"
              >
                <Card className="h-full card-hover border-0 shadow-lg bg-white hover:shadow-2xl transition-all duration-500 group">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto rounded-full overflow-hidden w-32 h-32 mb-6 ring-4 ring-emerald-100 group-hover:ring-emerald-200 transition-all duration-300">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardTitle className="text-xl text-gray-800">{member.name}</CardTitle>
                    <CardDescription className="text-emerald-600 font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center leading-relaxed">{member.bio}</p>
                  </CardContent>
                  <CardFooter className="flex justify-center gap-4 pt-4">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-110 transition-all duration-300"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                    {member.github && (
                      <a 
                        href={member.github}
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all duration-300"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    )}
                  </CardFooter>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Sponsors */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-gray-50">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Partners & Sponsors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're grateful for the support of these organizations in our mission
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {partners.map((partner, index) => (
              <AnimatedSection 
                key={index}
                delay={index * 100}
                animationType="scaleIn"
              >
                <a 
                  href={partner.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block bg-white rounded-xl p-8 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-h-16 opacity-70 hover:opacity-100 transition-opacity duration-300"
                  />
                </a>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection delay={600} className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 max-w-2xl mx-auto">
              <p className="text-xl text-gray-700 mb-6">
                Interested in partnering with Karatina Innovation Club?
              </p>
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/contact">Become a Partner</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default About;
