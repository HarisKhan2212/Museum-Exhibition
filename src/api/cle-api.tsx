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
  images: { web: { url: string } };
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
export const parsingClevData = (art: ClevelandArtwork): ParsedArtwork => {
  const onDisplay =
    art.exhibitions.current.length !== 0
      ? "This piece is displayed in the Cleveland Museum now"
      : "This piece is in storage";
  const creator = art.creators.length === 0 ? "Unknown" : art.creators[0].description;
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
    avatar: "/assets/ClevSymbol.jpeg", // Adjust the path based on your actual structure
    sortableDate: art.sortable_date,
  };
};

// Sort function for artworks by artist
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

// Sort function for artworks by date
export const sortByDate = (data: ParsedArtwork[], sortOrder: "asc" | "desc"): ParsedArtwork[] => {
  return data.sort((a, b) => {
    const dateA = a.sortableDate;
    const dateB = b.sortableDate;

    if (dateA === "Unknown") {
      return 1;
    }
    if (dateB === "Unknown") {
      return -1;
    }

    if (sortOrder === "asc") {
      return dateA.localeCompare(dateB);
    } else {
      return dateB.localeCompare(dateA);
    }
  });
};

// Initialize Cleveland API using axios
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
  let clevelandQuery = "?q=1&has_image=1&limit=100";
  if (terms.type) clevelandQuery += `&classification_type=${terms.type}`;

  try {
    const response: AxiosResponse<{ data: ClevelandArtwork[] }> = await clevAPI.get(clevelandQuery);
    return response.data.data.map(parsingClevData);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// Combined function to fetch Cleveland artworks (Cleveland-specific)
export const combinedArtwork = async (
  terms: { type?: string },
  selectedCategories: string[],
  selectedMuseums: string[],
  sortBy: 'artist' | 'date',
  sortOrder: 'asc' | 'desc'
): Promise<ParsedArtwork[]> => {
  const parsedData: ParsedArtwork[] = [];
  let clevelandPromise = Promise.resolve({ data: [] });

  if (selectedMuseums.includes('Cleveland')) {
    let clevelandQuery = "?q=1&has_image=1&limit=100";
    if (selectedCategories.length !== 0) clevelandQuery += `&classification_type=${selectedCategories[0]}`;
    clevelandPromise = clevAPI.get(clevelandQuery).catch(error => {
      console.error("Cleveland API Error:", error);
      return { data: [] };
    });
  }

  const response = await clevelandPromise;
  if (selectedMuseums.includes('Cleveland')) {
    response.data.forEach((element: ClevelandArtwork) => {
      parsedData.push(parsingClevData(element));
    });
  }

  const sortedData = sortBy === 'artist' ? sortByArtist(parsedData, sortOrder) : sortByDate(parsedData, sortOrder);
  return sortedData;
};
