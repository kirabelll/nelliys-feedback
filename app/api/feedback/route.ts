import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const feedbackSchema = z.object({
  // User Information (optional)
  userName: z.string().optional(),
  userEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  userRole: z.string().optional(),
  
  // Feedback Context
  pageUrl: z.string().optional(),
  componentName: z.string().optional(),
  deviceType: z.enum(["DESKTOP", "MOBILE", "TABLET"]).optional(),
  browserInfo: z.string().optional(),
  screenResolution: z.string().optional(),
  
  // Feedback Content (optional)
  feedbackType: z.enum([
    "BUG", "FEATURE_REQUEST", "IMPROVEMENT", "COMPLIMENT", 
    "QUESTION", "ACCESSIBILITY", "PERFORMANCE", "DESIGN", "USABILITY", "OTHER"
  ]).optional(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).optional(),
  title: z.string().max(100, "Title must be at most 100 characters").optional(),
  description: z.string().max(1000, "Description must be at most 1000 characters").optional(),
  stepsToReproduce: z.string().optional(),
  expectedBehavior: z.string().optional(),
  actualBehavior: z.string().optional(),
  
  // Ratings (1-5 scale)
  usabilityRating: z.number().min(1).max(5).optional(),
  designRating: z.number().min(1).max(5).optional(),
  performanceRating: z.number().min(1).max(5).optional(),
  overallRating: z.number().min(1).max(5).optional(),
  
  // Additional Context
  tags: z.array(z.string()).optional(),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).optional(),
});

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
  followUpRequested: z.boolean().default(false),
  preferredContactMethod: z.string().optional(),
  preferredContactOther: z.string().optional(),
});

// Retry function for database operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // If it's a connection error and we have retries left, wait and retry
      if (attempt < maxRetries && (
        lastError.message.includes("Can't reach database server") ||
        lastError.message.includes("Connection terminated") ||
        lastError.message.includes("Connection refused")
      )) {
        console.log(`Database connection attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }
      
      throw lastError;
    }
  }
  
  throw lastError!;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Detect which type of feedback this is based on the presence of service-specific fields
    const isServiceFeedback = 'serviceDate' in body && 'easeOfOrdering' in body;
    
    if (isServiceFeedback) {
      // Handle service feedback
      const validatedData = serviceFeedbackSchema.parse(body);
      
      const serviceFeedback = await withRetry(() =>
        prisma.serviceFeedback.create({
          data: {
            customerName: validatedData.customerName || null,
            companyName: validatedData.companyName || null,
            contactInfo: validatedData.contactInfo || null,
            serviceDate: validatedData.serviceDate,
            serviceType: validatedData.serviceType,
            serviceTypeOther: validatedData.serviceTypeOther || null,
            easeOfOrdering: validatedData.easeOfOrdering,
            orderProcessingAccuracy: validatedData.orderProcessingAccuracy,
            orderChannelKnowledge: validatedData.orderChannelKnowledge,
            serviceTimeliness: validatedData.serviceTimeliness,
            orderAccuracy: validatedData.orderAccuracy,
            productQuality: validatedData.productQuality,
            quantityAccuracy: validatedData.quantityAccuracy,
            staffProfessionalism: validatedData.staffProfessionalism,
            responsiveness: validatedData.responsiveness,
            overallSatisfaction: validatedData.overallSatisfaction,
            priceCompetitiveness: validatedData.priceCompetitiveness,
            stockAvailability: validatedData.stockAvailability,
            technicalInstruction: validatedData.technicalInstruction,
            mostLiked: validatedData.mostLiked || null,
            overallExperience: validatedData.overallExperience || null,
            expectationsMet: validatedData.expectationsMet || null,
            improvementAreas: validatedData.improvementAreas || null,
            issuesExperienced: validatedData.issuesExperienced || null,
            wouldRecommend: validatedData.wouldRecommend || null,
            additionalServices: validatedData.additionalServices || null,
            futureExpectations: validatedData.futureExpectations || null,
            serviceQualityRecommendations: validatedData.serviceQualityRecommendations || null,
            followUpRequested: validatedData.followUpRequested,
            preferredContactMethod: validatedData.preferredContactMethod || null,
            preferredContactOther: validatedData.preferredContactOther || null,
          },
        })
      );
      
      return NextResponse.json(
        { 
          message: 'Service feedback submitted successfully',
          id: serviceFeedback.id 
        },
        { status: 201 }
      );
    } else {
      // Handle UI feedback
      const validatedData = feedbackSchema.parse(body);
      
      const feedback = await withRetry(() =>
        prisma.uIFeedback.create({
          data: {
            userName: validatedData.userName || null,
            userEmail: validatedData.userEmail || null,
            userRole: validatedData.userRole || null,
            pageUrl: validatedData.pageUrl || null,
            componentName: validatedData.componentName || null,
            browserInfo: validatedData.browserInfo || null,
            deviceType: validatedData.deviceType || null,
            screenResolution: validatedData.screenResolution || null,
            feedbackType: validatedData.feedbackType || "OTHER",
            severity: validatedData.severity || null,
            title: validatedData.title || "Untitled Feedback",
            description: validatedData.description || "",
            stepsToReproduce: validatedData.stepsToReproduce || null,
            expectedBehavior: validatedData.expectedBehavior || null,
            actualBehavior: validatedData.actualBehavior || null,
            usabilityRating: validatedData.usabilityRating || null,
            designRating: validatedData.designRating || null,
            performanceRating: validatedData.performanceRating || null,
            overallRating: validatedData.overallRating || null,
            tags: validatedData.tags || [],
            priority: validatedData.priority || null,
          },
        })
      );
      
      return NextResponse.json(
        { 
          message: 'Feedback submitted successfully',
          id: feedback.id 
        },
        { status: 201 }
      );
    }
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.issues 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [uiFeedback, serviceFeedback] = await Promise.all([
      withRetry(() =>
        prisma.uIFeedback.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            responses: true,
            votes: true,
          },
        })
      ),
      withRetry(() =>
        prisma.serviceFeedback.findMany({
          orderBy: { createdAt: 'desc' },
        })
      )
    ]);
    
    return NextResponse.json({
      uiFeedback,
      serviceFeedback,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}