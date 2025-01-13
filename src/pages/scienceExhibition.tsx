import React, { useState, useEffect, useCallback } from "react";
import { fetchSearchResults } from "../api/science-api";
import ArtworkCard from "../components/artworkCard";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      if (prevFavourites.some((fav) => fav.id === artwork.id)) {
        return prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        return [...prevFavourites, artwork];
      }
    });
  };

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSearchResults(query, page, pageSize);
      console.log("API Response:", data);
      const sortedResults = (data.data || []).sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setResults(sortedResults);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query, page, pageSize]);
  

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div>
      <h1>Search the Science Museum Group!</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g Biology, Computing etc..."
      />
      <button onClick={() => setPage(1)}>Search</button> {}

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

      {}
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default SearchPage;

