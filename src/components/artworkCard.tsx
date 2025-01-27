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
            e.stopPropagation(); // Prevent click from opening modal
            onFavouriteToggle(artwork);
          }}
          aria-label={isFavourite ? "remove from favorites" : "add to favorites"}
        >
          {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Card>

      {/* Modal for expanded view */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{artwork.title}</DialogTitle>
        <DialogContent>
          <CardMedia
            component="img"
            height="400"
            image={artwork.image}
            alt={artwork.title}
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="body1" color="text.primary" gutterBottom>
            {artwork.description || "No description available."}
          </Typography>
          <Typography variant="body2" color="primary">
            <a
              href={artwork.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              
            </a>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArtworkCard;
