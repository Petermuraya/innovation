
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Sample communities data
const communities = [
  {
    id: "ai",
    name: "AI & Machine Learning",
    icon: "🤖",
    description: "Explore artificial intelligence, machine learning, and data science.",
    memberCount: 42,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "web",
    name: "Web Development",
    icon: "🌐",
    description: "Build modern web applications with the latest frameworks and tools.",
    memberCount: 58,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    icon: "☁️",
    description: "Learn about cloud infrastructure, DevOps, and serverless applications.",
    memberCount: 35,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "iot",
    name: "IoT & Embedded",
    icon: "🔌",
    description: "Design and build connected devices and embedded systems.",
    memberCount: 29,
    color: "bg-green-100 text-green-700",
  },
];

export default function CommunitiesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="font-bold mb-2">Our Communities</h2>
            <p className="text-gray-600">Join specialized tech communities based on your interests</p>
          </div>
          <Button variant="outline" asChild className="mt-4 sm:mt-0">
            <Link to="/communities">Explore All Communities</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communities.map((community) => (
            <Card key={community.id} className="card-hover">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${community.color}`}>
                  {community.icon}
                </div>
                <CardTitle className="text-xl mt-4">{community.name}</CardTitle>
                <CardDescription>{community.memberCount} members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{community.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/communities/${community.id}`}>Join Community</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
