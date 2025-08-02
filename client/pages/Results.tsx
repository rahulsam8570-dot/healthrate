import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Phone, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

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
}

export default function Results() {
  const [searchParams] = useSearchParams();
  const procedure = searchParams.get('procedure') || '';
  const userPrice = parseFloat(searchParams.get('price') || '0');
  
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price');
  const [loading, setLoading] = useState(true);

  // Mock clinic data - in real app, this would come from backend API
  const mockClinics: Clinic[] = [
    {
      id: '1',
      name: 'City Medical Center',
      price: 35,
      rating: 4.8,
      reviewSnippet: 'Excellent service and very professional staff. Quick results.',
      distance: 1.2,
      address: '123 Medical Dr, Downtown',
      phone: '(555) 123-4567',
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: '2',
      name: 'QuickCare Clinic',
      price: 28,
      rating: 4.5,
      reviewSnippet: 'Fast and affordable. Great for routine procedures.',
      distance: 2.5,
      address: '456 Health St, Midtown',
      phone: '(555) 234-5678',
      lat: 40.7589,
      lng: -73.9851
    },
    {
      id: '3',
      name: 'Premier Diagnostics',
      price: 52,
      rating: 4.9,
      reviewSnippet: 'Top-notch equipment and highly experienced technicians.',
      distance: 0.8,
      address: '789 Care Ave, Uptown',
      phone: '(555) 345-6789',
      lat: 40.7831,
      lng: -73.9712
    },
    {
      id: '4',
      name: 'Community Health Hub',
      price: 30,
      rating: 4.3,
      reviewSnippet: 'Good value and friendly staff. Convenient location.',
      distance: 3.1,
      address: '321 Wellness Blvd, Suburbs',
      phone: '(555) 456-7890',
      lat: 40.6892,
      lng: -74.0445
    },
    {
      id: '5',
      name: 'Advanced Medical Group',
      price: 48,
      rating: 4.7,
      reviewSnippet: 'Modern facility with state-of-the-art technology.',
      distance: 1.9,
      address: '654 Innovation Way, Tech District',
      phone: '(555) 567-8901',
      lat: 40.7282,
      lng: -73.9942
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClinics(mockClinics);
      setLoading(false);
    }, 800);
  }, []);

  const sortedClinics = [...clinics].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      default:
        return 0;
    }
  });

  const averagePrice = clinics.reduce((sum, clinic) => sum + clinic.price, 0) / clinics.length;
  const savings = userPrice - averagePrice;
  const bestPrice = Math.min(...clinics.map(c => c.price));
  const potentialSavings = userPrice - bestPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">HealthRate</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Price Comparison Results</h2>
          <p className="text-gray-600 mb-4">Showing prices for: <span className="font-semibold">{procedure}</span></p>
          
          {/* Price Analysis Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">You Paid</p>
                    <p className="text-2xl font-bold text-gray-900">${userPrice.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Price</p>
                    <p className="text-2xl font-bold text-gray-900">${averagePrice.toFixed(2)}</p>
                    {savings > 0 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm">You saved ${savings.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">You overpaid by ${Math.abs(savings).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Best Price Found</p>
                    <p className="text-2xl font-bold text-primary">${bestPrice.toFixed(2)}</p>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingDown className="w-4 h-4" />
                      <span className="text-sm">Save up to ${potentialSavings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: 'price' | 'rating' | 'distance') => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                <SelectItem value="distance">Distance (Nearest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Finding nearby clinics...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedClinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    {/* Clinic Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{clinic.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(clinic.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({clinic.rating})</span>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {clinic.distance} mi
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">"{clinic.reviewSnippet}"</p>
                      <p className="text-gray-500 text-sm">{clinic.address}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">${clinic.price}</p>
                      {clinic.price < userPrice && (
                        <p className="text-green-600 text-sm font-medium">
                          Save ${(userPrice - clinic.price).toFixed(2)}
                        </p>
                      )}
                      {clinic.price > userPrice && (
                        <p className="text-red-600 text-sm">
                          ${(clinic.price - userPrice).toFixed(2)} more
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button className="w-full">
                        Book Now
                      </Button>
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {clinic.phone}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Map Placeholder */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Clinic Locations</CardTitle>
            <CardDescription>Interactive map showing clinic locations near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">Integration with Google Maps API</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
