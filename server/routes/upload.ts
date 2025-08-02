import { RequestHandler } from "express";
import multer from "multer";

// Mock Azure Document Intelligence OCR response
interface ExtractedItem {
  procedure: string;
  price: number;
}

interface OCRResponse {
  success: boolean;
  extractedItems: ExtractedItem[];
  error?: string;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF and image files
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and images are allowed."));
    }
  },
});

// Mock OCR processing function
const processDocumentWithOCR = async (
  fileBuffer: Buffer,
  mimeType: string,
): Promise<ExtractedItem[]> => {
  // In a real implementation, this would call Azure Document Intelligence API
  // For demo purposes, return mock extracted data

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockExtractions: ExtractedItem[][] = [
    [
      { procedure: "Blood Test - Complete Blood Count (CBC)", price: 45 },
      { procedure: "Lipid Panel", price: 65 },
      { procedure: "Thyroid Function Test", price: 85 },
    ],
    [
      { procedure: "X-Ray - Chest", price: 120 },
      { procedure: "Consultation Fee", price: 150 },
    ],
    [
      { procedure: "MRI - Brain", price: 850 },
      { procedure: "Radiologist Reading", price: 200 },
    ],
    [
      { procedure: "Ultrasound - Abdominal", price: 180 },
      { procedure: "Blood Test - Glucose", price: 25 },
      { procedure: "Urinalysis", price: 35 },
    ],
  ];

  // Return random mock data for demo
  const randomIndex = Math.floor(Math.random() * mockExtractions.length);
  return mockExtractions[randomIndex];
};

export const handleFileUpload: RequestHandler = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Process the file with OCR
    const extractedItems = await processDocumentWithOCR(
      file.buffer,
      file.mimetype,
    );

    const response: OCRResponse = {
      success: true,
      extractedItems,
    };

    res.json(response);
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process the uploaded file",
    });
  }
};

export const uploadMiddleware = upload.single("file");
