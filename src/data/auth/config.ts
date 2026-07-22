import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { getDb } from "@/data/db/client";
import * as schema from "@/data/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  adapter: getDb() ? DrizzleAdapter(getDb()!) : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const name = credentials?.name?.toString().trim();

        if (!email) {
          return null;
        }

        const db = getDb();
        if (!db) {
          return {
            id: `guest-${email}`,
            email,
            name: name ?? email.split("@")[0],
          };
        }

        const existing = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1);

        if (existing[0]) {
          return {
            id: existing[0].id,
            email: existing[0].email ?? undefined,
            name: existing[0].name ?? undefined,
          };
        }

        const [created] = await db
          .insert(schema.users)
          .values({ email, name: name ?? email.split("@")[0] })
          .returning();

        return {
          id: created.id,
          email: created.email ?? undefined,
          name: created.name ?? undefined,
        };
      },
    }),
  ],
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
