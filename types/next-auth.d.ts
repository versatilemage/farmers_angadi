// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    role?: string;
  }

  interface JWT {
    userId: string;
    email: string;
    username?: string;
    role?: string;
  }
}
