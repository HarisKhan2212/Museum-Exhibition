import React, { useState, useEffect, useCallback } from "react";
import { fetchVandAResults } from "../api/va-api";  // Ensure you have an API to fetch V&A data
import ArtworkCard from "../components/artworkCard";

const VAndAPage: React.FC = () => {
  const [query, setQuery] = useState("");  // Search query state
  const [results, setResults] = useState<any[]>([]);  // Fetched results
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState("");  // Error handling
  const [favourites, setFavourites] = useState<any[]>([]);  // Favourite state
  const [page, setPage] = useState(1);  // Pagination state
  const pageSize = 10;  // Number of items per page

  // Handle favourite toggle with the full artwork object
  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      if (prevFavourites.some((fav) => fav.id === artwork.id)) {
        return prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        return [...prevFavourites, artwork];
      }
    });
  };

  // Search function
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
        
      const data = await fetchVandAResults(query, page, pageSize);
      setResults(data);  // Assuming the API sorts by date by default
    } catch (err) {
      setError("Failed to fetch data from V&A. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  // Function to fetch the latest 10 items when the page loads
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchVandAResults("", 1, pageSize);  // Empty query for latest items
      setResults(data);  // Set the latest items to the state
    } catch (err) {
      setError("Failed to fetch data from V&A. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once when the page is first loaded to get the latest 10 items
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Run the search whenever the query, page, or search function changes
  useEffect(() => {
    if (query.trim() !== "") {
      handleSearch();
    }
  }, [query, page, handleSearch]);

  return (
    <div>
      <h1>Explore the Victoria & Albert Museum Collection!</h1>
      
      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search V&A collections..."
      />
      <button onClick={() => setPage(1)}>Search</button>

      {/* Loading state */}
      {loading && <p>Loading...</p>}
      
      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
      {results.map((item) => {
  console.log("Artwork item:", item); // Log each artwork object
  return (
    <ArtworkCard
      key={item.id}
      artwork={item}
      onFavouriteToggle={handleFavouriteToggle}
      isFavourite={favourites.some((fav) => fav.id === item.id)}
    />
  );
})}

      </div>

      <div>
        {/* Pagination controls */}
        <button
          disabled={page === 1}
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
        >
          Previous
        </button>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default VAndAPage;

