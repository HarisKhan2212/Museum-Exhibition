// ArtworkCard.tsx
import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// Updated Artwork interface
interface Artwork {
  id: string;
  image: string;
  title: string;
  artist?: string;
  type?: string;
  description?: string;
  museum: string;  // Add museum property here
}

interface ArtworkCardProps {
  artwork: Artwork;
  onFavouriteToggle: (artwork: Artwork) => void;
  isFavourite: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onFavouriteToggle, isFavourite }) => {
  if (!artwork) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Card sx={{ maxWidth: 345, margin: 2, transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" } }}>
      <CardMedia component="img" height="250" image={artwork.image} alt={artwork.title} />
      <CardContent>
        <Typography variant="h6" component="div">
          {artwork.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Artist: {artwork.artist || "Unknown Artist"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
          Type: {artwork.type || "Unknown Type"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
          {artwork.description || "No description available."}
        </Typography>
      </CardContent>
      <IconButton onClick={() => onFavouriteToggle(artwork)} aria-label={isFavourite ? "remove from favorites" : "add to favorites"}>
        {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
};

export default ArtworkCard;




