import React from 'react';
import ArtworkCard from '../components/artworkCard'; 
interface FavouritesPageProps {
  favourites: any[];
  onFavouriteToggle: (artwork: any) => void;
}

const FavouritesPage: React.FC<FavouritesPageProps> = ({ favourites, onFavouriteToggle }) => {
  return (
    <div>
      <h1>Favourites</h1>
      {favourites.length === 0 ? (
        <p>You have no favourite artworks yet.</p>
      ) : (
        <div className="artwork-grid">
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
