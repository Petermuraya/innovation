
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-kic-lightGray py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-kic-gray mb-8 text-center">
              About Our Innovation Club
            </h1>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Our Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    A diverse group of students, developers, and innovators working together 
                    to create impactful solutions and foster technological advancement.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    To empower students with practical skills, innovative thinking, and 
                    collaborative opportunities that prepare them for the future of technology.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    To be the leading innovation hub that transforms ideas into reality 
                    and nurtures the next generation of tech leaders.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What We Do</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Our innovation club serves as a catalyst for technological advancement and creative problem-solving. 
                    We provide a platform where students can:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Collaborate on cutting-edge projects</li>
                    <li>Participate in hackathons and competitions</li>
                    <li>Attend workshops and technical sessions</li>
                    <li>Network with industry professionals</li>
                    <li>Showcase their innovations</li>
                    <li>Access mentorship and guidance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
