import React, { useState, useEffect, useCallback } from "react";
import { fetchVandAResults } from "../api/va-api";
import { RijksArtworkCollection } from "../api/apiMuseum";
import { ScienceMuseumArtworkCollection } from "../api/apiMuseum";
import ArtworkCard from "../components/artworkCard";
import { Box, Button, Typography, Grid, CircularProgress } from '@mui/material';

const ExhibitionPage: React.FC = () => {
  const [currentMuseum, setCurrentMuseum] = useState<"va" | "rijks" | "science">("va");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Handle favourite toggle
  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      const isFavourite = prevFavourites.some((fav) => fav.id === artwork.id);
      let updatedFavourites;
      if (isFavourite) {
        updatedFavourites = prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        updatedFavourites = [...prevFavourites, artwork];
      }

      localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
      return updatedFavourites;
    });
  };

  // Fetch data based on the selected museum
  const fetchMuseumData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (currentMuseum === "va") {
        data = await fetchVandAResults(query, page, pageSize);
      } else if (currentMuseum === "rijks") {
        data = await RijksArtworkCollection({ type: query, page });
      } else {
        data = await ScienceMuseumArtworkCollection({ type: query, page });
      }
      setResults(data || []);
    } catch (err) {
      setError(
        `Failed to fetch data from ${
          currentMuseum === "va"
            ? "V&A"
            : currentMuseum === "rijks"
            ? "Rijksmuseum"
            : "Science Museum"
        }. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }, [currentMuseum, query, page]);

  // Initial fetch and updates on dependencies
  useEffect(() => {
    const storedFavourites = localStorage.getItem('favourites');
    if (storedFavourites) {
      setFavourites(JSON.parse(storedFavourites));
    }
  }, []);

  // Trigger data fetch when current museum, query, or page changes
  useEffect(() => {
    setResults([]); // Clear previous results when museum changes
    setError(""); // Clear error message
    setLoading(true); // Set loading to true while fetching
    fetchMuseumData(); // Fetch new data based on selected museum
  }, [currentMuseum, query, page, fetchMuseumData]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Explore the{" "}
        {currentMuseum === "va"
          ? "V&A"
          : currentMuseum === "rijks"
          ? "Rijksmuseum"
          : "Science Museum"}{" "}
        Collection!
      </Typography>

      {/* Museum Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentMuseum("va");
            setPage(1); // Reset to page 1 when changing museum
            setQuery(""); // Clear the search query
          }}
          disabled={currentMuseum === "va"}
          sx={{ margin: 1 }}
        >
          Victoria & Albert Museum
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentMuseum("rijks");
            setPage(1);
            setQuery("");
          }}
          disabled={currentMuseum === "rijks"}
          sx={{ margin: 1 }}
        >
          Rijksmuseum
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentMuseum("science");
            setPage(1);
            setQuery("");
          }}
          disabled={currentMuseum === "science"}
          sx={{ margin: 1 }}
        >
          Science Museum
        </Button>
      </Box>

      {/* Search Input */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${
            currentMuseum === "va"
              ? "V&A"
              : currentMuseum === "rijks"
              ? "Rijksmuseum"
              : "Science Museum"
          } collections...`}
          style={{
            padding: '8px',
            width: '60%',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <Button
          variant="contained"
          onClick={() => setPage(1)}
          sx={{ marginLeft: 2 }}
        >
          Search
        </Button>
      </Box>

      {/* Loading and Error State */}
      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && <Typography color="error" align="center">{error}</Typography>}

      {/* Artwork Results Grid */}
      <Grid container spacing={4} justifyContent="center">
        {results.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <ArtworkCard
              artwork={item}
              onFavouriteToggle={handleFavouriteToggle}
              isFavourite={favourites.some((fav) => fav.id === item.id)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          disabled={page === 1}
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          sx={{ marginRight: 2 }}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default ExhibitionPage;

