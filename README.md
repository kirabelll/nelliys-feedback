# Nelliys Service Feedback System

A comprehensive customer feedback management system built with Next.js, designed specifically for fuel delivery and lubricant supply services. This application enables businesses to collect, analyze, and manage customer service feedback efficiently.

## Developer Profile

**ERP Developer | Frappe & Odoo Specialist**

Experienced ERP developer with deep expertise in Frappe Framework and Odoo customization. Specialized in building scalable business solutions, custom modules, and seamless integrations. Proficient in Python, JavaScript, and modern web technologies. Passionate about optimizing business processes through innovative ERP implementations.

## 🚀 Features

### Customer Feedback Collection
- **Comprehensive Service Feedback Form**: Structured feedback collection covering all aspects of service delivery
- **Multi-Service Support**: Handles feedback for fuel delivery, lubricant supply, technical support, and custom services
- **Rating System**: 1-5 star ratings for 13 different service quality metrics
- **Open-Ended Questions**: Detailed feedback collection for qualitative insights
- **Follow-up Management**: Optional customer follow-up requests with preferred contact methods

### Admin Dashboard
- **Real-time Feedback Monitoring**: View all submitted feedback in an organized dashboard
- **Advanced Filtering**: Filter by service type, satisfaction rating, follow-up status, and date ranges
- **Visual Rating Display**: Star-based rating visualization for quick assessment
- **Responsive Design**: Mobile-friendly interface for on-the-go management
- **Export Capabilities**: Easy data export for further analysis

### Technical Features
- **Modern Tech Stack**: Built with Next.js 16, TypeScript, and Tailwind CSS
- **Database Integration**: PostgreSQL with Prisma ORM for reliable data management
- **Form Validation**: Comprehensive client and server-side validation using Zod
- **Dark Mode Support**: Built-in theme switching capabilities
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL (Neon/Supabase compatible)
- **ORM**: Prisma
- **Validation**: Zod
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Service Quality Metrics

The system evaluates services across 13 key performance indicators:

1. **Ease of placing an order**
2. **Order processing accuracy**
3. **Order channel knowledge**
4. **Timeliness of service delivery**
5. **Accuracy of order fulfillment**
6. **Quality of products received**
7. **Delivered quantities vs invoiced quantities**
8. **Professionalism and courtesy of staff**
9. **Responsiveness to inquiries**
10. **Overall satisfaction**
11. **Price competitiveness**
12. **Stock availability**
13. **Technical instruction quality**

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nelliys-feedback
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma generate
   
   # Push schema to database
   pnpm prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Customers
1. Visit the main page
2. Fill out the comprehensive service feedback form
3. Rate your experience across multiple service dimensions
4. Provide detailed comments and suggestions
5. Optionally request follow-up contact

### For Administrators
1. Navigate to `/admin` to access the dashboard
2. View all submitted feedback with filtering options
3. Analyze service performance through visual ratings
4. Export data for reporting and analysis
5. Manage follow-up requests

## 🗂️ Project Structure

```
nelliys-feedback/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/               # API routes
│   │   ├── feedback/      # Feedback management
│   │   └── registration/  # Registration handling
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main feedback form
├── components/
│   ├── ui/               # Reusable UI components
│   └── service-feedback-form.tsx
├── lib/
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 🔧 API Endpoints

- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback` - Retrieve all feedback (admin)
- `POST /api/registration` - Handle registration data
- `GET /api/registration` - Retrieve registration data

## 🎨 Customization

### Adding New Service Types
1. Update `serviceTypeOptions` in the feedback form component
2. Modify the database schema if needed
3. Update admin dashboard filters

### Modifying Rating Criteria
1. Update the form schema in `components/service-feedback-form.tsx`
2. Modify the Prisma schema in `prisma/schema.prisma`
3. Update the admin dashboard display logic

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `pnpm build`
2. Start the production server: `pnpm start`

## 📊 Database Schema

The system uses two main models:
- **ServiceFeedback**: Stores comprehensive service feedback data
- **Registration**: Handles customer registration information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with comprehensive feedback system
- **v1.1.0** - Added admin dashboard and filtering capabilities
- **v1.2.0** - Enhanced mobile responsiveness and UI improvements

---

Built with ❤️ for better customer service management
