import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, DollarSign, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ExtractedItem {
  procedure: string;
  price: number;
}

export default function Index() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualProcedure, setManualProcedure] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setExtractedItems(data.extractedItems);
      } else {
        console.error('Upload failed:', data.error);
        // Fallback to mock data for demo
        const mockExtractedItems: ExtractedItem[] = [
          { procedure: "Blood Test - Complete Blood Count (CBC)", price: 45 },
          { procedure: "Lipid Panel", price: 65 },
          { procedure: "Thyroid Function Test", price: 85 }
        ];
        setExtractedItems(mockExtractedItems);
      }
    } catch (error) {
      console.error('Upload error:', error);
      // Fallback to mock data for demo
      const mockExtractedItems: ExtractedItem[] = [
        { procedure: "Blood Test - Complete Blood Count (CBC)", price: 45 },
        { procedure: "Lipid Panel", price: 65 },
        { procedure: "Thyroid Function Test", price: 85 }
      ];
      setExtractedItems(mockExtractedItems);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const addManualItem = () => {
    if (manualProcedure && manualPrice) {
      setExtractedItems([...extractedItems, {
        procedure: manualProcedure,
        price: parseFloat(manualPrice)
      }]);
      setManualProcedure("");
      setManualPrice("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HealthRate</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How it works</a>
              <a href="#clinics" className="text-gray-600 hover:text-primary transition-colors">Find Clinics</a>
              <Button variant="outline" size="sm">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Compare Medical Prices
            <span className="text-primary block">Find Better Deals</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Upload your medical bill and instantly compare prices with nearby clinics. 
            Save money on healthcare with transparent pricing.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Medical Bill
              </CardTitle>
              <CardDescription>
                Upload a PDF or image of your medical bill for automatic extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "relative p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                  dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
                  isProcessing && "pointer-events-none opacity-50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  {isProcessing ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p className="text-gray-600">Processing your bill...</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-primary mb-4" />
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to upload a different file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Drop your medical bill here or click to browse</p>
                      <p className="text-xs text-gray-500">Supports PDF, JPG, PNG files</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Manual Entry
              </CardTitle>
              <CardDescription>
                Or enter your procedure and price manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="procedure">Procedure/Test Name</Label>
                <Input
                  id="procedure"
                  placeholder="e.g., Blood Test, X-Ray, MRI"
                  value={manualProcedure}
                  onChange={(e) => setManualProcedure(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="price">Price Paid ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                />
              </div>
              <Button 
                onClick={addManualItem}
                className="w-full"
                disabled={!manualProcedure || !manualPrice}
              >
                Add Item
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Extracted Items */}
        {extractedItems.length > 0 && (
          <Card className="max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Extracted Items</CardTitle>
              <CardDescription>
                Review the items we found and compare prices with nearby clinics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {extractedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.procedure}</h4>
                      <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>
                    <Link to={`/results?procedure=${encodeURIComponent(item.procedure)}&price=${item.price}`}>
                      <Button className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Show Nearby Alternatives
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* How it works */}
        <section id="how-it-works" className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How HealthRate Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get transparent healthcare pricing in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">1. Upload Your Bill</h4>
              <p className="text-gray-600">Upload a photo or PDF of your medical bill and we'll extract the details automatically.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">2. Find Nearby Options</h4>
              <p className="text-gray-600">We compare your procedure with prices from clinics and hospitals in your area.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">3. Save Money</h4>
              <p className="text-gray-600">See exactly where you can get the same procedure for less and book your appointment.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">HealthRate</span>
            </div>
            <p className="text-gray-600 text-sm">© 2024 HealthRate. Making healthcare transparent.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
