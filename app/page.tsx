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
import Header from "./header";
import UIFeedbackForm from "@/components/ui-feedback-form";
import ServiceFeedbackForm from "@/components/service-feedback-form";

const formSchema = z.object({
  comment: z
    .string()
    .max(500, "Comment must be at most 500 characters")
    .optional(),
});

type FormData = z.infer<typeof formSchema>;


export default function Home() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          // Handle validation errors from the server
          result.details.forEach((error: any) => {
            form.setError(error.path[0] as keyof FormData, {
              type: "manual",
              message: error.message,
            });
          });
        }
        
        throw new Error(result.error || "Registration failed");
      }

      // Reset form after successful submission
      form.reset();
      
      toast.success("Feedback submitted!", {
        description: "Thank you for your feedback.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Registration Form */}
          {/* <Card className="w-full max-w-2xl mx-auto rounded-sm">
            <CardHeader>
              <CardTitle>Quick Feedback</CardTitle>
              <CardDescription>
                  Share your thoughts or comments with us.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Feedback</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional comments or feedback..."
                            className="resize-none rounded-md w-xl"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full rounded-md" 
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card> */}

          {/* Service Feedback Form */}
          <div className="w-full">
            <ServiceFeedbackForm />
          </div>
        </div>
      </div>
    </div>
  );
}
