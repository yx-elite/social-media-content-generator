=== PART 1: Project Setup ===

- [x] Create Next.js project with CLI
- [x] Remove unused boilerplate files
- [x] Install shadcn/ui

=== PART 2: Database Setup ===

- [x] Install Drizzle ORM & Drizzle Kit
- [x] Create `drizzle.config.ts`
- [x] Create Drizzle schema
- [x] Add `DATABASE_URL` to `.env`
- [x] Add database command to package.json
- [x] Push schema to database

=== PART 3: Authentication Setup ===

- [x] Install Clerk & Clerk Themes
- [x] Add Clerk Keys to `.env.local`
- [x] Create `middleware.ts`
- [x] Add Clerk Provider & themes to `app/layout.tsx`
- [x] Create sign in & sign up pages
- [x] Configure private routes at `middleware.ts`
- [x] Edit dark theme & font in `app/layout.tsx`
- [x] Create Responsive Navbar component
- [x] Add Clerk components to Navbar

=== PART 4: CLERK & DATABASE SYNC ===

- [x] Setup Ngrok `ngrok http 3000`
- [x] Setup Clerk webhook endpoint
- [x] Add Clerkwebhook/signing secret to `.env.local`
- [x] Set webhook route as public in `middleware.ts`
- [x] Install Svix
- [x] Create the webhook endpoint
- [x] Get type inference for webhook events
- [x] Test the webhook
- [x] Create `index.ts` to export db instance
- [x] Create action to save user to database
- [x] Implement the action in webhook endpoint
- [x] Test the webhook with database

=== PART 5: Email Setup ===

- [x] Create `mailtest.mjs` for testing
- [x] Use default domain for demo
- [x] Install Mailtrap
- [x] Add `MAILTRAP_TOKEN` to `.env.local`
- [x] Create functions in `utils/mailtrap.ts`
- [x] Integrate in action after user creation
- [x] Test user creation with PERSONAL email
- [x] Create landing page

=== PART 6: Pricing & Subscriptions ===

- [x] Create pricing page
- [x] Install Stripe-js and Stripe
- [x] Add Stripe publishable key to `.env.local`
- [x] Add Stripe secret key to `.env.local`
- [x] Create product and get priceId from Stripe
- [x] Create Stripe checkout session
- [x] Create checkout session API route
- [x] Add `NEXT_PUBLIC_BASE_URL` to `.env.local`
- [x] Create Stripe webhook endpoint
- [x] Add Stripe webhook/signing secret to `.env.local`
- [x] Add points to user based on priceId
- [x] Create action to update subscription in database
- [x] Create action to update user points
- [x] Create subscriptions API route
- [x] Create action to fetch user subscription status
- [x] Display subscription status on pricing page
