import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import { User } from "../../../models/User";
import crypto from "crypto";

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
          return {
            id: user._id,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized", // Aquí puedes definir la página de error
  },
});
