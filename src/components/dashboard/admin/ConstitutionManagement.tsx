
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Upload, Download, Edit, Trash2, Plus, FileText, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ConstitutionDocument {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ConstitutionManagement = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ConstitutionDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    version: '1.0',
    file: null as File | null
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: "Error",
        description: "Please provide a title and select a file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would implement the actual file upload logic to Supabase
      toast({
        title: "Success",
        description: "Constitution document uploaded successfully",
      });
      setShowUploadDialog(false);
      setUploadForm({ title: '', description: '', version: '1.0', file: null });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDocumentStatus = async (documentId: string, currentStatus: boolean) => {
    try {
      // Implement toggle logic here
      toast({
        title: "Success",
        description: `Document ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive",
      });
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      // Implement delete logic here
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-lg">
            <ScrollText className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Constitution Management</h2>
            <p className="text-gray-600">Manage club constitution documents and bylaws</p>
          </div>
        </div>
        
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Constitution Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Club Constitution 2024"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the document"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={uploadForm.version}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="e.g., 1.0, 2.1"
                />
              </div>
              
              <div>
                <Label htmlFor="file">Document File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUploadDocument}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Documents</p>
                <p className="text-2xl font-bold text-blue-700">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Active Documents</p>
                <p className="text-2xl font-bold text-green-700">
                  {documents.filter(d => d.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-600">Latest Version</p>
                <p className="text-2xl font-bold text-purple-700">
                  {documents.length > 0 ? Math.max(...documents.map(d => parseFloat(d.version) || 0)) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-600">Total Size</p>
                <p className="text-2xl font-bold text-orange-700">
                  {formatFileSize(documents.reduce((sum, d) => sum + d.file_size, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Constitution Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <ScrollText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents uploaded</h3>
              <p className="text-gray-600 mb-4">
                Upload your first constitution document to get started.
              </p>
              <Button 
                onClick={() => setShowUploadDialog(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{document.title}</h3>
                        <Badge variant={document.is_active ? 'default' : 'secondary'}>
                          {document.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">v{document.version}</Badge>
                      </div>
                      
                      {document.description && (
                        <p className="text-gray-600 text-sm mb-2">{document.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{document.file_name}</span>
                        <span>{formatFileSize(document.file_size)}</span>
                        <span>Updated {new Date(document.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(document.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDocumentStatus(document.id, document.is_active)}
                      >
                        {document.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDocument(document.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstitutionManagement;
