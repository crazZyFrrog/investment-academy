import NextAuth from "next-auth";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/data/db/client";
import { AUTH_ENABLED } from "./flags";
import { getEnv } from "@/lib/env";

const env = getEnv();
const providers = [];

if (AUTH_ENABLED && !env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is required when authentication is enabled.");
}

if (AUTH_ENABLED && process.env.NODE_ENV === "production" && !env.AUTH_URL) {
  throw new Error("AUTH_URL is required for production authentication.");
}

if (AUTH_ENABLED && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (AUTH_ENABLED && env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
  providers.push(
    Apple({
      clientId: env.APPLE_CLIENT_ID,
      clientSecret: env.APPLE_CLIENT_SECRET,
    })
  );
}

if (AUTH_ENABLED && providers.length === 0) {
  throw new Error(
    "Authentication is enabled but no OAuth provider is configured. Set Google or Apple credentials."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  trustHost: process.env.NODE_ENV !== "production",
  adapter: getDb() ? DrizzleAdapter(getDb()!) : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
