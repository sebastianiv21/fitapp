import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.AUTH_DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // enable in production
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // refresh if older than 1 day
  },

  plugins: [
    jwt({
      jwt: {
        // Define custom payload for JWT tokens
        definePayload: async (session) => ({
          sub: session.user.id,
          email: session.user.email,
          name: session.user.name,
        }),
      },
    }),
  ],

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [process.env.WEB_URL || "http://localhost:3001"],
});
