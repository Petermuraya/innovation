
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  course: string;
  current_academic_year: number;
  admin_type?: string;
  admin_code?: string;
  community_id?: string;
  justification?: string;
}

interface Community {
  id: string;
  name: string;
}

const SimpleRegistrationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isAdminRequest, setIsAdminRequest] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    course: '',
    current_academic_year: 1,
    admin_type: '',
    admin_code: '',
    community_id: '',
    justification: ''
  });

  React.useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: formData.name,
            phone: formData.phone,
            course: formData.course,
            current_academic_year: formData.current_academic_year
          }
        }
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('User ID not available');

      // Step 2: Create member record
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          user_id: userId,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          course: formData.course,
          current_academic_year: formData.current_academic_year,
          registration_status: isAdminRequest ? 'pending' : 'pending'
        });

      if (memberError) throw memberError;

      // Step 3: Handle admin request if applicable
      if (isAdminRequest && formData.admin_type) {
        const { error: adminRequestError } = await supabase
          .from('admin_requests')
          .insert({
            user_id: userId,
            name: formData.name,
            email: formData.email,
            admin_type: formData.admin_type,
            admin_code: formData.admin_code || null,
            community_id: formData.community_id || null,
            justification: formData.justification || '',
            status: 'pending'
          });

        if (adminRequestError) throw adminRequestError;
      } else {
        // Step 4: For regular members, assign default member role
        const { error: roleError } = await supabase
          .from('user_roles' as any)
          .insert({
            user_id: userId,
            role: 'member'
          });

        if (roleError) {
          console.error('Error assigning default role:', roleError);
          // Don't throw here as the registration was successful
        }
      }

      setSuccess(true);
      toast({
        title: "Registration Successful!",
        description: isAdminRequest 
          ? "Your admin request has been submitted for review. Check your email to verify your account."
          : "Please check your email to verify your account.",
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            {isAdminRequest 
              ? "Your admin request has been submitted for review. Please check your email to verify your account."
              : "Please check your email to verify your account and complete the registration process."
            }
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join Innovation Club</CardTitle>
        <CardDescription>
          Create your account to become a member
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="e.g., +254 700 000 000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course/Program</Label>
            <Input
              id="course"
              type="text"
              required
              value={formData.course}
              onChange={(e) => handleInputChange('course', e.target.value)}
              placeholder="e.g., Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic_year">Current Academic Year</Label>
            <Select 
              value={formData.current_academic_year.toString()} 
              onValueChange={(value) => handleInputChange('current_academic_year', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Year 1</SelectItem>
                <SelectItem value="2">Year 2</SelectItem>
                <SelectItem value="3">Year 3</SelectItem>
                <SelectItem value="4">Year 4</SelectItem>
                <SelectItem value="5">Year 5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password Fields */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a secure password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          {/* Admin Request Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="adminRequest"
              checked={isAdminRequest}
              onChange={(e) => setIsAdminRequest(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="adminRequest" className="text-sm">
              I want to apply for an admin role
            </Label>
          </div>

          {/* Admin Request Fields */}
          {isAdminRequest && (
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <Alert>
                <AlertDescription>
                  Admin applications require review and approval by current administrators.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="admin_type">Admin Role Type</Label>
                <Select 
                  value={formData.admin_type} 
                  onValueChange={(value) => handleInputChange('admin_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_admin">General Admin</SelectItem>
                    <SelectItem value="community_admin">Community Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.admin_type === 'community_admin' && (
                <div className="space-y-2">
                  <Label htmlFor="community_id">Target Community</Label>
                  <Select 
                    value={formData.community_id} 
                    onValueChange={(value) => handleInputChange('community_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community.id} value={community.id}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin_code">Admin Code (Optional)</Label>
                <Input
                  id="admin_code"
                  type="text"
                  value={formData.admin_code}
                  onChange={(e) => handleInputChange('admin_code', e.target.value)}
                  placeholder="Enter admin code if you have one"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  required={isAdminRequest}
                  value={formData.justification}
                  onChange={(e) => handleInputChange('justification', e.target.value)}
                  placeholder="Explain why you should be granted admin access..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              isAdminRequest ? 'Submit Admin Application' : 'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleRegistrationForm;
