import axios, { AxiosResponse } from 'axios';

// Define types for the Cleveland Museum artwork data
interface Creator {
  description: string;
}

interface Artwork {
  exhibitions: {
    current: any[];
  };
  creators: Creator[];
  type: string;
  title: string;
  creation_date: string;
  description: string;
  images: {
    web: {
      url: string;
    };
  };
  accession_number: string;
  sortable_date: string;
}

interface ArtworkParsed {
  isClev: boolean;
  onDisplay: string;
  type: string;
  title: string;
  creator: string;
  creationDate: string;
  description: string;
  image: string;
  key: string;
  avatar: string;
  sortableDate: string;
}

interface QueryTerms {
  type?: string;
  page?: number; // Added page property to support pagination
  pageSize?: number; // Added pageSize property for dynamic control
}

// Cleveland Museum API setup
const clevAPI = axios.create({
  baseURL: 'https://openaccess-api.clevelandart.org/api/artworks/',
});

// Parse Cleveland Museum data
export const parsingClevData = (art: Artwork): ArtworkParsed => {
  const onDisplay = art.exhibitions.current.length !== 0
    ? 'This piece is displayed in the Cleveland Museum now'
    : 'This piece is in storage';

  const creator = art.creators.length === 0 ? 'Unknown' : art.creators[0].description;

  return {
    isClev: true,
    onDisplay: onDisplay,
    type: art.type,
    title: art.title,
    creator: creator,
    creationDate: art.creation_date,
    description: art.description,
    image: art.images.web.url,
    key: art.accession_number,
    avatar: '/assets/ClevSymbol.jpeg',
    sortableDate: art.sortable_date,
  };
};

// Fetch a single artwork by ID
export const getOneClevArt = (id: string): Promise<ArtworkParsed> => {
  return clevAPI.get(`${id}`)
    .then((response: AxiosResponse<{ data: Artwork }>) => {
      console.log(response.data.data);
      return parsingClevData(response.data.data);
    })
    .catch((error) => {
      console.error('Error fetching Cleveland artwork:', error);
      throw error;
    });
};

// Fetch a collection of artworks
export const clevelandArtworkCollection = async (terms: QueryTerms): Promise<ArtworkParsed[]> => {
  const { type, page, pageSize } = terms;
  let queryString = "?q=1&has_image=1";

  if (type) {
    queryString += `&classification_type=${type}`;
  }

  if (page) {
    queryString += `&page=${page}`;
  }

  if (pageSize) {
    queryString += `&limit=${pageSize}`;
  }

  try {
    const response = await clevAPI.get(queryString);
    return response.data.data.map((item: Artwork) => parsingClevData(item)); 
  } catch (error) {
    console.error("Error fetching Cleveland artworks:", error);
    throw error;
  }
};

// Sort artworks by artist name
export const sortByArtist = (data: ArtworkParsed[], sortOrder: 'asc' | 'desc'): ArtworkParsed[] => {
  return data.sort((a, b) => {
    const artistA = a.creator.toLowerCase();
    const artistB = b.creator.toLowerCase();

    if (artistA < artistB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (artistA > artistB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Sort artworks by date
export const sortByDate = (data: ArtworkParsed[], sortOrder: 'asc' | 'desc'): ArtworkParsed[] => {
  return data.sort((a, b) => {
    const dateA = a.sortableDate;
    const dateB = b.sortableDate;

    if (dateA === 'Unknown') return 1;
    if (dateB === 'Unknown') return -1;

    return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
  });
};
