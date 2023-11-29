import { AuthOptions } from "next-auth";
import { PrismaClient, User } from "@prisma/client";
import { env } from "@/lib/env";
import { authProviders } from "./authProviders";
import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { mergeAnonymousWishlistIntoUserCart } from "@/lib/db/wishlist";
import { randomBytes, randomUUID } from "crypto";
// import { mergeAnonymousDeliveryIntoUserCart } from "@/lib/db/delivery";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
  providers: authProviders,

  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  secret: env.NEXTAUTH_SECRET,
  // debug: env.NODE_ENV === "development",
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await mergeAnonymousCartIntoUserCart(user.id);
      await mergeAnonymousWishlistIntoUserCart(user.id);
      // await mergeAnonymousDeliveryIntoUserCart(user.id);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
