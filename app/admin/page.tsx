"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterIcon, XIcon, Star } from "lucide-react";
import Link from "next/link";
import Header from "../header";

interface ServiceFeedback {
  id: string;
  customerName?: string;
  companyName?: string;
  contactInfo?: string;
  serviceDate: string;
  serviceType: string[];
  serviceTypeOther?: string;
  
  // Service Quality Ratings
  easeOfOrdering: number;
  orderProcessingAccuracy: number;
  orderChannelKnowledge: number;
  serviceTimeliness: number;
  orderAccuracy: number;
  productQuality: number;
  quantityAccuracy: number;
  staffProfessionalism: number;
  responsiveness: number;
  overallSatisfaction: number;
  priceCompetitiveness: number;
  stockAvailability: number;
  technicalInstruction: number;
  
  // Open-ended responses
  mostLiked?: string;
  overallExperience?: string;
  expectationsMet?: string;
  improvementAreas?: string;
  issuesExperienced?: string;
  wouldRecommend?: string;
  
  // Future expectations
  additionalServices?: string;
  futureExpectations?: string;
  serviceQualityRecommendations?: string;
  
  // Follow-up
  followUpRequested: boolean;
  preferredContactMethod?: string;
  preferredContactOther?: string;
  
  submissionDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  search: string;
  serviceType: string;
  followUp: string;
  dateFrom: string;
  dateTo: string;
  overallSatisfaction: string;
}

