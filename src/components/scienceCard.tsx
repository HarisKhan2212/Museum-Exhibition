import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface ArtworkCardProps {
  artwork: any;
  onFavouriteToggle: (artwork: any) => void;
  isFavourite: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onFavouriteToggle, isFavourite }) => {
  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        height="250"
        image={artwork.image}
        alt={artwork.title}
      />
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
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
          {artwork.id || "No description available."}
        </Typography>
      </CardContent>
      <IconButton onClick={() => onFavouriteToggle(artwork)} aria-label="add to favorites">
        {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
};

export default ArtworkCard;


