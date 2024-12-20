import axios from "axios";

const API_BASE_URL = "https://collections.louvre.fr";

export const fetchArtworkDetails = async (artworkId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ark:/53355/${artworkId}.json`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "YourProjectName/1.0",
      },
    });
    return response.data;
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
  console.warn(
    "The Louvre JSON data retrieval method does not support searching or paginated results directly. This is a placeholder."
  );
  return {
    message:
      "The Louvre's JSON API does not support search. You may need to scrape or manually filter results.",
  };
};
