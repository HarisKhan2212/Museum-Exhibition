import axios from "axios";

// Base URL for the V&A API
const VA_API_BASE_URL = "https://api.vam.ac.uk/v2";

// Helper function to map V&A data to the ArtworkCard format
const mapVandAData = (data: any[]) => {
  return data.map((item) => ({
    id: item.systemNumber, // Unique ID
    title: item.title || "Untitled",
    image: item._primaryImageId
      ? `https://media.vam.ac.uk/media/thira/collection_images/${item._primaryImageId.slice(0, 6)}/${item._primaryImageId}.jpg`
      : "https://via.placeholder.com/150", // Construct image URL or fallback
    description: item.longDescription || item.briefDescription || "No description available.",
  }));
};

// Fetch search results from V&A API
export const fetchVandAResults = async (
  query: string,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const response = await axios.get(`${VA_API_BASE_URL}/objects/search`, {
      params: {
        q: query,
        page, // Pagination
        page_size: pageSize,
      },
      headers: {
        Accept: "application/json",
      },
    });

    // Map API response to a standardized format
    const mappedData = mapVandAData(response.data.records || []);
    return mappedData;
  } catch (error) {
    console.error("Error fetching V&A results:", error);
    throw error;
  }
};