const serviceTypeOptions = [
  { value: "fuel-delivery", label: "Fuel Delivery" },
  { value: "lubricant-supply", label: "Lubricant Supply" },
  { value: "technical-support", label: "Technical Support" },
  { value: "other", label: "Other" }
];

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<ServiceFeedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<ServiceFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    search: "",
    serviceType: "",
    followUp: "",
    dateFrom: "",
    dateTo: "",
    overallSatisfaction: "",
  });

  // Get unique values for filter options
  const [uniqueServiceTypes, setUniqueServiceTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbacks, filters]);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedback");
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      
      // The feedback API returns an object with uiFeedback and serviceFeedback
      const feedbackData = data.serviceFeedback || [];
      setFeedbacks(feedbackData);
      
      // Extract unique values for filters
      const serviceTypes = [...new Set(feedbackData.flatMap((feedback: ServiceFeedback) => feedback.serviceType).filter(Boolean))].sort() as string[];
      setUniqueServiceTypes(serviceTypes);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(feedbacks)) {
      setFilteredFeedbacks([]);
      return;
    }
    
    let filtered = [...feedbacks];

    // Search filter (name, company, contact)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(feedback => 
        (feedback.customerName && feedback.customerName.toLowerCase().includes(searchLower)) ||
        (feedback.companyName && feedback.companyName.toLowerCase().includes(searchLower)) ||
        (feedback.contactInfo && feedback.contactInfo.toLowerCase().includes(searchLower))
      );
    }

    // Service Type filter
    if (filters.serviceType && filters.serviceType !== "all") {
      filtered = filtered.filter(feedback => feedback.serviceType.includes(filters.serviceType));
    }

    // Follow-up filter
    if (filters.followUp && filters.followUp !== "all") {
      const followUpValue = filters.followUp === "true";
      filtered = filtered.filter(feedback => feedback.followUpRequested === followUpValue);
    }

    // Overall Satisfaction filter
    if (filters.overallSatisfaction && filters.overallSatisfaction !== "all") {
      const satisfactionValue = parseInt(filters.overallSatisfaction);
      filtered = filtered.filter(feedback => feedback.overallSatisfaction === satisfactionValue);
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(feedback => new Date(feedback.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(feedback => new Date(feedback.createdAt) <= toDate);
    }

    setFilteredFeedbacks(filtered);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      serviceType: "",
      followUp: "",
      dateFrom: "",
      dateTo: "",
      overallSatisfaction: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading service feedback...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <div className="container mx-auto p-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button onClick={fetchFeedbacks} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-6 overflow-y-auto h-full">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, company, contact..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Service Type Filter */}
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={filters.serviceType || "all"} onValueChange={(value) => handleFilterChange("serviceType", value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Service Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Service Types</SelectItem>
                  {serviceTypeOptions.map((serviceType) => (
                    <SelectItem key={serviceType.value} value={serviceType.value}>
                      {serviceType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Overall Satisfaction Filter */}
            <div className="space-y-2">
              <Label>Overall Satisfaction</Label>
              <Select value={filters.overallSatisfaction || "all"} onValueChange={(value) => handleFilterChange("overallSatisfaction", value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Follow-up Filter */}
            <div className="space-y-2">
              <Label>Follow-up Requested</Label>
              <Select value={filters.followUp || "all"} onValueChange={(value) => handleFilterChange("followUp", value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <Label>Submission Date</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="dateFrom" className="text-sm text-muted-foreground">From</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo" className="text-sm text-muted-foreground">To</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">Service Feedback Admin</h1>
                  <p className="text-muted-foreground">
                    Showing {filteredFeedbacks.length} of {feedbacks.length} feedback submissions
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        Filtered
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline">Back to Form</Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {filteredFeedbacks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      {hasActiveFilters ? "No feedback matches your filters." : "No feedback found."}
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters} variant="outline" className="mt-2">
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <Card key={feedback.id} className="w-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {feedback.customerName || "Anonymous Customer"}
                          </CardTitle>
                          <CardDescription>
                            {feedback.companyName && `${feedback.companyName} • `}
                            Service Date: {feedback.serviceDate}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 flex-col items-end">
                          {feedback.followUpRequested && (
                            <Badge variant="secondary">Follow-up Requested</Badge>
                          )}
                          <Badge variant="outline">
                            {formatDate(feedback.createdAt)}
                          </Badge>
                          <div className="text-right">
                            {renderStars(feedback.overallSatisfaction)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Service Types */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Services Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {feedback.serviceType.map((type, index) => (
                            <Badge key={index} variant="outline">
                              {serviceTypeOptions.find(opt => opt.value === type)?.label || type}
                            </Badge>
                          ))}
                          {feedback.serviceTypeOther && (
                            <Badge variant="outline">{feedback.serviceTypeOther}</Badge>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      {feedback.contactInfo && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Contact</h4>
                          <p className="text-sm">{feedback.contactInfo}</p>
                        </div>
                      )}

                      {/* Service Ratings */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Service Ratings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span>Ease of Ordering:</span>
                            {renderStars(feedback.easeOfOrdering)}
                          </div>
                          <div className="flex justify-between">
                            <span>Order Accuracy:</span>
                            {renderStars(feedback.orderProcessingAccuracy)}
                          </div>
                          <div className="flex justify-between">
                            <span>Timeliness:</span>
                            {renderStars(feedback.serviceTimeliness)}
                          </div>
                          <div className="flex justify-between">
                            <span>Product Quality:</span>
                            {renderStars(feedback.productQuality)}
                          </div>
                          <div className="flex justify-between">
                            <span>Staff Professionalism:</span>
                            {renderStars(feedback.staffProfessionalism)}
                          </div>
                          <div className="flex justify-between">
                            <span>Responsiveness:</span>
                            {renderStars(feedback.responsiveness)}
                          </div>
                        </div>
                      </div>

                      {/* Feedback Comments */}
                      <div className="space-y-3">
                        {feedback.mostLiked && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">What they liked most:</h4>
                            <p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-md">{feedback.mostLiked}</p>
                          </div>
                        )}
                        
                        {feedback.improvementAreas && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Areas for improvement:</h4>
                            <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">{feedback.improvementAreas}</p>
                          </div>
                        )}
                        
                        {feedback.issuesExperienced && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Issues experienced:</h4>
                            <p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{feedback.issuesExperienced}</p>
                          </div>
                        )}
                        
                        {feedback.wouldRecommend && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Would recommend:</h4>
                            <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">{feedback.wouldRecommend}</p>
                          </div>
                        )}
                      </div>

                      {/* Follow-up Information */}
                      {feedback.followUpRequested && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Follow-up Details</h4>
                          <div className="text-sm">
                            <p><span className="font-medium">Preferred Contact:</span> {feedback.preferredContactMethod || "Not specified"}</p>
                            {feedback.preferredContactOther && (
                              <p><span className="font-medium">Other Contact Method:</span> {feedback.preferredContactOther}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}