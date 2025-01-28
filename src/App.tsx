import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { Button, Box, Typography, Menu, MenuItem, Fade } from '@mui/material';
import Home from './pages/home';
import ArtworkCard from './components/artworkCard';
import FavouritesPage from './pages/favourites';
import { fetchObjectById } from './api/science-api';
import Login from './components/login';
import ClevelandExhibitionPage from './pages/clevExhibition';
import ScienceExhibitionPage from './pages/sciExhibition';

const App: React.FC = () => {
  const [artwork, setArtwork] = useState<any | null>(null);
  const [favourites, setFavourites] = useState<any[]>(() => {
    const storedFavourites = localStorage.getItem('favourites');
    return storedFavourites ? JSON.parse(storedFavourites) : [];
  });
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      let updatedFavourites = [...prevFavourites];
      const found = updatedFavourites.some((fav) => fav.id === artwork.id);
      if (found) {
        updatedFavourites = updatedFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        updatedFavourites.push(artwork);
      }

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#fdf6e3', minHeight: '100vh', padding: '40px' }}>
        <Box sx={{ padding: '16px', textAlign: 'center' }}>
          {/* Clickable Title with Styling */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h2"
              sx={{
                marginBottom: '32px',
                fontWeight: 'bold',
                fontSize: '48px', // Larger font size
                color: '#8d6e63',
                '&:hover': {
                  color: '#6f4f42', // Color change on hover for interactivity
                },
                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow effect
              }}
            >
              The Museum Exhibition
            </Typography>
          </Link>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: '40px' }}>
            <Button
              variant="contained"
              component={Link}
              to="/"
              sx={{
                backgroundColor: '#8d6e63',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#6f4f42',
                },
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '18px',
              }}
            >
              Home
            </Button>
            <Button
              variant="contained"
              onClick={handleMenuClick}
              sx={{
                backgroundColor: '#8d6e63',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#6f4f42',
                },
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '18px',
              }}
            >
              Menu
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              TransitionComponent={Fade}
              sx={{
                '& .MuiMenu-paper': {
                  backgroundColor: '#a1887f', // consistent color
                  borderRadius: '8px',
                  boxShadow: 3,
                },
              }}
            >
              <MenuItem component={Link} to="/login" onClick={handleCloseMenu} sx={{ color: '#fff', fontSize: '16px' }}>
                Login
              </MenuItem>
              <MenuItem component={Link} to="/cleveland" onClick={handleCloseMenu} sx={{ color: '#fff', fontSize: '16px' }}>
                Cleveland Museum Exhibition
              </MenuItem>
              <MenuItem component={Link} to="/science" onClick={handleCloseMenu} sx={{ color: '#fff', fontSize: '16px' }}>
                Science Museum Exhibition
              </MenuItem>
              <MenuItem component={Link} to="/favourites" onClick={handleCloseMenu} sx={{ color: '#fff', fontSize: '16px' }}>
                Favourites
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Routes key={window.location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cleveland" element={<ClevelandExhibitionPage />} />
          <Route path="/science" element={<ScienceExhibitionPage />} />
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


