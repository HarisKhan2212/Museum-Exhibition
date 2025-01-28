import React, { useState, useEffect, useCallback } from "react";
import { ScienceMuseumArtworkCollection } from "../api/science-api";
import ArtworkCard from "../components/artworkCard";
import { Box, Button, Typography, Grid, CircularProgress, TextField, Container, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ScienceExhibitionPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [selectedType, setSelectedType] = useState<string>("");

  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      const isFavourite = prevFavourites.some((fav) => fav.uniqueKey === artwork.uniqueKey);
      const updatedFavourites = isFavourite
        ? prevFavourites.filter((fav) => fav.uniqueKey !== artwork.uniqueKey)
        : [...prevFavourites, artwork];

      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
      return updatedFavourites;
    });
  };

  const fetchMuseumData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await ScienceMuseumArtworkCollection({ type: selectedType, page });
      const processedData = Array.isArray(data)
        ? data.map((item: any, index: number) => ({
            ...item,
            uniqueKey: `science-${item.key || item.id || index}`,
          }))
        : [];

      setResults(processedData || []);
    } catch (err) {
      setError("Failed to fetch Science Museum data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedType, page]);

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavourites(JSON.parse(storedFavourites));
    }
  }, []);

  useEffect(() => {
    setResults([]);
    setError("");
    setLoading(true);
    fetchMuseumData();
  }, [selectedType, page, fetchMuseumData]);

  return (
    <Box sx={{ backgroundColor: "#f4f1e1", minHeight: "100vh", padding: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" sx={{ fontFamily: '"Crimson Text", serif', fontWeight: "bold", marginBottom: 4 }}>
          Explore the Science Museum Collection!
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Science Museum collections..."
            sx={{ maxWidth: 600, backgroundColor: "#fff", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => {
              setPage(1);
              window.scrollTo(0, 0); // Scroll to top when searching
            }}
            sx={{ marginLeft: 2, textTransform: "capitalize", fontWeight: "bold", borderRadius: 2 }}
          >
            Search
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Filter by Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
        {error && <Typography color="error" align="center">{error}</Typography>}

        <Grid container spacing={4} justifyContent="center">
          {results.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.uniqueKey}>
              <ArtworkCard
                artwork={item}
                onFavouriteToggle={handleFavouriteToggle}
                isFavourite={favourites.some((fav) => fav.uniqueKey === item.uniqueKey)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pagination Controls */}
      <Box sx={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => { setPage((prevPage) => Math.max(prevPage - 1, 1)); window.scrollTo(0, 0); }}
          sx={{ marginRight: 2 }}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={() => { setPage((prevPage) => prevPage + 1); window.scrollTo(0, 0); }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ScienceExhibitionPage;
