// In your parent component (e.g., SearchPage)
import React, { useState, useEffect } from "react";
import { fetchSearchResults } from "../api/science-api";
import ArtworkCard from "../components/scienceCard";  // Make sure to import ArtworkCard

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favourites, setFavourites] = useState<any[]>([]);

  const handleFavouriteToggle = (artwork: any) => {
    setFavourites((prevFavourites) => {
      if (prevFavourites.some((fav) => fav.id === artwork.id)) {
        return prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        return [...prevFavourites, artwork];
      }
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSearchResults(query);
      setResults(data.data || []);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <h1>Search the Science Museum Group!</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g Biology, Computing etc..."
      />
      <button onClick={handleSearch}>Search</button>

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
    </div>
  );
};

export default SearchPage;
