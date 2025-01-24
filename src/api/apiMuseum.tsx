import axios from "axios";

// Base API client for V&A
const VAndAAPI = axios.create({
  baseURL: "https://api.vam.ac.uk/v2/objects",
  headers: {
    Accept: "application/json",
    "User-Agent": "ExhibitionCurationPlatform/1.0",
  },
});

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

// Utility: Extract image URLs
export const getImageUrls = (artwork: any): string[] => {
  const imageUrls: string[] = [];
  if (artwork.images?.web) {
    imageUrls.push(artwork.images.web.url);
  }
  if (artwork.alternate_images) {
    artwork.alternate_images.forEach((image: any) => {
      if (image.web) {
        imageUrls.push(image.web.url);
      }
    });
  }
  return imageUrls;
};

// Utility: Get full-size image URLs
export const getFullImage = (artwork: any): string[] => {
  const imageUrls: string[] = [];
  if (artwork.images && artwork.images.length > 0) {
    artwork.images.forEach((imgId: string) => {
      imageUrls.push(
        `https://framemark.vam.ac.uk/collections/${imgId}/full/full/0/default.jpg`
      );
    });
  } else if (artwork._primaryImageId) {
    imageUrls.push(
      `https://framemark.vam.ac.uk/collections/${artwork._primaryImageId}/full/full/0/default.jpg`
    );
  }
  return imageUrls;
};

// Utility: Truncate title
export const truncateTitle = (title: string, maxLength: number): string => {
  return title.length > maxLength
    ? title.substring(0, maxLength) + "..."
    : title;
};

// Utility: Reduce collections
export const reduceCollections = (collectionArray: any[]): any[] => {
  return collectionArray.map((item) => {
    if (item.collection_type === "two") {
      const { id, title, images, technique, creation_date } = item.artwork;

      return {
        ...item,
        artwork: {
          id,
          title,
          images: images || [],
          technique,
          creation_date,
        },
      };
    }
    if (item.collection_type === "one") {
      const {
        systemNumber,
        _primaryTitle,
        objectType,
        _primaryDate,
        _primaryImageId,
        _images,
        images,
        productionDates,
        titles,
      } = item.artwork;

      return {
        ...item,
        artwork: {
          systemNumber,
          _primaryTitle: _primaryTitle || titles?.[0]?.title || "Unknown Title",
          objectType,
          _primaryDate:
            _primaryDate || productionDates?.[0]?.date.text || "Unknown Date",
          _primaryImageId: _primaryImageId || images?.[0] || null,
          _images: _images || null,
        },
      };
    }

    return item;
  });
};

// Parsing function for V&A data
export const parsingVAData = (art: any): Artwork => {
  const title = art.titles?.[0]?.title || art._primaryTitle || "Untitled";
  const description = art.summaryDescription || "No description available.";
  const creator = art._primaryMaker?.name || "Unknown";
  const image =
    art._primaryImageId
      ? `https://framemark.vam.ac.uk/collections/${art._primaryImageId}/full/full/0/default.jpg`
      : "https://via.placeholder.com/600x400?text=No+Image";

  return {
    id: art.systemNumber || "Unknown",
    title,
    artist: creator,
    description,
    image,
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

    return parsingVAData(artData);
  } catch (error) {
    console.error("Error fetching V&A artwork:", error);
    throw error;
  }
};

// Fetch V&A artwork collection
export const VAndAArtworkCollection = async (
  terms: FetchTerms
): Promise<Artwork[]> => {
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

    return artworks.map(parsingVAData);
  } catch (error) {
    console.error("Error fetching V&A collection:", error);
    throw error;
  }
};
