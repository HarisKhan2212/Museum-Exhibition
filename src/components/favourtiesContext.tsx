import React, { createContext, useContext, useState } from "react";

interface FavouritesContextProps {
  favourites: any[];
  toggleFavourite: (artwork: any) => void;
}

const FavouritesContext = createContext<FavouritesContextProps | undefined>(
  undefined
);

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favourites, setFavourites] = useState<any[]>([]);

  const toggleFavourite = (artwork: any) => {
    setFavourites((prevFavourites) => {
      if (prevFavourites.some((fav) => fav.id === artwork.id)) {
        return prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        return [...prevFavourites, artwork];
      }
    });
  };

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
};
