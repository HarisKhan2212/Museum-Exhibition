import React, { useState, useEffect } from "react";
import { RijksArtworkCollection } from "../api/apiMuseum";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const RijksmuseumPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await RijksArtworkCollection({ type: query, page: 1 });
      setResults(data || []);
    } catch (err) {
      setError("Failed to fetch data from Rijksmuseum. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <h1>Search the Rijksmuseum Collection!</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Painting, Sculpture, etc."
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Grid container spacing={4}>
        {results.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ maxWidth: 345 }}>
              <Link to={`/rijk/${item.id}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={item.image || 'https://via.placeholder.com/250'}
                  alt={item.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Artist: {item.artist}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default RijksmuseumPage;


