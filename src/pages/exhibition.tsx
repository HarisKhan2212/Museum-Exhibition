import React, { useState, useEffect, useCallback } from "react";
import { clevelandArtworkCollection } from "../api/cle-api";
import { ScienceMuseumArtworkCollection } from "../api/science-api";
import ArtworkCard from "../components/artworkCard";
import { Box, Button, Typography, Grid, CircularProgress, TextField, Container } from "@mui/material";

const ExhibitionPage: React.FC = () => {
  const [currentMuseum, setCurrentMuseum] = useState<"cleveland" | "science">("cleveland");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Handle favourite toggle
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

  // Fetch data based on the selected museum
  const fetchMuseumData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let data;
      if (currentMuseum === "cleveland") {
        data = await clevelandArtworkCollection({ type: query, page, pageSize });
      } else {
        data = await ScienceMuseumArtworkCollection({ type: query, page });
      }

      const processedData = Array.isArray(data)
        ? data.map((item: any, index: number) => ({
            ...item,
            uniqueKey: `${currentMuseum}-${item.key || item.id || index}`,
          }))
        : [];

      setResults(processedData || []);
    } catch (err) {
      setError(
        `Failed to fetch data from ${
          currentMuseum === "cleveland" ? "Cleveland Museum of Art" : "Science Museum"
        }. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }, [currentMuseum, query, page]);

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
  }, [currentMuseum, query, page, fetchMuseumData]);

  return (
    <Box 
      sx={{ 
        backgroundColor: "#f4f1e1", 
        minHeight: "100vh", 
        padding: 4 
      }}
    >
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            fontFamily: '"Crimson Text", serif', 
            fontWeight: "bold", 
            marginBottom: 4 
          }}
        >
          Explore the {currentMuseum === "cleveland" ? "Cleveland Museum of Art" : "Science Museum"} Collection!
        </Typography>

        {/* Museum Selection */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setCurrentMuseum("cleveland");
              setPage(1);
              setQuery("");
            }}
            disabled={currentMuseum === "cleveland"}
            sx={{ 
              margin: 1, 
              textTransform: "capitalize", 
              borderRadius: 2, 
              fontWeight: "bold" 
            }}
          >
            Cleveland Museum of Art
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setCurrentMuseum("science");
              setPage(1);
              setQuery("");
            }}
            disabled={currentMuseum === "science"}
            sx={{ 
              margin: 1, 
              textTransform: "capitalize", 
              borderRadius: 2, 
              fontWeight: "bold" 
            }}
          >
            Science Museum
          </Button>
        </Box>

        {/* Search Input */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${currentMuseum === "cleveland" ? "Cleveland Museum of Art" : "Science Museum"} collections...`}
            sx={{
              maxWidth: 600,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
          <Button
            variant="contained"
            onClick={() => setPage(1)}
            sx={{ 
              marginLeft: 2, 
              textTransform: "capitalize", 
              fontWeight: "bold", 
              borderRadius: 2 
            }}
          >
            Search
          </Button>
        </Box>

        {/* Loading and Error State */}
        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
        {error && <Typography color="error" align="center">{error}</Typography>}

        {/* Artwork Results Grid */}
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

        {/* Pagination Controls */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            sx={{ 
              marginRight: 2, 
              textTransform: "capitalize", 
              fontWeight: "bold", 
              borderRadius: 2 
            }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPage((prevPage) => prevPage + 1)}
            sx={{ 
              textTransform: "capitalize", 
              fontWeight: "bold", 
              borderRadius: 2 
            }}
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ExhibitionPage;
