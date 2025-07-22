import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { jwtDecode } from "jwt-decode";

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken!,
        }),
        method: "POST",
      }
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions: NextAuthOptions = {
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
        token.refreshToken = account.refresh_token;
      }
      if (profile) {
        token.sub = profile?.sub;
        token.name = profile?.name;
        token.email = profile?.email;
      }

      if (Date.now() < token.expires_at! * 1000) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
  // pages: {
  //   signIn: "/auth/signin", // Optional custom sign-in page
  //   error: "/auth/error", // Optional custom error page
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
