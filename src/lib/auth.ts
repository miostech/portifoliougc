import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User, type UserPlan, type UserRole } from "@/models/User";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      plan: UserPlan;
      onboarded: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    plan?: UserPlan;
    onboarded?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        await connectDB();

        const user = await User.findOne({
          email,
          deletedAt: null,
          suspended: false,
        }).select("+passwordHash name email image role plan onboarded");
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role,
          plan: user.plan,
          onboarded: user.onboarded,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.plan = user.plan;
        token.onboarded = user.onboarded;
      }
      // Allow client-side session.update() to refresh volatile flags.
      if (trigger === "update" && session) {
        if (session.onboarded !== undefined) token.onboarded = session.onboarded;
        if (session.plan !== undefined) token.plan = session.plan;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) ?? "user";
        session.user.plan = (token.plan as UserPlan) ?? "none";
        session.user.onboarded = Boolean(token.onboarded);
      }
      return session;
    },
  },
});
