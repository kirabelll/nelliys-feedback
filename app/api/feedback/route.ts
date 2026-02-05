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
    
    // Validate the request body
    const validatedData = feedbackSchema.parse(body);
    
    // Create new feedback with retry
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
    const feedback = await withRetry(() =>
      prisma.uIFeedback.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          responses: true,
          votes: true,
        },
      })
    );
    
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}