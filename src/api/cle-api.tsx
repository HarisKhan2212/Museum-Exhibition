// All imports should be at the top
import axios, { AxiosResponse } from 'axios';
import React, { useState, useEffect, useCallback } from 'react';

// Define types for the Cleveland Museum artwork data
interface Creator {
  description: string;
}

interface Artwork {
  exhibitions: {
    current: any[];
  };
  creators: Creator[];
  type: string;
  title: string;
  creation_date: string;
  description: string;
  images: {
    web: {
      url: string;
    };
  };
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

interface QueryTerms {
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
    onDisplay: onDisplay,
    type: art.type,
    title: art.title,
    creator: creator,
    creationDate: art.creation_date,
    description: art.description,
    image: art.images.web.url,
    key: art.accession_number,
    avatar: '/assets/ClevSymbol.jpeg',
    sortableDate: art.sortable_date,
  };
};

// Fetch a single artwork by ID
export const getOneClevArt = (id: string): Promise<ArtworkParsed> => {
  return clevAPI.get(`${id}`)
    .then((response: AxiosResponse<{ data: Artwork }>) => {
      console.log(response.data.data);
      return parsingClevData(response.data.data);
    })
    .catch((error) => {
      console.error('Error fetching Cleveland artwork:', error);
      throw error;
    });
};

// Fetch a collection of artworks
export const clevelandArtworkCollection = async (terms: QueryTerms): Promise<ArtworkParsed[]> => {
  const { query, page = 1 } = terms;
  const pageSize = 20;
  
  let queryString = `?has_image=1&page=${page}&limit=${pageSize}`;

  if (query) {
    queryString += `&q=${query}`;
  }

  try {
    const response = await clevAPI.get(queryString);
    return response.data.data.map((item: Artwork) => parsingClevData(item));
  } catch (error) {
    console.error("Error fetching Cleveland artworks:", error);
    throw error;
  }
};
  
  
  

// Sort artworks by artist name
export const sortByArtist = (data: ArtworkParsed[], sortOrder: 'asc' | 'desc'): ArtworkParsed[] => {
  return data.sort((a, b) => {
    const artistA = a.creator.toLowerCase();
    const artistB = b.creator.toLowerCase();

    if (artistA < artistB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (artistA > artistB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Sort artworks by date
export const sortByDate = (data: ArtworkParsed[], sortOrder: 'asc' | 'desc'): ArtworkParsed[] => {
  return data.sort((a, b) => {
    const dateA = a.sortableDate;
    const dateB = b.sortableDate;

    if (dateA === 'Unknown') return 1;
    if (dateB === 'Unknown') return -1;

    return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
  });
};

// Component for handling the page and search
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