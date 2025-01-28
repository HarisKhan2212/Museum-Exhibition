import React, { useState, useEffect, useCallback } from "react";
import { clevelandArtworkCollection } from "../api/cle-api";
import ArtworkCard from "../components/artworkCard";
import { Box, Button, Typography, Grid, CircularProgress, Container, FormControl, InputLabel, Select, MenuItem, Radio, RadioGroup, FormControlLabel, SelectChangeEvent } from "@mui/material";
import { sortByArtist, sortByDate } from "../api/cle-api";

const ClevelandExhibitionPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [sortBy, setSortBy] = useState("artist");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
      // Only pass type to clevelandArtworkCollection if it doesn't accept page/pageSize
      const data = await clevelandArtworkCollection({ type: "" });
      
      // Add pagination logic here manually if needed
      const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);
      
      const processedData = Array.isArray(paginatedData)
        ? paginatedData.map((item: any, index: number) => ({
            ...item,
            uniqueKey: `cleveland-${item.key || item.id || index}`,
          }))
        : [];
  
      // Continue with your sorting logic
      const sortedData = sortBy === "artist"
        ? sortByArtist(processedData, sortOrder)
        : sortByDate(processedData, sortOrder);
  
      setResults(sortedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch Cleveland Museum data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder]);

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
  }, [page, fetchMuseumData]);

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOrder(event.target.value as "asc" | "desc");
  };

  return (
    <Box sx={{ backgroundColor: "#f4f1e1", minHeight: "100vh", padding: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" sx={{ fontFamily: '"Crimson Text", serif', fontWeight: "bold", marginBottom: 4 }}>
          Explore the Cleveland Museum of Art Collection!
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <FormControl sx={{ marginRight: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortByChange}
              label="Sort By"
            >
              <MenuItem value="artist">Artist</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ marginLeft: 2 }}>
            <RadioGroup
              row
              aria-labelledby="sort-order-group-label"
              name="sort-order-group"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <FormControlLabel value="asc" control={<Radio />} label="Asc" />
              <FormControlLabel value="desc" control={<Radio />} label="Desc" />
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchMuseumData()}
            sx={{ marginLeft: 2 }}
          >
            Apply Sorting
          </Button>
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
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={() => setPage(page + 1)}
          sx={{ marginLeft: 2 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ClevelandExhibitionPage;
