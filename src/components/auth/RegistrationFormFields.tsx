
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegistrationFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegistrationFormFields = ({ formData, handleChange }: RegistrationFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-kic-gray">Full Name</Label>
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
        <Label htmlFor="email" className="text-kic-gray">Email address</Label>
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
          required
          className="border-kic-lightGray focus:border-kic-green-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-kic-gray">Password</Label>
        <Input 
          id="password"
          name="password"
          type="password" 
          placeholder="Create a password" 
          value={formData.password}
          onChange={handleChange}
          required
          className="border-kic-lightGray focus:border-kic-green-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-kic-gray">Confirm Password</Label>
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
    </>
  );
};

export default RegistrationFormFields;
