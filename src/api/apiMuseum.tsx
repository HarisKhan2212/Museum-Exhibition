import axios from "axios";

// Base API clients
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
  imageUrls?: string[];
  fullImageUrls?: string[];
}

interface FetchTerms {
  type?: string;
  page?: number;
  selectedMuseums?: string[];
}

// Parsing function for V&A data
export const parsingVAData = (art: any): Artwork => {

  const onDisplay = art.onDisplay ? 'This piece is displayed in the V & A now' : 'This piece is in storage';

  const creator = art._primaryMaker?.name || 'Unknown';

  const dated = art._primaryDate.length === 0 ? 'Unknown' : art._primaryDate;

  const numbers: number[] = [];
  const foundNumbers = art._primaryDate.match(/-?\d+/g);
  
  if (foundNumbers) {
    numbers.push(...foundNumbers.map(Number));
  }

  const foundBC = art._primaryDate.match(/\bbc\b/gi);
  let sortedDate = numbers.length > 0 ? numbers[0] : undefined; 
  if (foundBC && sortedDate !== undefined) {
    sortedDate = -sortedDate;
  }

  // Extract the title from the API response
  const title = art.titles?.[0]?.title || 'Untitled';

  // Extract the summary description from the API response
  const description = art.summaryDescription || 'No description available.';

  // Return parsed artwork object
  return {
    id: art.systemNumber || 'Unknown',
    artist: creator,
    onDisplay: onDisplay,
    title: title,  // Use the dynamically extracted title
    image: `https://framemark.vam.ac.uk/collections/${art._primaryImageId}/full/600,400/0/default.jpg`,
    description: description,  // Use the dynamically extracted description
    creationDate: dated,
    sortableDate: sortedDate,
  };
};

// Fetch single V&A artwork
export const getOneVAndAArt = async (id: string): Promise<Artwork> => {
  try {
    const response = await VAndAAPI.get(`/${id}`);
    const artData = response.data?.record;

    if (!artData) {
      throw new Error("No valid record found for this V&A item.");
    }

    // Parse the V&A artwork using the parsing function
    return parsingVAData(artData);
  } catch (error) {
    console.error("Error fetching V&A artwork:", error);
    throw error;
  }
};

// Fetch V&A artwork collection
export const VAndAArtworkCollection = async (terms: { type?: string; page?: number }): Promise<Artwork[]> => {
  const queryParams = {
    page: terms.page || 1,
    page_size: 10,
    q: terms.type || "",
  };

  try {
    const response = await VAndAAPI.get("/search", { params: queryParams });
    const artworks = response.data?.records || [];

    if (!artworks.length) {
      throw new Error("No records found in the V&A collection.");
    }

    // Parse each V&A artwork in the collection
    return artworks.map(parsingVAData);
  } catch (error) {
    console.error("Error fetching V&A collection:", error);
    throw error;
  }
};

// Fetch single Science Museum artwork
export const getOneScienceMuseumArt = async (id: string): Promise<Artwork> => {
  try {
    const response = await ScienceMuseumAPI.get(`/objects/${id}`);
    return parseScienceMuseumData(response.data.data);
  } catch (error) {
    console.error("Error fetching Science Museum artwork:", error);
    throw error;
  }
};

// Helper function to parse Science Museum data
const parseScienceMuseumData = (item: any): Artwork => {
  if (!item || !item.id) {
    console.error("Invalid Science Museum item:", item);
    return {
      id: "Unknown",
      title: "Untitled",
      artist: "Unknown",
      image: "https://via.placeholder.com/600x400?text=No+Image",
      description: "No description available.",
    };
  }

  const imagePath = item.attributes?.multimedia?.[0]?.["@processed"]?.medium?.location;
  
  return {
    id: item.id,
    title: item.attributes?.title?.[0]?.value || "Untitled",
    artist: "Unknown",  // Artist info might be missing
    image: imagePath
      ? `https://coimages.sciencemuseumgroup.org.uk/${imagePath}`
      : "https://via.placeholder.com/600x400?text=No+Image",
    description: item.attributes?.description?.[0]?.value || "No description available.",
  };
};

// Fetch Science Museum artwork collection
export const ScienceMuseumArtworkCollection = async (terms: FetchTerms): Promise<Artwork[]> => {
  const queryParams = {
    q: terms.type || "",
    "page[number]": terms.page || 1,
    "page[size]": 10,
    sort: "-date",
  };

  try {
    const response = await ScienceMuseumAPI.get("/search", { params: queryParams });
    return response.data.data.map(parseScienceMuseumData);
  } catch (error) {
    console.error("Error fetching Science Museum collection:", error);
    throw error;
  }
};
