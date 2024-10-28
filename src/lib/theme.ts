export const theme = {
  colors: {
    background: {
      primary: '#0F172A',    // Dark blue background
      secondary: '#1E293B',  // Lighter blue-gray for cards
      accent: '#2D3B4E',     // Hover states
    },
    text: {
      primary: '#F8FAFC',    // White text
      secondary: '#94A3B8',  // Gray text
      accent: '#3B82F6',     // Blue accent
    },
    gradient: {
      primary: 'from-blue-500 to-purple-600',  // Button gradient
      hover: 'from-blue-600 to-purple-700',    // Button hover
    },
    border: '#334155',       // Border color
    card: {
      background: '#1E293B', // Card background
      hover: '#2D3B4E',      // Card hover
    }
  },
  // Add more theme values as needed
};

export const gradientText = 'bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600';
export const gradientButton = 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700';
