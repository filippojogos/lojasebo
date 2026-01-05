
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.senha) {
                    throw new Error("User not found");
                }

                const isValid = await bcrypt.compare(credentials.password, user.senha);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                // Parse JSON fields
                let addresses = [];
                let cards = [];
                try {
                    if (user.endereco) addresses = JSON.parse(user.endereco);
                    if (user.cartoes) cards = JSON.parse(user.cartoes);
                } catch (e) {
                    console.error("JSON Parse Error", e);
                }

                return {
                    id: user.id.toString(),
                    name: user.nome || "Usuário",
                    email: user.email,
                    addresses: addresses || [],
                    cards: cards || []
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.addresses = user.addresses;
                token.cards = user.cards;
            }
            if (trigger === "update" && session) {
                // Allow updating token via client side update()
                if (session.name) token.name = session.name;
                if (session.email) token.email = session.email;
                if (session.addresses) token.addresses = session.addresses;
                if (session.cards) token.cards = session.cards;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.addresses = token.addresses;
                session.user.cards = token.cards;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "sebo_secret_dev_key_123",
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
