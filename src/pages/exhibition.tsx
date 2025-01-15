import React, { useState, useEffect, useCallback } from "react";
import { fetchVandAResults } from "../api/va-api";
import { RijksArtworkCollection } from "../api/apiMuseum";
import { ScienceMuseumArtworkCollection } from "../api/apiMuseum";
import ArtworkCard from "../components/artworkCard";

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
      if (prevFavourites.some((fav) => fav.id === artwork.id)) {
        return prevFavourites.filter((fav) => fav.id !== artwork.id);
      } else {
        return [...prevFavourites, artwork];
      }
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
    fetchMuseumData();
  }, [fetchMuseumData]);

  return (
    <div>
      <h1>
        Explore the{" "}
        {currentMuseum === "va"
          ? "V&A"
          : currentMuseum === "rijks"
          ? "Rijksmuseum"
          : "Science Museum"}{" "}
        Collection!
      </h1>

      {/* Toggle button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => {
            setCurrentMuseum("va");
            setPage(1); // Reset pagination
            setQuery(""); // Clear search query
          }}
          disabled={currentMuseum === "va"}
        >
          Victoria & Albert Museum
        </button>
        <button
          onClick={() => {
            setCurrentMuseum("rijks");
            setPage(1); // Reset pagination
            setQuery(""); // Clear search query
          }}
          disabled={currentMuseum === "rijks"}
        >
          Rijksmuseum
        </button>
        <button
          onClick={() => {
            setCurrentMuseum("science");
            setPage(1); // Reset pagination
            setQuery(""); // Clear search query
          }}
          disabled={currentMuseum === "science"}
        >
          Science Museum
        </button>
      </div>

      {/* Search input */}
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
      />
      <button onClick={() => setPage(1)}>Search</button>

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Artwork results */}
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
      <div>
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

export default ExhibitionPage;
