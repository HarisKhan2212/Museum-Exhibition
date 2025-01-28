import axios, { AxiosResponse } from 'axios';

// Define types for the Cleveland API response
interface ClevelandArtwork {
  id: number;
  title: string;
  creators: Array<{ description: string }>;
  exhibitions: { current: Array<any> };
  type: string;
  creation_date: string;
  description: string;
  images?: {
    web?: {
      url?: string;
    };
  };
  accession_number: string;
  sortable_date: string;
}

// Define the parsed format for the artwork
interface ParsedArtwork {
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

// Parsing function for Cleveland data
export const parsingClevData = (art: ClevelandArtwork): ParsedArtwork | null => {
  try {
    // Check if the artwork has the required image data
    if (!art.images?.web?.url) {
      console.log(`Skipping artwork ${art.id} due to missing image data`);
      return null;
    }

    const onDisplay =
      art.exhibitions?.current?.length !== 0
        ? "This piece is displayed in the Cleveland Museum now"
        : "This piece is in storage";

    const creator = art.creators?.length === 0 ? "Unknown" : art.creators[0]?.description || "Unknown";

    return {
      isClev: true,
      onDisplay,
      type: art.type || "Unknown",
      title: art.title || "Untitled",
      creator,
      creationDate: art.creation_date || "Unknown",
      description: art.description || "No description available",
      image: art.images.web.url,
      key: art.accession_number || String(art.id),
      avatar: "/assets/ClevSymbol.jpeg",
      sortableDate: art.sortable_date || "Unknown",
    };
  } catch (error) {
    console.error(`Error parsing artwork ${art.id}:`, error);
    return null;
  }
};

// Sort functions remain the same
export const sortByArtist = (data: ParsedArtwork[], sortOrder: "asc" | "desc"): ParsedArtwork[] => {
  return data.sort((a, b) => {
    const artistA = a.creator.toLowerCase();
    const artistB = b.creator.toLowerCase();

    if (artistA < artistB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (artistA > artistB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
};

export const sortByDate = (data: ParsedArtwork[], sortOrder: "asc" | "desc"): ParsedArtwork[] => {
  return data.sort((a, b) => {
    // Handle cases where date is unknown or missing
    if (a.sortableDate === "Unknown" || !a.sortableDate) {
      return 1;  // Move unknown dates to the end
    }
    if (b.sortableDate === "Unknown" || !b.sortableDate) {
      return -1; // Move unknown dates to the end
    }

    // Parse the dates as integers to handle negative years correctly
    const yearA = parseInt(a.sortableDate);
    const yearB = parseInt(b.sortableDate);

    // Handle invalid parsing results
    if (isNaN(yearA)) return 1;
    if (isNaN(yearB)) return -1;

    // Compare the years based on sort order
    if (sortOrder === "asc") {
      return yearA - yearB;
    } else {
      return yearB - yearA;
    }
  });
};


export const sortByType = (data: ParsedArtwork[], sortOrder: "asc" | "desc"): ParsedArtwork[] => {
  return data.sort((a, b) => {
    const typeA = a.type.toLowerCase();
    const typeB = b.type.toLowerCase();

    if (typeA < typeB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (typeA > typeB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
};

// Initialize Cleveland API
const clevAPI = axios.create({
  baseURL: `https://openaccess-api.clevelandart.org/api/artworks/`
});

// Function to fetch a single Cleveland artwork by ID
export const getOneClevArt = async (id: string): Promise<ClevelandArtwork> => {
  try {
    const response: AxiosResponse<{ data: ClevelandArtwork }> = await clevAPI.get(`${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    throw error;
  }
};

// Function to fetch Cleveland artwork collection with filtering
export const clevelandArtworkCollection = async (terms: { type?: string }): Promise<ParsedArtwork[]> => {
  let clevelandQuery = "?q=1&has_image=1";
  if (terms.type) clevelandQuery += `&classification_type=${terms.type}`;

  try {
    const response: AxiosResponse<{ data: ClevelandArtwork[] }> = await clevAPI.get(clevelandQuery);
    // Filter out null values from parsing
    const parsedArtworks = response.data.data
      .map(parsingClevData)
      .filter((artwork): artwork is ParsedArtwork => artwork !== null);
    return parsedArtworks;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// Combined function to fetch Cleveland artworks
export const combinedArtwork = async (
  terms: { type?: string },
  selectedCategories: string[],
  selectedMuseums: string[],
  sortBy: 'artist' | 'date' | 'type',
  sortOrder: 'asc' | 'desc'
): Promise<ParsedArtwork[]> => {
  const parsedData: ParsedArtwork[] = [];
  let clevelandPromise = Promise.resolve({ data: [] });

  if (selectedMuseums.includes('Cleveland')) {
    let clevelandQuery = "?q=1&has_image=1";
    if (selectedCategories.length !== 0) clevelandQuery += `&classification_type=${selectedCategories[0]}`;
    clevelandPromise = clevAPI.get(clevelandQuery).catch(error => {
      console.error("Cleveland API Error:", error);
      return { data: [] };
    });
  }

  const response = await clevelandPromise;
  if (selectedMuseums.includes('Cleveland')) {
    response.data.forEach((element: ClevelandArtwork) => {
      const parsedArtwork = parsingClevData(element);
      if (parsedArtwork) {
        parsedData.push(parsedArtwork);
      }
    });
  }

  let sortedData: ParsedArtwork[];
  switch (sortBy) {
    case 'artist':
      sortedData = sortByArtist(parsedData, sortOrder);
      break;
    case 'date':
      sortedData = sortByDate(parsedData, sortOrder);
      break;
    case 'type':
      sortedData = sortByType(parsedData, sortOrder);
      break;
    default:
      sortedData = parsedData;
  }
  
  return sortedData;
};

// New function to fetch available artwork types
export const getArtworkTypes = async (): Promise<string[]> => {
  try {
    const response = await clevAPI.get('?limit=100');  // Get a sample to extract types
    const artworks = response.data.data;
    
    // Extract unique types
    const types = new Set<string>();
    artworks.forEach((artwork: ClevelandArtwork) => {
      if (artwork.type) {
        types.add(artwork.type);
      }
    });
    
    // Convert to array and sort alphabetically
    return Array.from(types).sort();
  } catch (error) {
    console.error('Error fetching artwork types:', error);
    return [];
  }
};