
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { nome, email, senha, cpf, telefone } = await request.json();

        if (!email || !senha || !nome) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const user = await prisma.user.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                cpf,
                telefone,
            }
        });

        // Don't return the password
        const { senha: _, ...userSafe } = user;

        return NextResponse.json(userSafe, { status: 201 });
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
