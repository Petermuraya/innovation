
import RegistrationHeader from "@/components/auth/RegistrationHeader";
import RegistrationForm from "@/components/auth/RegistrationForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kic-lightGray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <RegistrationHeader />
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Register;
