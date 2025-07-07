import React, { createContext, useContext, useState, useEffect } from 'react';
import { gamesData as initialGames, blogPosts as initialBlogPosts } from '@/data/gamesData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    try {
      const savedGames = localStorage.getItem('boardgames');
      if (savedGames && JSON.parse(savedGames).length > 0) {
        setGames(JSON.parse(savedGames));
      } else {
        setGames(initialGames);
        localStorage.setItem('boardgames', JSON.stringify(initialGames));
      }
    } catch (error) {
      console.error("Failed to load games from localStorage:", error);
      setGames(initialGames);
    }

    try {
      const savedPosts = localStorage.getItem('blogposts');
      if (savedPosts && JSON.parse(savedPosts).length > 0) {
        setBlogPosts(JSON.parse(savedPosts));
      } else {
        setBlogPosts(initialBlogPosts);
        localStorage.setItem('blogposts', JSON.stringify(initialBlogPosts));
      }
    } catch (error) {
      console.error("Failed to load blog posts from localStorage:", error);
      setBlogPosts(initialBlogPosts);
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

  const value = {
    games,
    blogPosts,
    saveGames,
    saveBlogPosts
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};