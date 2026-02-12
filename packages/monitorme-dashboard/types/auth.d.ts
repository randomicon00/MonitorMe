import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
  }
}
