// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    roles?: string[];
    preferred_username?: string; // Add the preferred_username property
    // Add other custom user properties here
  }

  interface Session extends DefaultSession {
    user?: User;
    id_token?: string; // If you're storing the ID token in the session
    access_token?: string;
    // Add other custom session properties here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    access_token?: string;
    id_token?: string;
    expires_at?: number;
    roles?: string[];
    preferred_username?: string; // Add the preferred_username property to JWT as well
    realm_access?: {
      roles: string[];
    };
  }
}
