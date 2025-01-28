import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import ArtworkCard from '../components/artworkCard';

const FavouritesPage: React.FC<{ 
  favourites: any[], 
  onFavouriteToggle: (artwork: any) => void, 
  refreshFavourites: () => void 
}> = ({ favourites, onFavouriteToggle, refreshFavourites }) => {

  useEffect(() => {
    refreshFavourites(); 
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
                <ArtworkCard 
                  artwork={artwork}
                  onFavouriteToggle={onFavouriteToggle} 
                  isFavourite={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FavouritesPage;


