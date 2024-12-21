import React, { useState, useEffect } from "react";
import { fetchSearchResults } from "../api/science-api";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      <ul>
        {results.map((item) => (
          <li key={item.id}>
            <p>Type: {item.type}</p>
            <p>ID: {item.id}</p>
            <a href={item.links.self} target="_blank" rel="noopener noreferrer">
              View Item
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
