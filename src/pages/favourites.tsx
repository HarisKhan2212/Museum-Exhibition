import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import ArtworkCard from '../components/artworkCard';

const FavouritesPage: React.FC<{ 
  favourites: any[], 
  onFavouriteToggle: (artwork: any) => void, 
  refreshFavourites: () => void 
}> = ({ favourites, onFavouriteToggle, refreshFavourites }) => {
  
  useEffect(() => {
    refreshFavourites(); // Runs only on mount or when `refreshFavourites` changes
  }, [refreshFavourites]);

  return (
    <Box 
      sx={{ 
        backgroundColor: '#f4f1e1', 
        minHeight: '100vh', 
        padding: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: '"Crimson Text", serif', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: 4 
          }}
        >
          Your Favourites
        </Typography>

        {favourites.length === 0 ? (
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: '"Crimson Text", serif', 
              textAlign: 'center', 
              marginTop: 4 
            }}
          >
            No favourites added yet! Explore and add some.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {favourites.map((artwork, index) => (
              <Grid item xs={12} sm={6} md={4} key={artwork.uniqueKey || index}>
                <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={artwork.image || 'https://via.placeholder.com/300x200'}
                    alt={artwork.title || 'Artwork'}
                    sx={{ borderRadius: '16px 16px 0 0' }}
                  />
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      sx={{ fontFamily: '"Crimson Text", serif', fontWeight: 'bold' }}
                    >
                      {artwork.title || 'Untitled Artwork'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {artwork.description || 'No description available.'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="secondary" 
                      onClick={() => onFavouriteToggle(artwork)}
                    >
                      Remove from Favourites
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FavouritesPage;
