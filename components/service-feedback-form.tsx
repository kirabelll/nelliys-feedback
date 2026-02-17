"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const serviceFeedbackSchema = z.object({
  // Section 1: Customer Information
  customerName: z.string().optional(),
  companyName: z.string().optional(),
  contactInfo: z.string().optional(),
  serviceDate: z.string().min(1, "Service date is required"),
  serviceType: z.array(z.string()).min(1, "Please select at least one service type"),
  serviceTypeOther: z.string().optional(),

  // Section 2: Service Quality Ratings (1-5 scale)
  easeOfOrdering: z.number().min(1).max(5),
  orderProcessingAccuracy: z.number().min(1).max(5),
  orderChannelKnowledge: z.number().min(1).max(5),
  serviceTimeliness: z.number().min(1).max(5),
  orderAccuracy: z.number().min(1).max(5),
  productQuality: z.number().min(1).max(5),
  quantityAccuracy: z.number().min(1).max(5),
  staffProfessionalism: z.number().min(1).max(5),
  responsiveness: z.number().min(1).max(5),
  overallSatisfaction: z.number().min(1).max(5),
  priceCompetitiveness: z.number().min(1).max(5),
  stockAvailability: z.number().min(1).max(5),
  technicalInstruction: z.number().min(1).max(5),

  // Section 3: Open-Ended Questions
  mostLiked: z.string().optional(),
  overallExperience: z.string().optional(),
  expectationsMet: z.string().optional(),
  improvementAreas: z.string().optional(),
  issuesExperienced: z.string().optional(),
  wouldRecommend: z.string().optional(),

  // Section 4: Future Expectations
  additionalServices: z.string().optional(),
  futureExpectations: z.string().optional(),
  serviceQualityRecommendations: z.string().optional(),

  // Section 5: Follow-Up
  followUpRequested: z.boolean(),
  preferredContactMethod: z.string().optional(),
  preferredContactOther: z.string().optional(),
});

type ServiceFeedbackFormData = z.infer<typeof serviceFeedbackSchema>;

const serviceTypeOptions = [
  { id: "fuel-delivery", label: "Fuel Delivery" },
  { id: "lubricant-supply", label: "Lubricant Supply" },
  { id: "technical-support", label: "Technical Support" },
  { id: "other", label: "Other" },
];

const contactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "other", label: "Other" },
];

export default function ServiceFeedbackForm() {
  const form = useForm<ServiceFeedbackFormData>({
    resolver: zodResolver(serviceFeedbackSchema),
    defaultValues: {
      customerName: "",
      companyName: "",
      contactInfo: "",
      serviceDate: "",
      serviceType: [],
      serviceTypeOther: "",
      easeOfOrdering: undefined,
      orderProcessingAccuracy: undefined,
      orderChannelKnowledge: undefined,
      serviceTimeliness: undefined,
      orderAccuracy: undefined,
      productQuality: undefined,
      quantityAccuracy: undefined,
      staffProfessionalism: undefined,
      responsiveness: undefined,
      overallSatisfaction: undefined,
      priceCompetitiveness: undefined,
      stockAvailability: undefined,
      technicalInstruction: undefined,
      mostLiked: "",
      overallExperience: "",
      expectationsMet: "",
      improvementAreas: "",
      issuesExperienced: "",
      wouldRecommend: "",
      additionalServices: "",
      futureExpectations: "",
      serviceQualityRecommendations: "",
      followUpRequested: false,
      preferredContactMethod: "",
      preferredContactOther: "",
    },
  });

  const onSubmit = async (data: ServiceFeedbackFormData) => {
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
        throw new Error(result?.error || "Failed to submit feedback");
      }

      form.reset();
      
      toast.success("Service feedback submitted successfully!", {
        description: "Thank you for your valuable feedback.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit feedback", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const RatingField = ({ 
    name, 
    label 
  }: { 
    name: keyof ServiceFeedbackFormData, 
    label: string 
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
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
          <FormDescription className="text-xs">
            Rate from 1 (poor) to 5 (excellent)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Service Feedback Form</CardTitle>
        <CardDescription>
          Please provide your feedback about our fuel delivery and lubricant supply services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Section 1: Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Email or phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Service Interaction *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceType"
                render={() => (
                  <FormItem>
                    <FormLabel>Type of Service Used *</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceTypeOptions.map((service) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="serviceType"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, service.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {service.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceTypeOther"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Service (if selected above)</FormLabel>
                    <FormControl>
                      <Input placeholder="Please specify" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 2: Service Quality Ratings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Section 2: Service Quality Ratings</h3>
              <p className="text-sm text-muted-foreground">
                Rate the following aspects of our service on a scale of 1 to 5:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RatingField name="easeOfOrdering" label="Ease of placing an order" />
                <RatingField name="orderProcessingAccuracy" label="Processes orders accurately" />
                <RatingField name="orderChannelKnowledge" label="The channel for placing orders is known" />
                <RatingField name="serviceTimeliness" label="Timeliness of service delivery" />
                <RatingField name="orderAccuracy" label="Accuracy of order fulfillment (products/services delivered as requested)" />
                <RatingField name="productQuality" label="Quality of products received" />
                <RatingField name="quantityAccuracy" label="Delivered quantities are same as invoiced quantities" />
                <RatingField name="staffProfessionalism" label="Professionalism and courtesy of staff" />
                <RatingField name="responsiveness" label="Responsiveness to inquiries and concerns" />
                <RatingField name="overallSatisfaction" label="Overall satisfaction with our service" />
                <RatingField name="priceCompetitiveness" label="Price of products compared to suppliers" />
                <RatingField name="stockAvailability" label="Stock availability for your purchase request" />
                <RatingField name="technicalInstruction" label="Technical instruction given from our company" />
              </div>
            </div>

            {/* Section 3: Open-Ended Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Section 3: Open-Ended Questions</h3>
              
              <FormField
                control={form.control}
                name="mostLiked"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What did you like the most about our service?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please share what you liked most..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overallExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How would you describe your overall experience with our company?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe your overall experience..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectationsMet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Did our product/service meet your expectations?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please let us know if we met your expectations..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="improvementAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What areas do you think need improvement?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please suggest areas for improvement..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuesExperienced"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Have you experienced any issues with our services? If yes, please describe them.</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe any issues you experienced..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wouldRecommend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Would you recommend our services to others? Why or why not?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please let us know if you would recommend us..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 4: Future Expectations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Section 4: Future Expectations</h3>
              
              <FormField
                control={form.control}
                name="additionalServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What additional services or products would you like us to provide?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please suggest additional services or products..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="futureExpectations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How can we better meet your expectations in the future?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please share how we can better serve you..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceQualityRecommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you recommend to increase the service quality?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide recommendations for service quality improvement..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 5: Follow-Up */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Section 5: Follow-Up (Optional)</h3>
              
              <FormField
                control={form.control}
                name="followUpRequested"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Would you like us to follow up regarding your feedback?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredContactMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred contact method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactMethodOptions.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredContactOther"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other contact method (if selected above)</FormLabel>
                    <FormControl>
                      <Input placeholder="Please specify" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}