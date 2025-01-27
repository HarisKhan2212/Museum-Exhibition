import axios, { AxiosResponse } from 'axios';
import { useState, useEffect, useCallback } from 'react';

// Define types for the Cleveland Museum artwork data
interface Creator {
  description: string;
}

interface Artwork {
  exhibitions: { current: any[] };
  creators: Creator[];
  type: string;
  title: string;
  creation_date: string;
  description: string;
  images: { web: { url: string } };
  accession_number: string;
  sortable_date: string;
}

interface ArtworkParsed {
  isClev: boolean;
  onDisplay: string;
  type: string;
  title: string;
  creator: string;
  creationDate: string;
  description: string;
  image: string;
  key: string;
  avatar: string;
  sortableDate: string;
}

// Interface for FetchTerms (standardized across APIs)
interface FetchTerms {
  type?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

// Cleveland Museum API setup
const clevAPI = axios.create({
  baseURL: 'https://openaccess-api.clevelandart.org/api/artworks/',
});

// Parse Cleveland Museum data
export const parsingClevData = (art: Artwork): ArtworkParsed => {
  const onDisplay = art.exhibitions.current.length !== 0
    ? 'This piece is displayed in the Cleveland Museum now'
    : 'This piece is in storage';

  const creator = art.creators.length === 0 ? 'Unknown' : art.creators[0].description;

  return {
    isClev: true,
    onDisplay,
    type: art.type,
    title: art.title,
    creator,
    creationDate: art.creation_date,
    description: art.description,
    image: art.images.web.url,
    key: art.accession_number,
    avatar: '/assets/ClevSymbol.jpeg',
    sortableDate: art.sortable_date,
  };
};

// Fetch Cleveland Museum artwork collection
export const clevelandArtworkCollection = async ({ query, page = 1, pageSize = 20 }: FetchTerms): Promise<ArtworkParsed[]> => {
  const queryString = `?has_image=1&page=${page}&limit=${pageSize}${query ? `&q=${query}` : ''}`;

  try {
    const response = await clevAPI.get(queryString);
    return response.data.data.map((item: Artwork) => parsingClevData(item));
  } catch (error) {
    console.error("Error fetching Cleveland artworks:", error);
    throw error;
  }
};

// Example of how you'd fetch data in a component
const ArtworksGallery = () => {
  const [query, setQuery] = useState<string>(''); // Search query state
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const [results, setResults] = useState<ArtworkParsed[]>([]); // Artworks results
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(''); // Error state

  const fetchArtworks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await clevelandArtworkCollection({
        query,
        page: currentPage,
      });

      setResults(data);
    } catch (err) {
      setError("Failed to fetch artworks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query, currentPage]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search artworks"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}

        {/* Render Artwork Results */}
        <div>
          {results.map((art) => (
            <div key={art.key}>
              <img src={art.image} alt={art.title} />
              <h3>{art.title}</h3>
              <p>{art.creator}</p>
              <p>{art.description}</p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ArtworksGallery;
