
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Target, 
  Lightbulb, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Award,
  Rocket,
  Code,
  Globe
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We foster creativity and encourage breakthrough thinking in technology."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork and collective problem-solving."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do."
    },
    {
      icon: Heart,
      title: "Inclusivity",
      description: "We welcome everyone regardless of their background or skill level."
    }
  ];

  const achievements = [
    { number: "500+", label: "Active Members" },
    { number: "50+", label: "Completed Projects" },
    { number: "30+", label: "Events Per Year" },
    { number: "15+", label: "Industry Partners" }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@kuic.org",
      link: "mailto:info@kuic.org"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+254 700 000 000",
      link: "tel:+254700000000"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Karatina University, Karatina",
      link: "https://maps.google.com/?q=Karatina+University"
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: "Mon-Fri: 8AM-5PM",
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-kic-lightGray via-white to-kic-green-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-kic-green-600 via-kic-green-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-500" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-medium">
              <Rocket className="w-4 h-4 mr-2" />
              Established 2020
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-cyan-200 bg-clip-text text-transparent">
              About KUIC
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-kic-green-100 leading-relaxed">
              Empowering the next generation of innovators through technology, collaboration, and creative problem-solving.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-2">
                <Code className="w-4 h-4 mr-2" />
                Technology
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Community
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Innovation
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-kic-green-200 hover:border-kic-green-400 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-kic-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-3 text-2xl text-kic-green-700">
                  <Target className="w-8 h-8" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  To create a vibrant ecosystem where students can explore, learn, and innovate in technology. 
                  We aim to bridge the gap between academic learning and real-world application through 
                  hands-on projects, mentorship, and industry connections.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-kic-green-200 hover:border-kic-green-400 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50">
                <CardTitle className="flex items-center gap-3 text-2xl text-kic-green-700">
                  <Lightbulb className="w-8 h-8" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  To be the leading innovation hub in East Africa, producing world-class technologists 
                  and entrepreneurs who solve global challenges through creative and sustainable solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-r from-kic-green-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-kic-green-700 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape our community culture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-kic-green-300">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-kic-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-kic-green-700 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-kic-green-700 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Building the next generation of tech leaders through community, education and innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-kic-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{achievement.number}</div>
                  <div className="text-kic-green-100 font-medium">{achievement.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-kic-green-600 via-kic-green-700 to-emerald-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-kic-green-100 max-w-2xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              const content = (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{contact.label}</h3>
                    <p className="text-kic-green-100">{contact.value}</p>
                  </CardContent>
                </Card>
              );
              
              return contact.link ? (
                <a key={index} href={contact.link} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                content
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-white text-kic-green-700 hover:bg-kic-green-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <a href="mailto:info@kuic.org">
                <Mail className="w-5 h-5 mr-2" />
                Send us a Message
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
