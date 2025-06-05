import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const calculateStrength = (password: string) => {
    let score = 0;
    const requirements = {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
      uncommon: false
    };

    // Length check
    if (password.length >= 12) {
      score += 25;
      requirements.length = true;
    } else if (password.length >= 8) {
      score += 15;
    }

    // Character diversity
    if (/[a-z]/.test(password)) {
      score += 15;
      requirements.lowercase = true;
    }
    if (/[A-Z]/.test(password)) {
      score += 15;
      requirements.uppercase = true;
    }
    if (/\d/.test(password)) {
      score += 15;
      requirements.number = true;
    }
    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 15;
      requirements.specialChar = true;
    }

    // Entropy bonus
    if (password.length > 16 && requirements.specialChar) {
      score += 15;
    }

    // Penalize common patterns
    if (/(123|abc|password|qwerty)/i.test(password)) {
      score = Math.max(0, score - 20);
    }

    // Determine strength level
    type StrengthLevel = 'CRITICAL' | 'WEAK' | 'MODERATE' | 'STRONG' | 'BULLETPROOF';
    let strength: StrengthLevel;
    let colorClass: string;
    let icon: string;

    if (score >= 90) {
      strength = 'BULLETPROOF';
      colorClass = 'bg-emerald-400 shadow-lg shadow-emerald-500/20';
      icon = '🔒';
    } else if (score >= 70) {
      strength = 'STRONG';
      colorClass = 'bg-teal-400 shadow-lg shadow-teal-500/20';
      icon = '🛡️';
    } else if (score >= 50) {
      strength = 'MODERATE';
      colorClass = 'bg-amber-400 shadow-lg shadow-amber-500/20';
      icon = '⚠️';
    } else if (score >= 30) {
      strength = 'WEAK';
      colorClass = 'bg-orange-500 shadow-lg shadow-orange-500/20';
      icon = '🚨';
    } else {
      strength = 'CRITICAL';
      colorClass = 'bg-red-600 shadow-lg shadow-red-500/20';
      icon = '💀';
    }

    return {
      score: Math.min(100, score),
      strength,
      colorClass,
      icon,
      requirements
    };
  };

  if (!password) return null;

  const { score, strength, colorClass, icon, requirements } = calculateStrength(password);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gray-400 tracking-wider">SECURITY METER</span>
          <span className="text-xs">{icon}</span>
        </div>
        <span className={`text-xs font-mono font-bold ${
          strength === 'BULLETPROOF' ? 'text-emerald-400' :
          strength === 'STRONG' ? 'text-teal-400' :
          strength === 'MODERATE' ? 'text-amber-400' :
          strength === 'WEAK' ? 'text-orange-500' : 'text-red-600'
        }`}>
          {strength}
        </span>
      </div>

      <div className="relative h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${score}%`, transition: 'width 0.3s ease' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className={`text-xs p-1.5 rounded text-center font-mono ${
          requirements.length ? 'bg-emerald-900/50 text-emerald-300' : 'bg-gray-800 text-gray-500'
        }`}>
          {password.length >= 12 ? '12+ chars' : '8+ chars'}
        </div>
        <div className={`text-xs p-1.5 rounded text-center font-mono ${
          requirements.uppercase ? 'bg-emerald-900/50 text-emerald-300' : 'bg-gray-800 text-gray-500'
        }`}>
          A-Z
        </div>
        <div className={`text-xs p-1.5 rounded text-center font-mono ${
          requirements.lowercase ? 'bg-emerald-900/50 text-emerald-300' : 'bg-gray-800 text-gray-500'
        }`}>
          a-z
        </div>
        <div className={`text-xs p-1.5 rounded text-center font-mono ${
          requirements.number ? 'bg-emerald-900/50 text-emerald-300' : 'bg-gray-800 text-gray-500'
        }`}>
          0-9
        </div>
        <div className={`text-xs p-1.5 rounded text-center font-mono ${
          requirements.specialChar ? 'bg-emerald-900/50 text-emerald-300' : 'bg-gray-800 text-gray-500'
        }`}>
          !@#
        </div>
        <div className={`text-xs p-1.5 rounded text-center font-mono ${
          password.length > 16 ? 'bg-emerald-900/50 text-emerald-300' : 'bg-gray-800 text-gray-500'
        }`}>
          entropy+
        </div>
      </div>

      {strength === 'CRITICAL' && (
        <div className="mt-2 px-3 py-2 bg-red-900/30 border border-red-700/50 rounded text-xs text-red-300 font-mono">
          <span className="font-bold">SECURITY ALERT:</span> This password would be cracked instantly
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;