import axios from "axios";


export interface Artwork {
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

export interface FetchTerms {
  type?: string;
  page?: number;
  selectedMuseums?: string[];
}

// Fetch a single object by ID from Science Museum API
export const fetchObjectById = async (id: string) => {
  try {
    const response = await axios.get(`${ScienceMuseumAPI}/objects/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching object by ID:", error);
    throw error;
  }
};


// Base API client for Science Museum
const ScienceMuseumAPI = axios.create({
  baseURL: "https://collection.sciencemuseumgroup.org.uk",
  headers: {
    Accept: "application/json",
  },
});

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

  const imagePath =
    item.attributes?.multimedia?.[0]?.["@processed"]?.medium?.location;

    

  return {
    id: item.id,
    title: item.attributes?.title?.[0]?.value || "Untitled",
    artist: "Unknown", // Artist info might be missing
    image: imagePath
      ? `https://coimages.sciencemuseumgroup.org.uk/${imagePath}`
      : "https://via.placeholder.com/600x400?text=No+Image",
    description: item.attributes?.description?.[0]?.value || "No description available.",
  };
};

// Fetch Science Museum artwork collection
export const ScienceMuseumArtworkCollection = async (
  terms: FetchTerms
): Promise<Artwork[]> => {
  const queryParams = {
    q: terms.type || "",
    "page[number]": terms.page || 1,
    "page[size]": 20,
    sort: "-date",
  };

  try {
    const response = await ScienceMuseumAPI.get("/search", {
      params: queryParams,
    });
    return response.data.data.map(parseScienceMuseumData);
  } catch (error) {
    console.error("Error fetching Science Museum collection:", error);
    throw error;
  }
};

// Fetch single Science Museum artwork
export const getOneScienceMuseumArt = async (
  id: string
): Promise<Artwork> => {
  try {
    const response = await ScienceMuseumAPI.get(`/objects/${id}`);
    return parseScienceMuseumData(response.data.data);
  } catch (error) {
    console.error("Error fetching Science Museum artwork:", error);
    throw error;
  }
};

