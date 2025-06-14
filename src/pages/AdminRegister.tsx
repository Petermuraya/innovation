
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock } from "lucide-react";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
    confirmPassword: "",
    justification: "",
    adminCode: "",
    adminType: "general"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.justification) {
      setError("Please fill in all required fields");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (formData.justification.length < 50) {
      setError("Please provide a detailed justification (minimum 50 characters)");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Starting admin registration process...');
      
      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            course: formData.course,
            admin_request: true,
            justification: formData.justification,
            admin_code: formData.adminCode,
            admin_type: formData.adminType
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        throw signUpError;
      }

      console.log('User created successfully:', data.user?.id);

      // Create admin request record
      if (data.user) {
        const requestData = {
          user_id: data.user.id,
          email: formData.email,
          name: formData.name,
          justification: formData.justification,
          admin_code: formData.adminCode || null,
          admin_type: formData.adminType,
          status: 'pending'
        };

        console.log('Creating admin request with data:', requestData);

        const { error: requestError, data: requestResult } = await supabase
          .from('admin_requests')
          .insert(requestData);

        if (requestError) {
          console.error('Admin request creation error:', requestError);
          throw new Error(`Failed to create admin request: ${requestError.message}`);
        }

        console.log('Admin request created successfully:', requestResult);
      }

      toast({
        title: "Admin Registration Submitted",
        description: "Your admin registration request has been submitted for review. You will be notified once approved.",
      });

      navigate("/admin-request-pending");
    } catch (err: any) {
      console.error("Admin registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-kic-gray">Admin Registration</h1>
          <p className="mt-2 text-kic-gray/70">
            Request administrative access to KIC platform
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Admin requests require approval from existing administrators
              </p>
            </div>
          </div>
        </div>
        
        <Card className="bg-kic-white border-kic-lightGray">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Secure Registration</CardTitle>
            <CardDescription className="text-center">
              All admin requests are logged and reviewed
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-kic-gray">Full Name *</Label>
                <Input 
                  id="name"
                  name="name"
                  type="text" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-kic-gray">Email Address *</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-kic-gray">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel" 
                  placeholder="Enter your phone number" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course" className="text-kic-gray">Course/Department</Label>
                <Input 
                  id="course"
                  name="course"
                  type="text" 
                  placeholder="Enter your course or department" 
                  value={formData.course}
                  onChange={handleChange}
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminType" className="text-kic-gray">Admin Type *</Label>
                <Select value={formData.adminType} onValueChange={(value) => handleSelectChange("adminType", value)}>
                  <SelectTrigger className="border-kic-lightGray focus:border-kic-green-500">
                    <SelectValue placeholder="Select admin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Admin</SelectItem>
                    <SelectItem value="community">Community Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminCode" className="text-kic-gray">Admin Code (Optional)</Label>
                <Input 
                  id="adminCode"
                  name="adminCode"
                  type="password" 
                  placeholder="Enter admin code if provided" 
                  value={formData.adminCode}
                  onChange={handleChange}
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
                <p className="text-xs text-gray-500">
                  Admin code can expedite approval process
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification" className="text-kic-gray">Justification for Admin Access *</Label>
                <Textarea 
                  id="justification"
                  name="justification"
                  placeholder="Explain why you need admin access, your experience, and how you plan to contribute to KIC..."
                  value={formData.justification}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500 min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  Minimum 50 characters required
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-kic-gray">Password *</Label>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="Create a strong password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-kic-gray">Confirm Password *</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  placeholder="Confirm your password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border-kic-lightGray focus:border-kic-green-500"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white" 
                disabled={loading}
              >
                {loading ? "Submitting Request..." : "Submit Admin Request"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-kic-lightGray p-6">
            <p className="text-center text-sm text-kic-gray">
              Regular member account?{" "}
              <Link to="/register" className="text-kic-green-500 font-medium hover:underline">
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegister;
