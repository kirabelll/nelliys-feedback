import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const registrationSchema = z.object({
  name: z.string().max(50).optional(),
  companyName: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  mobileNumber: z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{3,15}$/).optional().or(z.literal("")),
  officePhone: z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{3,15}$/).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  officeAddress: z.string().max(200).optional(),
  country: z.string().max(50).optional(),
  industry: z.string().max(50).optional(),
  sourceEvent: z.string().max(100).optional(),
  followUpDate: z.string().optional().or(z.literal("")),
  followUp: z.boolean(),
  comment: z.string().max(500).optional(),
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
    const validatedData = registrationSchema.parse(body);
    
    // Check if email already exists with retry (only if email is provided)
    if (validatedData.email && validatedData.email !== "") {
      const existingRegistration = await withRetry(() =>
        prisma.registration.findUnique({
          where: { email: validatedData.email }
        })
      );
      
      if (existingRegistration) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }
    }
    
    // Create new registration with retry
    const registration = await withRetry(() =>
      prisma.registration.create({
        data: {
          name: validatedData.name || null,
          companyName: validatedData.companyName || null,
          jobTitle: validatedData.jobTitle || null,
          mobileNumber: validatedData.mobileNumber || null,
          officePhone: validatedData.officePhone || null,
          email: validatedData.email || null,
          website: validatedData.website || null,
          officeAddress: validatedData.officeAddress || null,
          country: validatedData.country || null,
          industry: validatedData.industry || null,
          sourceEvent: validatedData.sourceEvent || null,
          followUpDate: validatedData.followUpDate || null,
          followUp: validatedData.followUp,
          comment: validatedData.comment || null,
        },
      })
    );
    
    return NextResponse.json(
      { 
        message: 'Registration successful',
        id: registration.id 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    
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
    const registrations = await withRetry(() =>
      prisma.registration.findMany({
        orderBy: { createdAt: 'desc' },
      })
    );
    
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}