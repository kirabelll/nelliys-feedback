"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const feedbackSchema = z.object({
  // Ratings (1-5 scale) - all required for feedback
  overallRating: z.number().min(1).max(5),
  contentQualityRating: z.number().min(1).max(5),
  speakerRating: z.number().min(1).max(5),
  venueRating: z.number().min(1).max(5),
  organizationRating: z.number().min(1).max(5),
  networkingRating: z.number().min(1).max(5),
  coffeeQualityRating: z.number().min(1).max(5),
  vendorRating: z.number().min(1).max(5),
  workshopRating: z.number().min(1).max(5),
  
  // Additional Comments (optional)
  additionalComments: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const feedbackTypeOptions = [
  { value: "OVERALL_EVENT", label: "🎪 Overall Event", description: "General feedback about the entire event" },
  { value: "VENUE", label: "🏢 Venue & Facilities", description: "Location, space, amenities" },
  { value: "SPEAKERS", label: "🎤 Speakers & Presentations", description: "Quality of speakers and content" },
  { value: "CONTENT", label: "📚 Content & Sessions", description: "Educational value and relevance" },
  { value: "NETWORKING", label: "🤝 Networking Opportunities", description: "Meeting other attendees and connections" },
  { value: "ORGANIZATION", label: "📋 Event Organization", description: "Planning, scheduling, coordination" },
  { value: "CATERING", label: "🍽️ Food & Beverages", description: "Meals, snacks, and refreshments" },
  { value: "TECHNOLOGY", label: "� Technology & AV", description: "Audio/visual, wifi, apps" },
  { value: "REGISTRATION", label: "📝 Registration Process", description: "Sign-up and check-in experience" },
  { value: "OTHER", label: "📝 Other", description: "Something else" },
];

const satisfactionOptions = [
  { value: "VERY_SATISFIED", label: "� Very Satisfied", description: "Exceeded expectations" },
  { value: "SATISFIED", label: "� Satisfied", description: "Met expectations" },
  { value: "NEUTRAL", label: "� Neutral", description: "Neither satisfied nor dissatisfied" },
  { value: "DISSATISFIED", label: "� Dissatisfied", description: "Below expectations" },
  { value: "VERY_DISSATISFIED", label: "� Very Dissatisfied", description: "Far below expectations" },
];

const attendanceTypeOptions = [
  { value: "IN_PERSON", label: "🏢 In-Person", description: "Attended physically at the venue" },
  { value: "VIRTUAL", label: "� Virtual", description: "Attended online/remotely" },
  { value: "HYBRID", label: "� Hybrid", description: "Mix of in-person and virtual" },
];

const recommendationOptions = [
  { value: "YES", label: "� Yes", description: "Definitely would recommend" },
  { value: "NO", label: "� No", description: "Would not recommend" },
  { value: "MAYBE", label: "🤔 Maybe", description: "Might recommend with improvements" },
];

const hearAboutEventOptions = [
  "Social Media",
  "Email Newsletter",
  "Coffee Industry Publication",
  "Coffee Roaster/Supplier",
  "Colleague in Coffee Industry",
  "Coffee Association/Organization",
  "Website",
  "Search Engine",
  "Previous Coffee Event",
  "Coffee Shop/Cafe",
  "Trade Partner",
  "Coffee Forum/Community",
  "Advertisement",
  "Word of Mouth",
  "Other"
];

export default function CoffeeEventRatingForm() {
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      overallRating: undefined,
      contentQualityRating: undefined,
      speakerRating: undefined,
      venueRating: undefined,
      organizationRating: undefined,
      networkingRating: undefined,
      coffeeQualityRating: undefined,
      vendorRating: undefined,
      workshopRating: undefined,
      additionalComments: "",
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      const feedbackData = {
        ...data,
        submissionDate: new Date().toISOString(),
      };

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit feedback");
      }

      form.reset();
      
      toast.success("Coffee event ratings submitted successfully!", {
        description: "Thank you for your feedback.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit ratings", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const RatingField = ({ name, label }: { name: keyof FeedbackFormData, label: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={field.value === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => field.onChange(rating)}
                  className="w-10 h-10"
                >
                  {rating}
                </Button>
              ))}
            </div>
          </FormControl>
          <FormDescription>
            Rate from 1 (poor) to 5 (excellent)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="w-full rounded-sm">
      <CardHeader>
        <CardTitle>Coffee Event Rating</CardTitle>
        <CardDescription>
          Please rate your coffee event experience on a scale of 1-5.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* All Rating Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RatingField name="overallRating" label="Overall Coffee Event" />
              <RatingField name="contentQualityRating" label="Coffee Education Quality" />
              <RatingField name="speakerRating" label="Coffee Experts & Presentations" />
              <RatingField name="venueRating" label="Venue & Facilities" />
              <RatingField name="organizationRating" label="Event Organization" />
              <RatingField name="networkingRating" label="Coffee Community Networking" />
              <RatingField name="coffeeQualityRating" label="Coffee Quality & Variety" />
              <RatingField name="vendorRating" label="Coffee Vendors & Exhibitors" />
              <RatingField name="workshopRating" label="Coffee Workshops & Demos" />
            </div>

            {/* Additional Comments */}
            <FormField
              control={form.control}
              name="additionalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional feedback about the coffee event..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full rounded-md" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit Coffee Event Ratings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
