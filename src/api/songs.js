import axios from "axios";

const API_URL = "http://localhost:3000/api/songs";

export const searchSongs = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching songs:", error);
    throw error;
  }
};

export const fetchSongs = async (currentPage = 1) => {
  try {
    const response = await axios.get(`${API_URL}?currentPage=${currentPage}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};
