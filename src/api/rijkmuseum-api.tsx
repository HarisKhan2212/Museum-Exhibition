import axios from "axios";

const API_BASE_URL = "https://www.rijksmuseum.nl/api/en";
const API_KEY = process.env.REACT_APP_RIJKSMUSEUM_API_KEY;

export const fetchBaseAPIResponse = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/collection`, {
      params: {
        key: API_KEY,
      },
    });
    console.log("Base API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching base API response:", error);
    throw error;
  }
};

export const fetchArtworkDetails = async (artworkId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/collection/${artworkId}`, {
      params: { key: API_KEY },
    });
    return response.data.artObject;
  } catch (error) {
    console.error("Error fetching artwork details:", error);
    throw error;
  }
};

export const searchArtworks = async (
  query: string,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/collection`, {
      params: {
        key: API_KEY,
        q: query,
        ps: pageSize,
        p: page,
      },
    });
    return response.data.artObjects;
  } catch (error) {
    console.error("Error searching artworks:", error);
    throw error;
  }
};
