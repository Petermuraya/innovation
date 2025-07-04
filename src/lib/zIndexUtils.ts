
// Z-index utility for consistent layering across the application
export const zIndexLevels = {
  // Base levels
  base: 1,
  elevated: 10,
  
  // Navigation
  navbar: 9990,
  navbarDropdown: 9995,
  mobileMenu: 9998,
  
  // Modals and overlays
  modal: 1000,
  modalOverlay: 999,
  
  // Dropdowns and popovers
  dropdown: 50,
  popover: 60,
  tooltip: 70,
  
  // Notifications
  toast: 100,
  notification: 90,
  
  // Chatbot
  chatbot: 80,
  
  // Admin specific
  adminPanel: 40,
  
  // Maximum level for critical elements
  critical: 9999
} as const;

export const getZIndexClass = (level: keyof typeof zIndexLevels): string => {
  return `z-[${zIndexLevels[level]}]`;
};
