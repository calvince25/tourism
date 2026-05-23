import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        turnstileToken: { label: "Turnstile Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Spam protection (skip in dev or for default admin if no token provided)
        const token = credentials?.turnstileToken;
        const isDefaultAdmin = credentials.email.toLowerCase() === "omondicalvince4714@gmail.com";
        if (!token && process.env.NODE_ENV === "production" && !isDefaultAdmin) {
          throw new Error("Verification check is required.");
        }
        if (token && !isDefaultAdmin) {
          const { verifyTurnstileToken } = await import("./security");
          const isCheckPassed = await verifyTurnstileToken(token);
          if (!isCheckPassed) {
            throw new Error("Spam protection check failed.");
          }
        }

        // Authenticate against Supabase (via Prisma)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        if (user.status === "PENDING" || user.role === "PENDING") {
          throw new Error(
            "Your account is pending authorization from the administrator. Please wait."
          );
        }

        if (user.status === "SUSPENDED") {
          throw new Error("Your account has been suspended.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
};
