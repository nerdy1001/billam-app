// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "@better-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const auth = betterAuth({
//   adapter: prismaAdapter(prisma),

//   session: {
//     strategy: "database",
//     cookie: {
//       name: "billam_session",
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//     },
//   },

//   emailAndPassword: {
//     enabled: true,
//   },

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     },
//   },
// });
