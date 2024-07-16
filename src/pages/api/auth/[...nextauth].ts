import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import { User } from "../../../models/User";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        const hashedPassword = crypto
          .createHash("sha256")
          .update(credentials.password)
          .digest("hex");
        if (user && user.password === hashedPassword) {
          const secret = process.env.JWT_SECRET as string;
          const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            secret,
            { expiresIn: "3h" }
          );
          return {
            id: user._id,
            email: user.email,
            role: user.role,
            accessToken,
          };
        }
        return null;
      },
    }),
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      const secret = process.env.JWT_SECRET as string;
      if (user) {
        token.role = user.role;
        token.accessToken = jwt.sign(
          { userId: user.id, email: user.email },
          secret,
          { expiresIn: "3h" }
        );
      }
      return token;
    },
    async session({ session, token }: any) {
      console.log("Token backend: ", token);
      if (token) {
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
});
