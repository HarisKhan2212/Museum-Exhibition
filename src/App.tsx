import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Home from './pages/home';
import Exhibition from './pages/scienceExhibition';
import Login from './components/login';
import ArtworkCard from './components/scienceCard';
import RijksmuseumPage from './pages/rijkPage';
import { fetchObjectById } from './api/science-api';  

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
    <Router>
      <div>
        <Link to="/">Home</Link>
        <Login />
        <Link to="/scienceMuseum">Science Museum</Link>
        <Link to="/rijk">The Rijk</Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scienceMuseum" element={<Exhibition />} />
          <Route path="/rijk" element={<RijksmuseumPage />} />
          <Route
            path="/rijk/:artworkId"
            element={
              <ArtworkCard
                artwork={artwork}
                onFavouriteToggle={handleFavouriteToggle}
                isFavourite={favourites.some((fav) => fav.id === artwork?.id)}
              />
            }
          />
          <Route
            path="/scienceMuseum/:artworkId"
            element={
              <ArtworkCard
                artwork={artwork}
                onFavouriteToggle={handleFavouriteToggle}
                isFavourite={favourites.some((fav) => fav.id === artwork?.id)}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
