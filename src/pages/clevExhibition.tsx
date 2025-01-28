import React, { useState, useEffect, useCallback } from "react";
import { clevelandArtworkCollection, getArtworkTypes, sortByArtist, sortByDate, sortByType } from "../api/cle-api";
import ArtworkCard from "../components/artworkCard";
import { 
  Box, 
  Button, 
  Typography, 
  Grid, 
  CircularProgress, 
  Container, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  SelectChangeEvent 
} from "@mui/material";

const ClevelandExhibitionPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [sortBy, setSortBy] = useState("artist");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getArtworkTypes();
        setAvailableTypes(types);
      } catch (err) {
        console.error("Error fetching artwork types:", err);
      }
    };
    fetchTypes();
  }, []);

  const handleFavouriteToggle = (artwork: any) => {
    console.log('Toggling favourite for artwork with uniqueKey:', artwork.uniqueKey); // Log added
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
      const data = await clevelandArtworkCollection({ type: selectedType });
      
      const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);
      
      const processedData = Array.isArray(paginatedData)
        ? paginatedData.map((item: any, index: number) => ({
            ...item,
            uniqueKey: `cleveland-${item.key || item.id || index}`,
          }))
        : [];
  
      let sortedData;
      switch (sortBy) {
        case "artist":
          sortedData = sortByArtist(processedData, sortOrder);
          break;
        case "date":
          sortedData = sortByDate(processedData, sortOrder);
          break;
        case "type":
          sortedData = sortByType(processedData, sortOrder);
          break;
        default:
          sortedData = processedData;
      }
  
      setResults(sortedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch Cleveland Museum data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, selectedType]);

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

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value);
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
            <Select value={sortBy} onChange={handleSortByChange} label="Sort By">
              <MenuItem value="artist">Artist</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="type">Type</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ marginRight: 2 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={selectedType} onChange={handleTypeChange} label="Filter by Type">
              <MenuItem value="">All Types</MenuItem>
              {availableTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ marginLeft: 2 }}>
            <RadioGroup row aria-labelledby="sort-order-group-label" name="sort-order-group" value={sortOrder} onChange={handleSortOrderChange}>
              <FormControlLabel value="asc" control={<Radio />} label="Asc" />
              <FormControlLabel value="desc" control={<Radio />} label="Desc" />
            </RadioGroup>
          </FormControl>

          <Button variant="contained" color="primary" onClick={() => fetchMuseumData()} sx={{ marginLeft: 2 }}>
            Apply Filters
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

      <Box sx={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", justifyContent: "center", width: "100%" }}>
  <Button
    variant="outlined"
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    sx={{
      backgroundColor: '#1976d2',  
      color: 'white',  
      '&:hover': {
        backgroundColor: '#1565c0', 
      }
    }}
  >
    Previous
  </Button>
  <Button
    variant="outlined"
    onClick={() => setPage(page + 1)}
    sx={{
      marginLeft: 2,
      backgroundColor: '#1976d2',  
      color: 'white',   
      '&:hover': {
        backgroundColor: '#1565c0', 
      }
    }}
  >
    Next
  </Button>
</Box>

    </Box>
  );
};

export default ClevelandExhibitionPage;
