const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Try to create the table if it doesn't exist
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
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
        "followUp" BOOLEAN DEFAULT false,
        comment TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('✅ Table created successfully');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();