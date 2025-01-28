import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface Artwork {
  id: string;
  image: string;
  title: string;
  artist?: string;
  type?: string;
  description?: string;
  museum: string;
  link: string;
  creationDate?: string;
  onDisplay?: string;
}

interface ArtworkCardProps {
  artwork: Artwork;
  onFavouriteToggle: (artwork: Artwork) => void;
  isFavourite: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onFavouriteToggle, isFavourite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Function to limit description to 2 lines
  const truncateDescription = (description: string, limit: number = 100) => {
    if (description.length > limit) {
      return description.slice(0, limit) + "...";
    }
    return description;
  };

  return (
    <>
      {/* Artwork Card */}
      <Card
        onClick={handleOpenModal}
        sx={{
          maxWidth: 345,
          margin: 2,
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <CardMedia component="img" height="250" image={artwork.image} alt={artwork.title} />
        <CardContent>
          <Typography variant="h6" component="div">
            {artwork.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {truncateDescription(artwork.description || "No description available.")}
          </Typography>
        </CardContent>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onFavouriteToggle(artwork);
          }}
          aria-label={isFavourite ? "remove from favorites" : "add to favorites"}
        >
          {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Card>

      {/* Enhanced Modal for expanded view */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white',
            py: 2
          }}
        >
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {artwork.title}
          </Typography>
          {artwork.artist && (
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              by {artwork.artist}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Image Section */}
            <Box sx={{ flex: '1 1 auto', maxWidth: { xs: '100%', md: '50%' } }}>
              <CardMedia
                component="img"
                image={artwork.image}
                alt={artwork.title}
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  boxShadow: 3
                }}
              />
            </Box>

            {/* Details Section */}
            <Box sx={{ flex: '1 1 auto' }}>
              {/* Artwork Type */}
              {artwork.type && (
                <Typography variant="h6" color="primary" gutterBottom>
                  {artwork.type}
                </Typography>
              )}

              {/* Creation Date */}
              {artwork.creationDate && (
                <Typography variant="body1" gutterBottom>
                  Created: {artwork.creationDate}
                </Typography>
              )}

              {/* Display Status */}
              {artwork.onDisplay && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'success.main',
                    mb: 2
                  }}
                >
                  {artwork.onDisplay}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Description Section */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Description:
              </Typography>
              <Paper 
                elevation={3}
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'primary.light',
                  borderRadius: 2,
                  mb: 2
                }}
              >
                <Typography variant="body1">
                  {artwork.description || "No description available."}
                </Typography>
              </Paper>

              {/* Museum Info */}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Location: {artwork.museum}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <IconButton
            onClick={() => onFavouriteToggle(artwork)}
            color="primary"
            sx={{ mr: 'auto' }}
          >
            {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Button 
            onClick={handleCloseModal} 
            variant="contained" 
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArtworkCard;
