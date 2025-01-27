import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import Home from './pages/home';
import ArtworkCard from './components/artworkCard';
import FavouritesPage from './pages/favourites';
import { fetchObjectById } from './api/science-api';
import ExhibitionPage from './pages/exhibition';
import Login from './components/login';

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

  const refreshFavourites = useCallback(() => {
    const storedFavourites = localStorage.getItem('favourites');
    setFavourites(storedFavourites ? JSON.parse(storedFavourites) : []);
  }, []);

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
      <div style={{ backgroundColor: '#fdf6e3', minHeight: '100vh', padding: '20px' }}>
        <Box sx={{ padding: '16px', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
            Art Gallery
          </Typography>
          <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    marginBottom: '20px',
  }}
>
  <Button
    variant="contained"
    component={Link}
    to="/"
    sx={{
      backgroundColor: '#a1887f', // Muted taupe
      color: '#fff',
      '&:hover': {
        backgroundColor: '#8d6e63', // Darker taupe
      },
      borderRadius: '8px',
      padding: '8px 16px',
    }}
  >
    Home
  </Button>
  <Button
    variant="contained"
    component={Link}
    to="/login"
    sx={{
      backgroundColor: '#bcaaa4', // Warm beige
      color: '#fff',
      '&:hover': {
        backgroundColor: '#a1887f', // Muted taupe
      },
      borderRadius: '8px',
      padding: '8px 16px',
    }}
  >
    Login
  </Button>
  <Button
    variant="contained"
    component={Link}
    to="/exhibition"
    sx={{
      backgroundColor: '#c5e1a5', // Soft green
      color: '#fff',
      '&:hover': {
        backgroundColor: '#aed581', // Slightly darker green
      },
      borderRadius: '8px',
      padding: '8px 16px',
    }}
  >
    Exhibition
  </Button>
  <Button
    variant="contained"
    component={Link}
    to="/favourites"
    sx={{
      backgroundColor: '#b0bec5', // Light grayish blue
      color: '#fff',
      '&:hover': {
        backgroundColor: '#90a4ae', // Darker grayish blue
      },
      borderRadius: '8px',
      padding: '8px 16px',
    }}
  >
    Favourites
  </Button>
</Box>

        </Box>

        <Routes key={window.location.pathname}>
          <Route path="/exhibition" element={<ExhibitionPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
            path="/va/:artworkId"
            element={
              <ArtworkCard
                artwork={artwork}
                onFavouriteToggle={handleFavouriteToggle}
                isFavourite={favourites.some((fav) => fav.id === artwork?.id)}
              />
            }
          />
          <Route
            path="/favourites"
            element={
              <FavouritesPage
                favourites={favourites}
                onFavouriteToggle={handleFavouriteToggle}
                refreshFavourites={refreshFavourites}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
