
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const Constitution = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-kic-lightGray py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-kic-gray mb-8 text-center">
              Club Constitution
            </h1>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Constitution Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  Our club constitution and governing documents will be available here. 
                  This section is currently under development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Constitution;
