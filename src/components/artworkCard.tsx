import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// Artwork interface
interface Artwork {
  id: string;
  image: string;
  title: string;
  artist?: string;
  type?: string;
  description?: string;
  museum: string; 
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
        Loading...
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





