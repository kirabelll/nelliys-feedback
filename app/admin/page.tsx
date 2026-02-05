"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Header from "../header";

interface Registration {
  id: string;
  name: string;
  companyName: string;
  jobTitle: string;
  mobileNumber: string;
  officePhone?: string;
  email: string;
  website?: string;
  officeAddress: string;
  country: string;
  industry: string;
  sourceEvent: string;
  followUpDate?: string;
  followUp: boolean;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  search: string;
  industry: string;
  country: string;
  followUp: string;
  dateFrom: string;
  dateTo: string;
  sourceEvent: string;
}

const industryOptions = [
  "Agriculture & Farming",
  "Automotive",
  "Banking & Finance",
  "Construction & Real Estate",
  "Coffee Import And Export",
  "Consulting Import",
  "Education",
  "Energy & Utilities",
  "Food & Beverage",
  "Government & Public Sector",
  "Healthcare & Medical",
  "Hospitality & Tourism",
  "Information Technology",
  "Insurance",
  "Legal Services",
  "Manufacturing",
  "Media & Entertainment",
  "Non-Profit Organization",
  "Pharmaceutical",
  "Retail & E-commerce",
  "Telecommunications",
  "Transportation & Logistics",
  "Other"
];

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    search: "",
    industry: "",
    country: "",
    followUp: "",
    dateFrom: "",
    dateTo: "",
    sourceEvent: "",
  });

  // Get unique values for filter options
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);
  const [uniqueSourceEvents, setUniqueSourceEvents] = useState<string[]>([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registrations, filters]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registration");
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
      const data = await response.json();
      setRegistrations(data);
      
      // Extract unique values for filters
      const countries = [...new Set(data.map((reg: Registration) => reg.country))].sort() as string[];
      const sources = [...new Set(data.map((reg: Registration) => reg.sourceEvent))].sort() as string[];
      setUniqueCountries(countries);
      setUniqueSourceEvents(sources);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...registrations];

    // Search filter (name, email, company)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(reg => 
        reg.name.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower) ||
        reg.companyName.toLowerCase().includes(searchLower) ||
        reg.jobTitle.toLowerCase().includes(searchLower)
      );
    }

    // Industry filter
    if (filters.industry && filters.industry !== "all") {
      filtered = filtered.filter(reg => reg.industry === filters.industry);
    }

    // Country filter
    if (filters.country && filters.country !== "all") {
      filtered = filtered.filter(reg => reg.country === filters.country);
    }

    // Follow-up filter
    if (filters.followUp && filters.followUp !== "all") {
      const followUpValue = filters.followUp === "true";
      filtered = filtered.filter(reg => reg.followUp === followUpValue);
    }

    // Source/Event filter
    if (filters.sourceEvent && filters.sourceEvent !== "all") {
      filtered = filtered.filter(reg => reg.sourceEvent === filters.sourceEvent);
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(reg => new Date(reg.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(reg => new Date(reg.createdAt) <= toDate);
    }

    setFilteredRegistrations(filtered);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      industry: "",
      country: "",
      followUp: "",
      dateFrom: "",
      dateTo: "",
      sourceEvent: "",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading registrations...</div>
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
              <Button onClick={fetchRegistrations} className="mt-4">
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
                placeholder="Search by name, email, company..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Industry Filter */}
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={filters.industry || "all"} onValueChange={(value) => handleFilterChange("industry", value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country Filter */}
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={filters.country || "all"} onValueChange={(value) => handleFilterChange("country", value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source/Event Filter */}
            <div className="space-y-2">
              <Label>Source/Event</Label>
              <Select value={filters.sourceEvent || "all"} onValueChange={(value) => handleFilterChange("sourceEvent", value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSourceEvents.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
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
              <Label>Registration Date</Label>
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
                  <h1 className="text-3xl font-bold">Registration Admin</h1>
                  <p className="text-muted-foreground">
                    Showing {filteredRegistrations.length} of {registrations.length} registrations
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
              {filteredRegistrations.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      {hasActiveFilters ? "No registrations match your filters." : "No registrations found."}
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters} variant="outline" className="mt-2">
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredRegistrations.map((registration) => (
                  <Card key={registration.id} className="w-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{registration.name}</CardTitle>
                          <CardDescription>
                            {registration.jobTitle} at {registration.companyName}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {registration.followUp && (
                            <Badge variant="secondary">Follow-up Requested</Badge>
                          )}
                          <Badge variant="outline">
                            {formatDate(registration.createdAt)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground">Contact</h4>
                          <p className="text-sm">{registration.email}</p>
                          <p className="text-sm">{registration.mobileNumber}</p>
                          {registration.officePhone && (
                            <p className="text-sm">Office: {registration.officePhone}</p>
                          )}
                          {registration.website && (
                            <p className="text-sm">
                              <a 
                                href={registration.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {registration.website}
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground">Company Info</h4>
                          <p className="text-sm">Industry: {registration.industry}</p>
                          <p className="text-sm">Country: {registration.country}</p>
                          <p className="text-sm">Source: {registration.sourceEvent}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground">Address</h4>
                          <p className="text-sm">{registration.officeAddress}</p>
                          {registration.followUpDate && (
                            <p className="text-sm mt-2">
                              <span className="font-medium">Follow-up Date:</span> {registration.followUpDate}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {registration.comment && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Comments</h4>
                          <p className="text-sm bg-muted p-3 rounded-md">{registration.comment}</p>
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