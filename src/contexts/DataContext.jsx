import React, { createContext, useContext, useState, useEffect } from 'react';
import { gamesData as initialGames, blogPosts as initialBlogPosts } from '@/data/gamesData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// Version control for data
const DATA_VERSION = '1.0.1'; // Increment this when you add new games
const VERSION_KEY = 'mesa-dados-data-version';

export const DataProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Check if we need to reset localStorage due to version change
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const shouldResetData = storedVersion !== DATA_VERSION;

    if (shouldResetData) {
      console.log('Data version changed, resetting localStorage...');
      localStorage.removeItem('boardgames');
      localStorage.removeItem('blogposts');
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }

    // Load games
    try {
      const savedGames = localStorage.getItem('boardgames');
      if (savedGames && JSON.parse(savedGames).length > 0 && !shouldResetData) {
        setGames(JSON.parse(savedGames));
      } else {
        setGames(initialGames);
        localStorage.setItem('boardgames', JSON.stringify(initialGames));
      }
    } catch (error) {
      console.error("Failed to load games from localStorage:", error);
      setGames(initialGames);
      localStorage.setItem('boardgames', JSON.stringify(initialGames));
    }

    // Load blog posts
    try {
      const savedPosts = localStorage.getItem('blogposts');
      if (savedPosts && JSON.parse(savedPosts).length > 0 && !shouldResetData) {
        setBlogPosts(JSON.parse(savedPosts));
      } else {
        setBlogPosts(initialBlogPosts);
        localStorage.setItem('blogposts', JSON.stringify(initialBlogPosts));
      }
    } catch (error) {
      console.error("Failed to load blog posts from localStorage:", error);
      setBlogPosts(initialBlogPosts);
      localStorage.setItem('blogposts', JSON.stringify(initialBlogPosts));
    }
  }, []);

  const saveGames = (updatedGames) => {
    setGames(updatedGames);
    localStorage.setItem('boardgames', JSON.stringify(updatedGames));
  };

  const saveBlogPosts = (updatedPosts) => {
    setBlogPosts(updatedPosts);
    localStorage.setItem('blogposts', JSON.stringify(updatedPosts));
  };

  const resetToOriginalData = () => {
    setGames(initialGames);
    setBlogPosts(initialBlogPosts);
    localStorage.setItem('boardgames', JSON.stringify(initialGames));
    localStorage.setItem('blogposts', JSON.stringify(initialBlogPosts));
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
  };

  const exportData = () => {
    const exportData = {
      version: DATA_VERSION,
      games,
      blogPosts,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mesa-dados-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const value = {
    games,
    blogPosts,
    saveGames,
    saveBlogPosts,
    resetToOriginalData,
    exportData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};