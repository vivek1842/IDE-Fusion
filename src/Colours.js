// color generation utility function
export const generateUserColor = (username) => {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEEAD', // Yellow
      '#D4A5A5', // Pink
      '#A4D4AE', // Mint
      '#E3B8B8'  // Peach
    ];
    
    // Simple hash to get consistent color for same username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };