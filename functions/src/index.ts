/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https"; // Fixed spacing
import * as logger from "firebase-functions/logger"; // Fixed spacing
import axios from "axios";

interface APIResponse {
  [key: string]: unknown; // Avoid using `any`
}

// Function to fetch Louvre data
export const getLouvreData = onRequest(async (req, res) => {
  const API_KEY = process.env.LOUVRE_API_KEY || ""; // Use environment variables
  if (!API_KEY) {
    logger.error("Louvre API key is missing!");
    res.status(500).send("Louvre API key is not configured.");
    return;
  }

  try {
    const response = await axios.get<APIResponse>(
      "https://louvre-api-endpoint",
      {
        headers: {Authorization: `Bearer ${API_KEY}`},
      }
    );
    res.json(response.data);
  } catch (error: unknown) {
    logger.error(
      "Error fetching Louvre data:",
      (error as Error).message
    );
    res.status(500).send(
      "Error fetching Louvre data: " + (error as Error).message
    );
  }
});

// Function to fetch Science Museum data
export const getScienceMuseumData = onRequest(async (req, res) => {
  const API_KEY = process.env.SCIENCE_MUSEUM_API_KEY || ""; // Use env vars
  if (!API_KEY) {
    logger.error("Science Museum API key is missing!");
    res.status(500).send(
      "Science Museum API key is not configured."
    );
    return;
  }

  try {
    const response = await axios.get<APIResponse>(
      "https://science-museum-api-endpoint",
      {
        headers: {Authorization: `Bearer ${API_KEY}`},
      }
    );
    res.json(response.data);
  } catch (error: unknown) {
    logger.error(
      "Error fetching Science Museum data:",
      (error as Error).message
    );
    res.status(500).send(
      "Error fetching Science Museum data: " +
        (error as Error).message
    );
  }
});
