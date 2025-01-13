import React, { useState, useEffect } from "react";
import { RijksArtworkCollection } from "../api/apiMuseum";
import ArtworkCard from "../components/artworkCard";

const RijksmuseumPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalResults, setTotalResults] = useState(0); // Track total number of results from the API
  const itemsPerPage = 10; // Define how many items per page

  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      if (prevFavourites.some((fav) => fav.id === artwork.id)) {
        return prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        return [...prevFavourites, artwork];
      }
    });
  };

  const handleSearch = async (page: number = currentPage) => {
    setLoading(true);
    setError("");
    try {
      const data = await RijksArtworkCollection({ type: query, page });
      setResults(data || []);
      setTotalResults(data.length); // Assuming the API returns results based on the current page
    } catch (err) {
      setError("Failed to fetch data from Rijksmuseum. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage]); // Re-fetch when the page changes

  const goToNextPage = () => {
    if (currentPage * itemsPerPage < totalResults) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate the total number of pages

  return (
    <div>
      <h1>Search the Rijksmuseum Collection!</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Painting, Sculpture, etc."
      />
      <button onClick={() => handleSearch()}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {results.map((item) => (
          <ArtworkCard
            key={item.id}
            artwork={item}
            onFavouriteToggle={handleFavouriteToggle}
            isFavourite={favourites.some((fav) => fav.id === item.id)}
          />
        ))}
      </div>

      {/* Pagination controls */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default RijksmuseumPage;


