import axios from "axios";

// Base API clients
const RijksAPI = axios.create({
  baseURL: `https://www.rijksmuseum.nl/api/en/collection`,
});

const ScienceAPI = axios.create({
  baseURL: `https://collection.sciencemuseumgroup.org.uk/api/objects`,
  headers: {
    Accept: "application/json",
    "User-Agent": "YourProjectName/1.0",
  },
});

// API keys
const RIJKSMUSEUM_API_KEY = process.env.REACT_APP_RIJKSMUSEUM_API_KEY || "f09ex26I";

// Helper functions to parse the data
const parseRijksData = (item: any) => ({
  id: item.id,
  title: item.title,
  artist: item.principalOrFirstMaker,
  image: item.webImage?.url,
  description: item.plaqueDescriptionEnglish || "No description available.",
});

const parseScienceData = (item: any) => {
  const primaryTitle = item?.attributes?.title?.find((t: any) => t?.primary)?.value || "Untitled";
  const primaryDescription = item?.attributes?.description?.find((d: any) => d?.type === "web description")?.value || "No description available.";
  const maker = item?.attributes?.creation?.maker?.[0]?.summary?.title || "Unknown";
  const image = item?.attributes?.thumbnail?.large?.url || "";

  return {
    id: item?.id,
    title: primaryTitle,
    artist: maker,
    image: image,
    description: primaryDescription,
  };
};

// Fetch a single artwork from Science Museum
export const getOneScienceArt = async (id: string) => {
  try {
    const response = await ScienceAPI.get(`/${id}`);
    console.log("Science Museum Artwork Details:", response.data);
    return parseScienceData(response.data);
  } catch (error: any) {
    console.error("Error fetching Science Museum artwork:", error?.response?.status, error?.message);
    throw error;
  }
};

// Fetch multiple artworks from Science Museum
export const ScienceArtworkCollection = async (terms: { type?: string; page?: number }) => {
  const queryParams = {
    q: terms.type || "*",
    "page[number]": terms.page || 1,
    "page[size]": 10,
  };

  try {
    const response = await ScienceAPI.get(`/search`, { params: queryParams });
    console.log("Science Museum Response Data:", response.data);
    return response.data.data.map(parseScienceData);
  } catch (error: any) {
    console.error("Error fetching Science Museum collection:", error?.response?.status, error?.message);
    throw error;
  }
};

// Fetch a single artwork from Rijksmuseum
export const getOneRijksArt = async (id: string) => {
  try {
    const response = await RijksAPI.get(`/${id}`, {
      params: {
        key: RIJKSMUSEUM_API_KEY,
      },
    });
    console.log("Rijksmuseum Artwork Details:", response.data.artObject);
    return parseRijksData(response.data.artObject);
  } catch (error: any) {
    console.error("Error fetching Rijksmuseum artwork:", error?.response?.status, error?.message);
    throw error;
  }
};

// Fetch multiple artworks from Rijksmuseum
export const RijksArtworkCollection = async (terms: { type?: string; page?: number }) => {
  let query = `?key=${RIJKSMUSEUM_API_KEY}&ps=10&q=*`;
  if (terms.type) query += `&type=${terms.type}`;
  if (terms.page) query += `&p=${terms.page}`;

  try {
    const response = await RijksAPI.get(query);
    return response.data.artObjects.map(parseRijksData);
  } catch (error: any) {
    console.error("Error fetching Rijksmuseum collection:", error?.response?.status, error?.message);
    throw error;
  }
};

// Combine artworks from Rijksmuseum and Science Museum
export const CombinedArtworkCollection = async (terms: { type?: string; page?: number; selectedMuseums: string[] }) => {
  const parsedData: any[] = [];

  const rijksPromise = terms.selectedMuseums.includes("Rijksmuseum")
    ? RijksArtworkCollection(terms).catch((error: any) => {
        console.error("Rijksmuseum API Error:", error?.response?.status, error?.message);
        return [];
      })
    : Promise.resolve([]);

  const sciencePromise = terms.selectedMuseums.includes("Science Museum")
    ? ScienceArtworkCollection(terms).catch((error: any) => {
        console.error("Science Museum API Error:", error?.response?.status, error?.message);
        return [];
      })
    : Promise.resolve([]);

  const [rijksData, scienceData] = await Promise.all([rijksPromise, sciencePromise]);

  parsedData.push(...rijksData, ...scienceData);

  console.log("Combined Artwork Collection:", parsedData);
  return parsedData;
};
