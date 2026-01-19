import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.username === 'user' && credentials?.password === 'pass') {
          return { id: '1', name: 'User', email: 'user@example.com', subscribed: false };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.subscribed = user.subscribed;
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) session.user.subscribed = token.subscribed;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };