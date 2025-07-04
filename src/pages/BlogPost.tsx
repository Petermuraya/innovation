
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPost = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-kic-lightGray py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-kic-green-500 hover:text-kic-green-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <Card>
              <CardHeader>
                <CardTitle>Blog Post</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This blog post page is under development. Individual blog posts will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
