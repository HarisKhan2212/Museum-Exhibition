import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material'; // Import MUI components for styling
import Home from './pages/home';
import Login from './components/login';
import ArtworkCard from './components/artworkCard';
import RijksmuseumPage from './pages/rijkPage';
import VAndAPage from './pages/vaPage';
import FavouritesPage from './pages/favourites';
import { fetchObjectById } from './api/science-api';
import ExhibitionPage from './pages/exhibition';

const App: React.FC = () => {
  const [artwork, setArtwork] = useState<any | null>(null);
  const [favourites, setFavourites] = useState<any[]>(() => {
    const storedFavourites = localStorage.getItem('favourites');
    return storedFavourites ? JSON.parse(storedFavourites) : [];
  });
  const [loading, setLoading] = useState(false);

  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      let updatedFavourites = [...prevFavourites];
      const found = updatedFavourites.some((fav) => fav.id === artwork.id);
      if (found) {
        updatedFavourites = updatedFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        updatedFavourites.push(artwork);
      }

      // Update localStorage whenever favourites change
      localStorage.setItem('favourites', JSON.stringify(updatedFavourites));

      return updatedFavourites;
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
        <Box sx={{ padding: '16px', textAlign: 'center' }}>
          {/* Add Typography for page title */}
          <Typography variant="h4" sx={{ marginBottom: '16px' }}>Art Gallery</Typography>
          
          {/* Create a row of buttons using MUI Box for layout */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {/* Style Links as Buttons */}
            <Button variant="contained" color="primary" component={Link} to="/">Home</Button>
            <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
            <Button variant="contained" color="primary" component={Link} to="/exhibition">Exhibition</Button>
            <Button variant="contained" color="primary" component={Link} to="/favourites">Favourites</Button>
          </Box>
        </Box>

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
          <Route path="/va" element={<VAndAPage />} />
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
  );
};

export default App;

