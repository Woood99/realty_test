import { useState } from 'react';

export const useTheme = () => {
   const [theme, setTheme] = useState(localStorage.getItem('chat-theme') || 'light');

   const toggleTheme = () => {
      const current = theme === 'light' ? 'dark' : 'light';
      setTheme(current);
      localStorage.setItem('chat-theme', current);
   };

   return { theme, toggleTheme };
};
