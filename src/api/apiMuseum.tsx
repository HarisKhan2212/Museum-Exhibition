import axios from "axios";

// Base API clients
const RijksAPI = axios.create({
  baseURL: `https://www.rijksmuseum.nl/api/en/collection`,
});

const VAndAAPI = axios.create({
  baseURL: `https://api.vam.ac.uk/v2/objects`,
  headers: {
    Accept: "application/json",
    "User-Agent": "YourProjectName/1.0",
  },
});

// API keys
const RIJKSMUSEUM_API_KEY = process.env.REACT_APP_RIJKSMUSEUM_API_KEY || "f09ex26I";

// Interfaces
interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  description: string;
}

interface FetchTerms {
  type?: string;
  page?: number;
  selectedMuseums?: string[];
}

// Helper functions to parse the data
const parseRijksData = (item: any): Artwork => ({
  id: item.objectNumber,
  title: item.title || "Untitled",
  artist: item.principalOrFirstMaker || "Unknown",
  image: item.webImage?.url || "",
  description: item.plaqueDescriptionEnglish || "No description available.",
});

const parseVAndAData = (item: any): Artwork => {
  // Log the full data to inspect the structure
  console.log("Full item data:", JSON.stringify(item, null, 2)); // Log as a pretty JSON string for better readability
  console.log("Title field:", item.titles); // Specifically log the 'titles' field

  return {
    id: item.systemNumber,
    title: item.titles?.[0]?._primaryTitle || "Untitled", // If this path is incorrect, we can adjust it based on the log
    artist: item.primaryMaker?.name || "Unknown",
    image: item._images?.primary_thumbnail || "",
    description: item.summaryDescription || "No description available.",
  };
};


// Fetch a single artwork from Rijksmuseum
export const getOneRijksArt = async (id: string): Promise<Artwork> => {
  try {
    const response = await RijksAPI.get(`/${id}`, {
      params: {
        key: RIJKSMUSEUM_API_KEY,
      },
    });
    console.log("Rijksmuseum Artwork Details:", response.data.artObject);
    return parseRijksData(response.data.artObject);
  } catch (error: any) {
    console.error("Error fetching Rijksmuseum artwork:", error);
    throw error;
  }
};

// Fetch multiple artworks from Rijksmuseum
export const RijksArtworkCollection = async (terms: FetchTerms): Promise<Artwork[]> => {
  let query = `?key=${RIJKSMUSEUM_API_KEY}&ps=10&q=*`;
  if (terms.type) query += `&type=${terms.type}`;
  if (terms.page) query += `&p=${terms.page}`;

  try {
    const response = await RijksAPI.get(query);
    return response.data.artObjects.map(parseRijksData);
  } catch (error: any) {
    console.error("Error fetching Rijksmuseum collection:", error);
    throw error;
  }
};

// Fetch a single artwork from V&A Museum
export const getOneVAndAArt = async (id: string): Promise<Artwork> => {
  try {
    const response = await VAndAAPI.get(`/${id}`);
    console.log("V&A Museum Artwork Details:", response.data.records[0]);
    return parseVAndAData(response.data.records[0]);
  } catch (error: any) {
    console.error("Error fetching V&A artwork:", error);
    throw error;
  }
};

// Fetch multiple artworks from V&A Museum
export const VAndAArtworkCollection = async (terms: FetchTerms): Promise<Artwork[]> => {
  const queryParams = {
    page: terms.page || 1,
    page_size: 10,
    q: terms.type || "",
  };

  try {
    const response = await VAndAAPI.get(`/search`, { params: queryParams });
    return response.data.records.map(parseVAndAData);
  } catch (error: any) {
    console.error("Error fetching V&A collection:", error);
    throw error;
  }
};

// Combine artworks from Rijksmuseum and V&A Museum
export const CombinedArtworkCollection = async (terms: FetchTerms): Promise<Artwork[]> => {
  const parsedData: Artwork[] = [];

  const rijksPromise = terms.selectedMuseums?.includes("Rijksmuseum")
    ? RijksArtworkCollection(terms).catch((error) => {
        console.error("Rijksmuseum API Error:", error);
        return [];
      })
    : Promise.resolve([]);

  const vandAPromise = terms.selectedMuseums?.includes("V&A Museum")
    ? VAndAArtworkCollection(terms).catch((error) => {
        console.error("V&A Museum API Error:", error);
        return [];
      })
    : Promise.resolve([]);

  const [rijksData, vandAData] = await Promise.all([rijksPromise, vandAPromise]);

  parsedData.push(...rijksData, ...vandAData);

  console.log("Combined Artwork Collection:", parsedData);
  return parsedData;
};
