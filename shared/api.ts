/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// HealthRate API Types
export interface ExtractedItem {
  procedure: string;
  price: number;
}

export interface OCRResponse {
  success: boolean;
  extractedItems: ExtractedItem[];
  error?: string;
}

export interface Clinic {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewSnippet: string;
  distance: number;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  availableTests: string[];
}

export interface ClinicSearchResponse {
  success: boolean;
  clinics: Clinic[];
  userPaidPrice: number;
  averagePrice: number;
  bestPrice: number;
  analysis: {
    savings: number;
    overpaid: boolean;
    potentialSavings: number;
  };
}
