import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { NextRequest, NextResponse } from "next/server";

console.log("CLIENT_ID:", process.env.KEYCLOAK_CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.KEYCLOAK_CLIENT_SECRET);
console.log("ISSUER:", process.env.KEYCLOAK_ISSUER);
console.log("SECRET:", process.env.NEXTAUTH_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: { params: { prompt: "login" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      if (token.sub) {
        session.user!.id = token.sub;
      }
      if (token.realm_access?.roles) {
        session.user!.roles = token.realm_access.roles;
      }
      if (token.access_token) {
        session.access_token = token.access_token;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        console.log(token);
      }
      if (profile) {
        token.sub = profile?.sub;
        token.name = profile?.name;
        token.email = profile?.email;
      }
      return token;
    },
  },
  // pages: {
  //   signIn: "/auth/signin", // Optional custom sign-in page
  //   error: "/auth/error", // Optional custom error page
  // },
};

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, res: NextResponse) {
  return handler(req, res) as Promise<NextResponse>;
}

export async function POST(req: NextRequest, res: NextResponse) {
  return handler(req, res) as Promise<NextResponse>;
}
