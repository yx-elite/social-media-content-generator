# SocialSpark - AI Social Media Content Generator

SocialSpark is a modern web application that helps users generate engaging social media content using AI. Built with Next.js 15, TypeScript, and integrated with various powerful tools and services.

## 🚀 Features

- AI-powered content generation
- User authentication with Clerk
- Responsive design with Tailwind CSS
- Dark mode support
- Database integration with Drizzle ORM
- Subscription management

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Authentication:** Clerk
- **Database:** PostgreSQL (with Drizzle ORM)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide Icons

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/social-media-content-generator.git
cd social-media-content-generator
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Database
DATABASE_URL=your_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Initialize the database:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## 🔒 Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL database connection URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
