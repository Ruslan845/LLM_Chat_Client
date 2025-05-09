import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './prisma.js'; // Import your Prisma client

export default NextAuth({
    adapter: PrismaAdapter(prisma), // Crucial for database interaction
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        }),
    ],
    // ... other options like pages, session, secret
    session: {
        strategy: 'jwt', // Or 'database' for sessions stored in the database
    },
    pages: {
      siginIn: '/auth', // Custom sign-in page
    },
    secret: process.env.NEXTAUTH_SECRET, // **CRITICAL** - Don't commit this to version control!
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                // Add other relevant claims like email, name
                token.user = {
                    email: account.providerAccountId, // Or other appropriate data
                    name: account.name,
                };
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
    },
});