
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const calculateStrength = (password: string): { score: number; feedback: string; color: string } => {
    let score = 0;
    const feedback = [];
    
    if (password.length >= 8) score += 20;
    else feedback.push('At least 8 characters');
    
    if (password.length >= 12) score += 10;
    
    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('lowercase letter');
    
    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('uppercase letter');
    
    if (/\d/.test(password)) score += 20;
    else feedback.push('number');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
    else feedback.push('special character');
    
    let color = 'bg-red-500';
    let strengthText = 'Very Weak';
    
    if (score >= 80) {
      color = 'bg-green-500';
      strengthText = 'Strong';
    } else if (score >= 60) {
      color = 'bg-yellow-500';
      strengthText = 'Medium';
    } else if (score >= 40) {
      color = 'bg-orange-500';
      strengthText = 'Weak';
    }
    
    return {
      score,
      feedback: feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : 'Strong password!',
      color: strengthText
    };
  };

  if (!password) return null;

  const { score, feedback, color } = calculateStrength(password);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Password strength:</span>
        <span className={`font-medium ${
          color === 'Strong' ? 'text-green-600' :
          color === 'Medium' ? 'text-yellow-600' :
          color === 'Weak' ? 'text-orange-600' : 'text-red-600'
        }`}>
          {color}
        </span>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-gray-500">{feedback}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
