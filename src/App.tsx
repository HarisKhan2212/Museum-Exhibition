import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Home from './pages/home';
import Login from './components/login';
import ArtworkCard from './components/artworkCard';
import RijksmuseumPage from './pages/rijkPage';
import VAndAPage from './pages/vaPage';
import FavouritesPage from './pages/favourites';
import { FavouritesProvider } from './components/favourtiesContext';
import { fetchObjectById } from './api/science-api';
import ExhibitionPage from './pages/exhibition';

const App: React.FC = () => {
  const [artwork, setArtwork] = useState<any | null>(null);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      if (prevFavourites.some((fav) => fav.id === artwork.id)) {
        return prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        return [...prevFavourites, artwork];
      }
    });
  };

  const { artworkId } = useParams<{ artworkId: string }>();

  useEffect(() => {
    const fetchArtwork = async () => {
      if (artworkId) {
        setLoading(true);
        try {
          const data = await fetchObjectById(artworkId);
          setArtwork(data);
        } catch (error) {
          console.error('Failed to fetch artwork', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArtwork();
  }, [artworkId]);

  return (
    <FavouritesProvider>
      <Router>
        <div>
          <Link to="/">Home</Link>
          <Link to="/">Login</Link>
          {/* <Link to="/rijk">The Rijksmuseum</Link> */}
          <Link to="Exhibition">exhibiton</Link>
          {/* <Link to="/va">The V&A Museum</Link>  {} */}
          <Link to="/favourites">Favourites</Link>
          <Routes>
          <Route path="/exhibition" element={<ExhibitionPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/rijk" element={<RijksmuseumPage />} />
            <Route path="/rijk/:artworkId" element={
              <ArtworkCard
                artwork={artwork}
                onFavouriteToggle={handleFavouriteToggle}
                isFavourite={favourites.some((fav) => fav.id === artwork?.id)}
              />
            } />
            <Route path="/va" element={<VAndAPage />} />  {}
            <Route path="/va/:artworkId" element={
              <ArtworkCard
                artwork={artwork}
                onFavouriteToggle={handleFavouriteToggle}
                isFavourite={favourites.some((fav) => fav.id === artwork?.id)}
              />
            } />
            <Route path="/favourites" element={
              <FavouritesPage
                favourites={favourites}
                onFavouriteToggle={handleFavouriteToggle}
              />
            } />
          </Routes>
        </div>
      </Router>
    </FavouritesProvider>
  );
};

export default App;
