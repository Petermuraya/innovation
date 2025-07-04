
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

const Blog = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-kic-lightGray py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-kic-gray mb-8">
              Blog & Articles
            </h1>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <PenTool className="w-6 h-6" />
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  Our blog section is under development. Stay tuned for exciting articles, 
                  tutorials, and insights from our innovation community!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
