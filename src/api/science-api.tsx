import axios from "axios";

const API_BASE_URL = "https://collection.sciencemuseumgroup.org.uk";

// Fetch search results from Science Museum API
export const fetchSearchResults = async (
  query: string,
  page: number = 0,
  pageSize: number = 10
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        q: query,
        "page[number]": page,
        "page[size]": pageSize,
        sort: "-date", 
      },
      headers: {
        Accept: "application/json",
        "User-Agent": "YourProjectName/1.0",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

// Fetch a single object by ID from Science Museum API
export const fetchObjectById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/objects/${id}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "YourProjectName/1.0",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching object by ID:", error);
    throw error;
  }
};

