import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, BarChart, Brain, Database, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunityGroup } from '../../user/communities/useCommunityData';

interface DataScienceCommunityDashboardProps {
  community: CommunityGroup;
}

const DataScienceCommunityDashboard = ({ community }: DataScienceCommunityDashboardProps) => {
  const navigate = useNavigate();

  const dataProjects = [
    {
      id: 1,
      title: "Student Performance Predictor",
      description: "ML model to predict student academic performance",
      status: "Training",
      accuracy: "87%",
      tech: ["Python", "Scikit-learn", "Pandas", "Matplotlib"]
    },
    {
      id: 2,
      title: "Campus Sentiment Analysis",
      description: "NLP analysis of student feedback and social media",
      status: "Completed",
      accuracy: "92%",
      tech: ["Python", "NLTK", "TensorFlow", "Docker"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Machine Learning Bootcamp",
      date: "2024-06-20",
      time: "1:00 PM",
      description: "Hands-on introduction to ML algorithms and implementation"
    },
    {
      id: 2,
      title: "Data Visualization Workshop",
      date: "2024-06-27",
      time: "3:00 PM",
      description: "Creating compelling data stories with Python and R"
    }
  ];

  const datasets = [
    {
      id: 1,
      name: "KIC Student Demographics",
      size: "2.3 MB",
      records: "1,245",
      type: "CSV"
    },
    {
      id: 2,
      name: "Campus Event Attendance",
      size: "890 KB",
      records: "5,678",
      type: "JSON"
    }
  ];

  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-kic-gray">{community.name}</h1>
            <p className="text-kic-gray/70">Data Science & Machine Learning</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Scientists</p>
                  <p className="text-2xl font-bold text-kic-gray">{community.member_count}</p>
                </div>
                <Users className="h-8 w-8 text-kic-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ML Models</p>
                  <p className="text-2xl font-bold text-kic-gray">8</p>
                </div>
                <Brain className="h-8 w-8 text-kic-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Datasets</p>
                  <p className="text-2xl font-bold text-kic-gray">{datasets.length}</p>
                </div>
                <Database className="h-8 w-8 text-kic-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-kic-gray">89.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-kic-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">ML Projects</TabsTrigger>
            <TabsTrigger value="events">Data Workshops</TabsTrigger>
            <TabsTrigger value="resources">Tools & Libraries</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Machine Learning Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-kic-gray">{project.title}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">{project.accuracy}</Badge>
                          <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Notebook</Button>
                        <Button size="sm">Run Model</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Data Science Workshops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-kic-gray">{event.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <Button size="sm">Join Workshop</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Data Science Tools & Libraries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Python Data Stack</h4>
                    <p className="text-sm text-gray-600">Pandas, NumPy, Matplotlib, Seaborn, Plotly</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Machine Learning</h4>
                    <p className="text-sm text-gray-600">Scikit-learn, TensorFlow, PyTorch, XGBoost</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Big Data Tools</h4>
                    <p className="text-sm text-gray-600">Apache Spark, Hadoop, Kafka, Elasticsearch</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Cloud Platforms</h4>
                    <p className="text-sm text-gray-600">AWS SageMaker, Google Colab, Azure ML</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Available Datasets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datasets.map((dataset) => (
                    <div key={dataset.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-kic-gray">{dataset.name}</h4>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>Size: {dataset.size}</span>
                            <span>Records: {dataset.records}</span>
                            <span>Format: {dataset.type}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Preview</Button>
                          <Button size="sm">Download</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      <BarChart className="w-4 h-4 mr-2" />
                      Request New Dataset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataScienceCommunityDashboard;
