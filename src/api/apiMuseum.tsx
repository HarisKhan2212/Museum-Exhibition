import axios from "axios";

// Base API clients
const RijksAPI = axios.create({
  baseURL: "https://www.rijksmuseum.nl/api/en/collection",
});

const VAndAAPI = axios.create({
  baseURL: "https://api.vam.ac.uk/v2/objects",
  headers: {
    Accept: "application/json",
    "User-Agent": "ExhibitionCurationPlatform/1.0",
  },
});

const ScienceMuseumAPI = axios.create({
  baseURL: "https://collection.sciencemuseumgroup.org.uk",
  headers: {
    Accept: "application/json",
    "User-Agent": "ExhibitionCurationPlatform/1.0",
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
  onDisplay?: string;
  creationDate?: string;
  sortableDate?: number;
}

interface FetchTerms {
  type?: string;
  page?: number;
  selectedMuseums?: string[];
}

// Helper functions to parse data
const parseRijksData = (item: any): Artwork => ({
  id: item.objectNumber,
  title: item.title || "Untitled",
  artist: item.principalOrFirstMaker || "Unknown",
  image: item.webImage?.url || "",
  description: item.plaqueDescriptionEnglish || "No description available.",
});

const parseVAndAData = (item: any): Artwork => {
  const onDisplay = item.onDisplay
    ? "This piece is displayed in the V&A now"
    : "This piece is in storage";
  const creator = item._primaryMaker?.name || "Unknown";

  const numbers: number[] = [];
  const foundNumbers = item._primaryDate?.match(/-?\d+/g);
  if (foundNumbers) {
    numbers.push(...foundNumbers.map(Number));
  }

  const foundBC = item._primaryDate?.match(/\bbc\b/gi);
  let sortedDate = numbers.length > 0 ? numbers[0] : undefined;
  if (foundBC && sortedDate !== undefined) {
    sortedDate = -sortedDate;
  }

  return {
    id: item.systemNumber,
    title: item._primaryTitle || "Untitled",
    artist: creator,
    image: `https://framemark.vam.ac.uk/collections/${item._primaryImageId}/full/600,400/0/default.jpg`,
    description: item.summaryDescription || "No description available.",
    onDisplay,
    creationDate: item._primaryDate || "Unknown",
    sortableDate: sortedDate,
  };
};

const parseScienceMuseumData = (item: any): Artwork => ({
  id: item.id,
  title: item.attributes?.title?.[0]?.value || "Untitled",
  artist: "Unknown", // Placeholder as artist information isn't provided in the specified paths
  image: item.attributes?.multimedia?.[0]?.["@processed"]?.large?.location || "",
  description: item.attributes?.description?.[0]?.value || "No description available.",
});

// Fetch single artwork
export const getOneRijksArt = async (id: string): Promise<Artwork> => {
  try {
    const response = await RijksAPI.get(`/${id}`, {
      params: { key: RIJKSMUSEUM_API_KEY },
    });
    return parseRijksData(response.data.artObject);
  } catch (error) {
    console.error("Error fetching Rijksmuseum artwork:", error);
    throw error;
  }
};

export const getOneVAndAArt = async (id: string): Promise<Artwork> => {
  try {
    const response = await VAndAAPI.get(`/${id}`);
    console.log("V&A Single Artwork Data:", response.data.records[0]); // Fix: Added explicit access to the first record
    return parseVAndAData(response.data.records[0]);
  } catch (error) {
    console.error("Error fetching V&A artwork:", error);
    throw error;
  }
};

export const getOneScienceMuseumArt = async (id: string): Promise<Artwork> => {
  try {
    const response = await ScienceMuseumAPI.get(`/objects/${id}`);
    console.log("Science Museum Single Artwork Data:", response.data.data); // Log Science Museum single artwork data
    return parseScienceMuseumData(response.data.data);
  } catch (error) {
    console.error("Error fetching Science Museum artwork:", error);
    throw error;
  }
};

// Fetch multiple artworks
export const RijksArtworkCollection = async (terms: FetchTerms): Promise<Artwork[]> => {
  let query = `?key=${RIJKSMUSEUM_API_KEY}&ps=10&q=*`;
  if (terms.type) query += `&type=${terms.type}`;
  if (terms.page) query += `&p=${terms.page}`;

  try {
    const response = await RijksAPI.get(query);
    console.log("Rijksmuseum Collection Data:", response.data); // Log Rijksmuseum collection data
    return response.data.artObjects.map(parseRijksData);
  } catch (error) {
    console.error("Error fetching Rijksmuseum collection:", error);
    throw error;
  }
};

export const VAndAArtworkCollection = async (terms: FetchTerms): Promise<Artwork[]> => {
  const queryParams = {
    page: terms.page || 1,
    page_size: 10,
    q: terms.type || "",
  };

  try {
    const response = await VAndAAPI.get("/search", { params: queryParams });
    console.log("V&A Collection Data:", response.data.records); // Fix: Ensure logging works for records
    return response.data.records.map(parseVAndAData);
  } catch (error) {
    console.error("Error fetching V&A collection:", error);
    throw error;
  }
};

export const ScienceMuseumArtworkCollection = async (terms: FetchTerms): Promise<Artwork[]> => {
  const queryParams = {
    q: terms.type || "",
    "page[number]": terms.page || 1,
    "page[size]": 10,
    sort: "-date",
  };

  try {
    const response = await ScienceMuseumAPI.get("/search", { params: queryParams });
    console.log("Science Museum Collection Data:", response.data.data); // Log Science Museum collection data
    return response.data.data.map(parseScienceMuseumData);
  } catch (error) {
    console.error("Error fetching Science Museum collection:", error);
    throw error;
  }
};
