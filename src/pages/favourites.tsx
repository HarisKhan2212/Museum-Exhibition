import React from 'react';
import ArtworkCard from '../components/artworkCard';

const FavouritesPage: React.FC<{ favourites: any[], onFavouriteToggle: (artwork: any) => void }> = ({ favourites, onFavouriteToggle }) => {
  return (
    <div>
      <h1>Your Favourites</h1>
      {favourites.length === 0 ? (
        <p>No favourites added yet!</p>
      ) : (
        <div>
          {favourites.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onFavouriteToggle={onFavouriteToggle}
              isFavourite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;




