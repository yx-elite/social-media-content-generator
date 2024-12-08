=== PART 1: Project Setup ===

[X] Create Next.js project with CLI
[X] Remove unused boilerplate files
[X] Install shadcn/ui


=== PART 2: Database Setup ===

[X] Install Drizzle ORM & Drizzle Kit
[X] Create `drizzle.config.ts`
[X] Create Drizzle schema
[X] Add `DATABASE_URL` to `.env.local`
[X] Add database command to package.json
[X] Push schema to database


=== PART 3: Authentication Setup ===

[X] Install Clerk & Clerk Themes
[X] Add Clerk Keys to `.env.local`
[X] Create `middleware.ts`
[X] Add Clerk Provider & themes to `app/layout.tsx`
[X] Create sign in & sign up pages
[X] Configure private routes at `middleware.ts`
[X] Edit dark theme & font in `app/layout.tsx`
[X] Create Responsive Navbar component
[X] Add Clerk components to Navbar


=== PART 4: CLERK & DATABASE SYNC ===

[X] Setup Ngrok `ngrok http 3000`
[X] Setup Clerk webhook endpoint
[X] Add webhook/signing secret to `.env.local`
[X] Set webhook route as public in `middleware.ts`
[X] Install Svix
[X] Create the webhook endpoint
[X] Get type inference for webhook events
[X] Test the webhook
[X] Create `index.ts` to export db instance
[X] Create action to save user to database
[X] Implement the action in webhook endpoint
[X] Test the webhook with database
