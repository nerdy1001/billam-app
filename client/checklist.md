*** BILLAM AUTHENTICATION MODULE ***

=== PART 1 ===

<!-- - Install Better Auth `npm install better-auth`  -->
<!-- - Create `.env` and set environment variables -->
<!-- - Transfer environment variables from backend `.env` file to client -->
<!-- - Create `lib/auth.ts` -->
<!-- - Setup `mongoDB` database on the client using backend config -->
<!-- - Install prisma `npm install prisma --save-dev` -->
<!-- - Initialize prisma `npx prisma init` -->
<!-- - Copy paste database schema from backend prisma file -->
<!-- - Add `generated` folder to `.gitignore` -->
<!-- - Adjust **scripts** in `package.json` -->

- Create single Prisma Client in `lib/prisma.ts`
- Setup prisma adapter with better-auth
- Generate auth tables `npx @better-auth/cli generate --output-auth.schema.prisma`
- Create mount handler in `app/api/auth/[...all]/route.ts`
- Create client instance in `lib/auth-client.ts`