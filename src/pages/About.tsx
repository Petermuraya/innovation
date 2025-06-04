
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    name: "TechCo",
    logo: "https://via.placeholder.com/150x80?text=TechCo",
    url: "#",
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

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-bold mb-6">
              About <span className="gradient-text">Karatina Innovation Club</span>
            </h1>
            <p className="text-xl text-gray-600">
              We are a community of tech enthusiasts, innovators, and problem-solvers 
              dedicated to fostering innovation and technology leadership.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                Our mission is to empower students with the knowledge, skills, and resources needed to
                become innovators and technology leaders. We strive to create an environment where
                students can learn, collaborate, and build solutions that address real-world problems.
              </p>
              <p className="text-gray-600">
                Through workshops, hackathons, project collaborations, and industry connections, we 
                aim to bridge the gap between academic learning and practical application in the 
                technology field.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-600 mb-4">
                We envision a future where Karatina University is recognized as a hub for technological
                innovation, producing graduates who are not just job-seekers but job-creators and problem-solvers.
              </p>
              <p className="text-gray-600">
                Our vision is to build a strong community of tech-savvy individuals who collaborate to 
                develop innovative solutions, contribute to open-source projects, and make a positive 
                impact in society through technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, Karatina Innovation Club began as a small group of computer science students
              who wanted to extend their learning beyond the classroom. What started as informal coding sessions
              quickly grew into a structured club with a clear mission to foster innovation and technology leadership.
            </p>
            <p className="text-gray-600 mb-4">
              Over the years, we have grown from a handful of members to hundreds of active participants across
              various disciplines. Our initiatives have expanded from basic coding workshops to comprehensive
              programs including hackathons, industry talks, project incubation, and community outreach.
            </p>
            <p className="text-gray-600">
              Today, we continue to evolve and adapt to the ever-changing technology landscape, ensuring that
              our members are equipped with relevant skills and connected to opportunities in the tech industry.
            </p>
            
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-innovation-600">2020</p>
                <p className="text-sm text-gray-500">Club Founded</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-innovation-600">2021</p>
                <p className="text-sm text-gray-500">First Hackathon</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-innovation-600">2023</p>
                <p className="text-sm text-gray-500">5 Tech Communities</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-innovation-600">2025</p>
                <p className="text-sm text-gray-500">National Recognition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-2 text-center">Leadership Team</h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Meet the dedicated individuals who work tirelessly to lead and grow our community
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="card-hover">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto rounded-full overflow-hidden w-32 h-32 mb-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </CardContent>
                <CardFooter className="flex justify-center gap-3">
                  <a href="#" className="text-gray-500 hover:text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Sponsors */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-2 text-center">Partners & Sponsors</h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            We're grateful for the support of these organizations in our mission
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <a 
                key={index} 
                href={partner.url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white rounded-lg p-6 flex items-center justify-center shadow hover:shadow-md transition-shadow"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-16"
                />
              </a>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Interested in partnering with Karatina Innovation Club?
            </p>
            <Button asChild>
              <Link to="/contact">Become a Partner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
