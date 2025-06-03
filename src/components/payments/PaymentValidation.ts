
export const formatPhoneNumber = (phone: string) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Convert to international format
  if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.length === 9) {
    return '254' + cleaned;
  }
  return cleaned;
};

export const validatePhoneNumber = (phone: string) => {
  const formatted = formatPhoneNumber(phone);
  if (formatted.length !== 12) {
    return 'Please enter a valid Kenyan phone number';
  }
  if (!formatted.startsWith('254')) {
    return 'Phone number must be a Kenyan number';
  }
  return null;
};
