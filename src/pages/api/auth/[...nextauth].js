import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import LinkedInProvider from 'next-auth/providers/linkedin';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: "28377823778-0h8kgdkjqht5ecemq8d3fqq17d5nh47p.apps.googleusercontent.com",
      clientSecret: "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",
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
  callbacks: {
    async jwt({ token, account }) {
      // Add access token to the token object
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add access token to the session object
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      return session;
    },
  },
});