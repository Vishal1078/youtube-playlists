import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,   // Ensure this is set correctly
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Ensure this is set correctly
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // Ensure this is set correctly
  session: {
    strategy: "jwt",  // Use JWT to store session data
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page (optional)
  },
  debug: true,  // Enable debugging
});
console.log(process.env.GOOGLE_CLIENT_ID);  // This should log your Google Client ID
console.log(process.env.GOOGLE_CLIENT_SECRET);  // This should log your Google Client Secret
console.log(process.env.NEXTAUTH_SECRET);  // This should log your NextAuth secret
