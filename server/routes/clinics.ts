import { RequestHandler } from "express";

interface Clinic {
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

interface ClinicSearchResponse {
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

// Mock clinic database
const mockClinics: Clinic[] = [
  {
    id: "1",
    name: "City Medical Center",
    price: 35,
    rating: 4.8,
    reviewSnippet:
      "Excellent service and very professional staff. Quick results.",
    distance: 1.2,
    address: "123 Medical Dr, Downtown",
    phone: "(555) 123-4567",
    lat: 40.7128,
    lng: -74.006,
    availableTests: [
      "Blood Test - Complete Blood Count (CBC)",
      "Lipid Panel",
      "X-Ray - Chest",
      "Ultrasound - Abdominal",
    ],
  },
  {
    id: "2",
    name: "QuickCare Clinic",
    price: 28,
    rating: 4.5,
    reviewSnippet: "Fast and affordable. Great for routine procedures.",
    distance: 2.5,
    address: "456 Health St, Midtown",
    phone: "(555) 234-5678",
    lat: 40.7589,
    lng: -73.9851,
    availableTests: [
      "Blood Test - Complete Blood Count (CBC)",
      "Thyroid Function Test",
      "Blood Test - Glucose",
      "Urinalysis",
    ],
  },
  {
    id: "3",
    name: "Premier Diagnostics",
    price: 52,
    rating: 4.9,
    reviewSnippet: "Top-notch equipment and highly experienced technicians.",
    distance: 0.8,
    address: "789 Care Ave, Uptown",
    phone: "(555) 345-6789",
    lat: 40.7831,
    lng: -73.9712,
    availableTests: [
      "MRI - Brain",
      "X-Ray - Chest",
      "Ultrasound - Abdominal",
      "Radiologist Reading",
    ],
  },
  {
    id: "4",
    name: "Community Health Hub",
    price: 30,
    rating: 4.3,
    reviewSnippet: "Good value and friendly staff. Convenient location.",
    distance: 3.1,
    address: "321 Wellness Blvd, Suburbs",
    phone: "(555) 456-7890",
    lat: 40.6892,
    lng: -74.0445,
    availableTests: [
      "Blood Test - Complete Blood Count (CBC)",
      "Lipid Panel",
      "Thyroid Function Test",
      "Blood Test - Glucose",
    ],
  },
  {
    id: "5",
    name: "Advanced Medical Group",
    price: 48,
    rating: 4.7,
    reviewSnippet: "Modern facility with state-of-the-art technology.",
    distance: 1.9,
    address: "654 Innovation Way, Tech District",
    phone: "(555) 567-8901",
    lat: 40.7282,
    lng: -73.9942,
    availableTests: [
      "MRI - Brain",
      "X-Ray - Chest",
      "Ultrasound - Abdominal",
      "Radiologist Reading",
      "Lipid Panel",
    ],
  },
  {
    id: "6",
    name: "Family Care Clinic",
    price: 25,
    rating: 4.1,
    reviewSnippet: "Budget-friendly option with caring staff.",
    distance: 4.2,
    address: "987 Family Way, Residential",
    phone: "(555) 678-9012",
    lat: 40.6782,
    lng: -74.0201,
    availableTests: [
      "Blood Test - Complete Blood Count (CBC)",
      "Blood Test - Glucose",
      "Urinalysis",
      "Thyroid Function Test",
    ],
  },
  {
    id: "7",
    name: "Metro Imaging Center",
    price: 95,
    rating: 4.6,
    reviewSnippet: "Specialized in advanced imaging with quick turnaround.",
    distance: 2.8,
    address: "147 Imaging Blvd, Medical District",
    phone: "(555) 789-0123",
    lat: 40.7456,
    lng: -73.9876,
    availableTests: [
      "MRI - Brain",
      "X-Ray - Chest",
      "Ultrasound - Abdominal",
      "Radiologist Reading",
    ],
  },
];

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

export const searchClinics: RequestHandler = async (req, res) => {
  try {
    const { procedure, price, lat, lng } = req.query;

    if (!procedure || !price) {
      return res.status(400).json({
        success: false,
        error: "Procedure name and price are required",
      });
    }

    const userPaidPrice = parseFloat(price as string);
    const userLat = lat ? parseFloat(lat as string) : 40.7128; // Default to NYC
    const userLng = lng ? parseFloat(lng as string) : -74.006;

    // Filter clinics that offer the specific procedure
    let availableClinics = mockClinics.filter((clinic) =>
      clinic.availableTests.some(
        (test) =>
          test.toLowerCase().includes((procedure as string).toLowerCase()) ||
          (procedure as string).toLowerCase().includes(test.toLowerCase()),
      ),
    );

    // If no exact matches, return all clinics (fallback for demo)
    if (availableClinics.length === 0) {
      availableClinics = mockClinics;
    }

    // Calculate actual distances based on user location
    availableClinics = availableClinics.map((clinic) => ({
      ...clinic,
      distance: calculateDistance(userLat, userLng, clinic.lat, clinic.lng),
    }));

    // Sort by distance and take nearest 5-7 clinics
    availableClinics = availableClinics
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 7);

    // Generate some price variation for the same procedure
    availableClinics = availableClinics.map((clinic) => {
      const basePrice = clinic.price;
      const variation = 0.8 + Math.random() * 0.4; // ±20% variation
      return {
        ...clinic,
        price: Math.round(basePrice * variation),
      };
    });

    const prices = availableClinics.map((c) => c.price);
    const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const bestPrice = Math.min(...prices);
    const savings = userPaidPrice - averagePrice;
    const potentialSavings = userPaidPrice - bestPrice;

    const response: ClinicSearchResponse = {
      success: true,
      clinics: availableClinics,
      userPaidPrice,
      averagePrice: Math.round(averagePrice * 100) / 100,
      bestPrice,
      analysis: {
        savings: Math.round(savings * 100) / 100,
        overpaid: savings < 0,
        potentialSavings: Math.round(potentialSavings * 100) / 100,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Clinic search error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search for clinics",
    });
  }
};
