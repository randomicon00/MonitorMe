import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  secret: "secret112323999", // Replace with process.env.SECRET in production
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "admin@admin.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const validEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
        const validPassword = process.env.ADMIN_PASSWORD || "123456";

        if (
          credentials?.username === validEmail &&
          credentials?.password === validPassword
        ) {
          return { id: 1, name: "Admin", email: validEmail };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, user, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});
