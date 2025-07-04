
export interface RegistrationFormData {
  email: string;
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const validateKaratinaEmail = (email: string): boolean => {
  const karatinaEmailPattern = /^[a-zA-Z0-9._%+-]+@(s\.karu\.ac\.ke|karu\.ac\.ke)$/;
  return karatinaEmailPattern.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters" };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  return { isValid: true };
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Kenyan phone number validation
  const phonePattern = /^(\+254|0)[1-9]\d{8}$/;
  return phonePattern.test(phone.replace(/\s+/g, ''));
};

export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
};

export const validateRegistrationForm = (formData: RegistrationFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateKaratinaEmail(formData.email)) {
    errors.push("Please use a valid Karatina University email (@s.karu.ac.ke or @karu.ac.ke)");
  }

  if (!validateFullName(formData.fullName)) {
    errors.push("Full name must be at least 2 characters and contain only letters");
  }

  if (!validatePhoneNumber(formData.phone)) {
    errors.push("Please enter a valid Kenyan phone number");
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid && passwordValidation.message) {
    errors.push(passwordValidation.message);
  }

  if (formData.password !== formData.confirmPassword) {
    errors.push("Passwords do not match");
  }

  return { isValid: errors.length === 0, errors };
};
