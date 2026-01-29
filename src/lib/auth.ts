import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    // Although we are using Credentials, PrismaAdapter can still be useful for session management if using database sessions.
    // For MVP with Credentials, we'll mostly use JWT-based sessions which don't strictly require an adapter,
    // but it's good practice for future-proofing.
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    throw new Error("Invalid credentials");
                }

                const dbUser = user as unknown as { role?: string; onboarded: boolean };
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: dbUser.role || "COLLECTOR",
                    onboarded: dbUser.onboarded
                };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.onboarded = user.onboarded;
            }

            if (trigger === "update" && session) {
                token.role = session.user.role;
                token.onboarded = session.user.onboarded;

            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.onboarded = token.onboarded;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
