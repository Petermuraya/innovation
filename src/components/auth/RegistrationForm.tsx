
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RegistrationFormFields from "./RegistrationFormFields";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (value: string) => {
    setFormData(prev => ({ ...prev, course: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            course: formData.course,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Account created successfully. Please check your email for verification.",
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-kic-white">
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <RegistrationFormFields 
            formData={formData}
            handleChange={handleChange}
            handleCourseChange={handleCourseChange}
          />
          
          <Button type="submit" className="w-full bg-kic-green-500 hover:bg-kic-green-600" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-kic-lightGray p-6">
        <p className="text-center text-sm text-kic-gray">
          Already have an account?{" "}
          <Link to="/login" className="text-kic-green-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegistrationForm;
