
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RegistrationStep2Props {
  basicData: {
    email: string;
    username: string;
    password: string;
  };
  onBack: () => void;
}

interface Community {
  id: string;
  name: string;
}

const RegistrationStep2 = ({ basicData, onBack }: RegistrationStep2Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const communities: Community[] = [
    { id: "web-dev", name: "Web Development" },
    { id: "mobile-dev", name: "Mobile Development" },
    { id: "data-science", name: "Data Science & AI" },
    { id: "cybersecurity", name: "Cybersecurity" },
    { id: "iot", name: "Internet of Things (IoT)" },
    { id: "blockchain", name: "Blockchain & Crypto" },
    { id: "game-dev", name: "Game Development" },
    { id: "ui-ux", name: "UI/UX Design" },
  ];

  const handleCommunityToggle = (communityId: string) => {
    setSelectedCommunities(prev => {
      if (prev.includes(communityId)) {
        return prev.filter(id => id !== communityId);
      } else if (prev.length < 3) {
        return [...prev, communityId];
      } else {
        setError("You can select a maximum of 3 communities");
        return prev;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions to continue");
      setLoading(false);
      return;
    }

    if (selectedCommunities.length === 0) {
      setError("Please select at least one community to participate in");
      setLoading(false);
      return;
    }

    try {
      console.log('Starting user registration...');

      // Create the user account with email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: basicData.email,
        password: basicData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/member/user/dashboard`,
          data: {
            display_name: basicData.username.toLowerCase(),
            full_name: fullName,
            phone,
            department,
            course,
            year_of_study: year,
            communities: selectedCommunities,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('User created successfully:', authData);

      // Show success message
      toast({
        title: "Registration successful!",
        description: "Please check your Karatina University email to verify your account. After verification, you'll be redirected to your dashboard.",
      });

      // Navigate to login with a success message
      navigate("/login?message=registration-success");

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-kic-gray">Full Name</Label>
          <Input 
            id="fullName"
            type="text" 
            placeholder="Enter your full name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department" className="text-kic-gray">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="border-kic-lightGray focus:border-kic-green-500">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computing">Computing & Information Technology</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="health">Health Sciences</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-kic-gray">Year of Study</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="border-kic-lightGray focus:border-kic-green-500">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Year 1</SelectItem>
                <SelectItem value="2">Year 2</SelectItem>
                <SelectItem value="3">Year 3</SelectItem>
                <SelectItem value="4">Year 4</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course" className="text-kic-gray">Course/Program</Label>
          <Input 
            id="course"
            type="text" 
            placeholder="e.g., Computer Science, Information Technology" 
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-kic-gray">Phone Number</Label>
          <Input 
            id="phone"
            type="tel" 
            placeholder="e.g., +254700000000" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="border-kic-lightGray focus:border-kic-green-500"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-kic-gray">
            Communities to Participate (Choose up to 3)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {communities.map((community) => (
              <div key={community.id} className="flex items-center space-x-2">
                <Checkbox
                  id={community.id}
                  checked={selectedCommunities.includes(community.id)}
                  onCheckedChange={() => handleCommunityToggle(community.id)}
                  disabled={!selectedCommunities.includes(community.id) && selectedCommunities.length >= 3}
                />
                <Label 
                  htmlFor={community.id} 
                  className="text-sm text-kic-gray cursor-pointer"
                >
                  {community.name}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-kic-gray/60">
            Selected: {selectedCommunities.length}/3 communities
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
          />
          <Label htmlFor="terms" className="text-sm text-kic-gray cursor-pointer">
            I accept the{" "}
            <Link to="/terms" className="text-kic-green-500 hover:underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-kic-green-500 hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        
        <div className="flex gap-3">
          <Button 
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-kic-green-500 hover:bg-kic-green-600" 
            disabled={loading || !acceptedTerms || selectedCommunities.length === 0}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default RegistrationStep2;
