import axios from "axios";

// Interfaces
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

