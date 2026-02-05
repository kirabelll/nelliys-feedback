-- Run this SQL in your Supabase SQL Editor to create the registrations table

CREATE TABLE IF NOT EXISTS registrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "officePhone" TEXT,
    email TEXT UNIQUE NOT NULL,
    website TEXT,
    "officeAddress" TEXT NOT NULL,
    country TEXT NOT NULL,
    industry TEXT NOT NULL,
    "sourceEvent" TEXT NOT NULL,
    "followUpDate" TEXT,
    "followUp" BOOLEAN DEFAULT false NOT NULL,
    comment TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS registrations_email_idx ON registrations(email);

-- Create an index on createdAt for faster sorting
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations("createdAt");

-- Create a trigger to automatically update the updatedAt field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();