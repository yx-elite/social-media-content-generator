# SocialSpark - AI Social Media Content Generator

SocialSpark is a modern web application that helps users generate engaging social media content using AI. Built with Next.js 15, TypeScript, and integrated with various powerful tools and services.

## Features

- 🤖 AI-powered content generation for Twitter, Instagram, and LinkedIn
- 🔐 Secure authentication with Clerk
- 💳 Subscription management with Stripe
- 📧 Email notifications with Mailtrap
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Fully responsive design
- 🔄 Real-time content history
- 📊 Points-based usage system
- 🖼️ Image upload support for Instagram posts
- 📋 One-click content copying
- ✨ Markdown support for generated content

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Authentication:** Clerk
- **Payments:** Stripe
- **Database:** PostgreSQL (Neon DB)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide Icons & React Icons
- **Email Service:** Mailtrap
- **Webhook Handling:** Svix

## Getting Started

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
WEBHOOK_SECRET=your_clerk_webhook_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_BASE_URL=your_base_url

# Email
MAILTRAP_TOKEN=your_mailtrap_token
SENDER_EMAIL=your_sender_email

# VISIONARY API
VISIONARY_API_URL=https://open.xiaojingai.com
VISIONARY_API_KEY=your_visionary_api_key
```

4. Initialize the database:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Clerk](https://clerk.dev/) for authentication
- [Stripe](https://stripe.com/) for payment processing
- [Mailtrap](https://mailtrap.io/) for email testing
