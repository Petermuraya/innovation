import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with React: A Beginner's Guide",
    excerpt: "Learn the fundamentals of React development and start building modern web applications with this comprehensive guide.",
    content: "React has revolutionized web development...",
    author: "Sarah Johnson",
    date: "2025-01-20",
    readTime: "8 min read",
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?fit=crop&w=800&h=400",
    featured: true,
  },
  {
    id: 2,
    title: "Building APIs with Node.js and Express",
    excerpt: "Master backend development with Node.js and Express framework to create robust and scalable APIs.",
    content: "Backend development is crucial for modern applications...",
    author: "Michael Chen",
    date: "2025-01-18",
    readTime: "12 min read",
    category: "Backend Development",
    tags: ["Node.js", "Express", "API"],
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?fit=crop&w=800&h=400",
    featured: true,
  },
  {
    id: 3,
    title: "Introduction to Machine Learning with Python",
    excerpt: "Dive into the world of artificial intelligence and learn how to build your first machine learning models.",
    content: "Machine learning is transforming industries...",
    author: "Dr. Emily Rodriguez",
    date: "2025-01-15",
    readTime: "15 min read",
    category: "AI & Machine Learning",
    tags: ["Python", "Machine Learning", "AI"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?fit=crop&w=800&h=400",
    featured: false,
  },
  {
    id: 4,
    title: "Cybersecurity Best Practices for Developers",
    excerpt: "Essential security practices every developer should know to build secure applications and protect user data.",
    content: "Security should be a priority in every development project...",
    author: "James Wilson",
    date: "2025-01-12",
    readTime: "10 min read",
    category: "Cybersecurity",
    tags: ["Security", "Best Practices", "Development"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?fit=crop&w=800&h=400",
    featured: false,
  },
  {
    id: 5,
    title: "Mobile App Development with Flutter",
    excerpt: "Learn how to build cross-platform mobile applications using Google's Flutter framework.",
    content: "Flutter enables developers to create beautiful mobile apps...",
    author: "Lisa Park",
    date: "2025-01-10",
    readTime: "11 min read",
    category: "Mobile Development",
    tags: ["Flutter", "Mobile", "Cross-platform"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?fit=crop&w=800&h=400",
    featured: false,
  },
  {
    id: 6,
    title: "Cloud Computing: AWS vs Azure vs Google Cloud",
    excerpt: "Compare the major cloud platforms and learn which one is best suited for your next project.",
    content: "Choosing the right cloud platform is crucial for success...",
    author: "David Kumar",
    date: "2025-01-08",
    readTime: "14 min read",
    category: "Cloud Computing",
    tags: ["AWS", "Azure", "Google Cloud"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?fit=crop&w=800&h=400",
    featured: false,
  },
];

const categories = ["All", "Web Development", "Backend Development", "AI & Machine Learning", "Cybersecurity", "Mobile Development", "Cloud Computing"];
const featuredPosts = blogPosts.filter(post => post.featured);
const regularPosts = blogPosts.filter(post => !post.featured);

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <SEOHead
        title="Blog & News"
        description="Stay updated with the latest tech trends, innovation stories, and insights from the Karatina University Innovation Club community."
        canonical="/blogs"
        keywords={["tech blog", "innovation news", "technology trends", "student articles", "programming tutorials"]}
      />
      
      <StructuredData type="webpage" />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-bold mb-6">
              <span className="gradient-text">Tech Blog</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Stay updated with the latest trends in technology, programming tutorials, and insights from industry experts
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="card-hover overflow-hidden">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-emerald-600">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="absolute top-4 right-4 bg-white">
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span>{post.readTime}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <Link to={`/blogs/${post.id}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">All Articles</h2>
          
          {/* Category Filter */}
          <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full max-w-4xl">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <Card key={post.id} className="card-hover overflow-hidden">
                        <div className="relative">
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-48 object-cover"
                          />
                          <Badge variant="outline" className="absolute top-3 right-3 bg-white">
                            {post.category}
                          </Badge>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                          <CardDescription className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{post.readTime}</span>
                            <Button size="sm" asChild>
                              <Link to={`/blogs/${post.id}`}>
                                Read More
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">No articles found.</p>
                    <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
