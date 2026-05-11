import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// Create a server-side Supabase client for auth callbacks
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(supabaseUrl, supabaseKey);
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const supabase = getSupabaseClient();
        
        // Check if user exists in our database
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          // Create new user in our database
          const { error } = await supabase.from("users").insert({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            provider: account?.provider || null,
          });

          if (error) {
            console.error("Error creating user:", error);
            return false;
          }
        } else {
          // Update existing user info
          await supabase
            .from("users")
            .update({
              name: user.name || null,
              image: user.image || null,
            })
            .eq("email", user.email);
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const supabase = getSupabaseClient();
        
        // Get user ID from database
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", session.user.email!)
          .single();

        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
