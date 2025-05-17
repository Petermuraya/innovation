
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

// Sample projects data
const projectsData = [
  {
    id: 1,
    title: "Smart Campus IoT System",
    description: "A network of IoT devices to monitor and optimize energy usage across campus buildings.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fit=crop&w=600&h=350",
    tags: ["IoT", "Python", "Raspberry Pi"],
    author: "Jane Smith",
    githubUrl: "https://github.com/",
    category: "IoT",
  },
  {
    id: 2,
    title: "Agritech Mobile App",
    description: "Mobile application connecting local farmers with markets and providing agricultural insights.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?fit=crop&w=600&h=350",
    tags: ["React Native", "Node.js", "MongoDB"],
    author: "John Doe",
    githubUrl: "https://github.com/",
    category: "Mobile",
  },
  {
    id: 3,
    title: "Student Community Portal",
    description: "Web platform for students to connect, share resources, and collaborate on academic projects.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=600&h=350",
    tags: ["React", "Firebase", "Tailwind"],
    author: "Mary Johnson",
    githubUrl: "https://github.com/",
    category: "Web",
  },
  {
    id: 4,
    title: "AI Study Assistant",
    description: "AI-powered application to help students organize study materials and create personalized learning plans.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?fit=crop&w=600&h=350",
    tags: ["Python", "TensorFlow", "Flask"],
    author: "David Kim",
    githubUrl: "https://github.com/",
    category: "AI",
  },
  {
    id: 5,
    title: "Community Marketplace",
    description: "Platform for students to buy, sell, and exchange books, electronics, and other items within the campus.",
    image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?fit=crop&w=600&h=350",
    tags: ["Vue.js", "Express", "MongoDB"],
    author: "Sarah Chen",
    githubUrl: "https://github.com/",
    category: "Web",
  },
  {
    id: 6,
    title: "Campus Navigation AR App",
    description: "Augmented reality app to help new students navigate around the campus with interactive directions.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fit=crop&w=600&h=350",
    tags: ["Unity", "ARKit", "C#"],
    author: "Michael Brown",
    githubUrl: "https://github.com/",
    category: "Mobile",
  },
];

// Extract unique categories
const categories = ["All", ...new Set(projectsData.map(project => project.category))];

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Filter projects based on search and category
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-bold mb-6">
              <span className="gradient-text">Projects Gallery</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover innovative projects created by our community members
            </p>
            <Button asChild>
              <Link to="/submit-project">Submit Your Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          {/* Filters */}
          <div className="mb-12 flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <Input
                placeholder="Search projects by name, description or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:w-1/3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="card-hover overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>By {project.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link 
                      to={`/projects/${project.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      View Details
                    </Link>
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                      </svg>
                      <span>GitHub</span>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No projects match your search criteria.</p>
              <Button variant="outline" onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
