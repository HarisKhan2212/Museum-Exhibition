import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const FavoritesContext = createContext<any>(null);

export const FavoritesProvider = ({ children }: any) => {
  const [favorites, setFavorites] = useState<any[]>([]);

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  // Update localStorage when favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Function to toggle favorite status
  const toggleFavorite = (item: any) => {
    if (favorites.some((fav: any) => fav.id === item.id)) {
      setFavorites(favorites.filter((fav: any) => fav.id !== item.id));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook to access favorites context
export const useFavorites = () => useContext(FavoritesContext);
