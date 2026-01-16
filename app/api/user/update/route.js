import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const userId = parseInt(session.user.id);

        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        }

        const updateData = {};

        // Map allowed fields
        if (data.name) updateData.nome = data.name;
        if (data.email) updateData.email = data.email;
        if (data.phone) updateData.telefone = data.phone;
        if (data.cpf) updateData.cpf = data.cpf;

        // Handle Addresses (stored as JSON string)
        if (data.addresses) {
            updateData.endereco = JSON.stringify(data.addresses);
        }

        // Handle Cards (stored as JSON string)
        if (data.cards) {
            updateData.cartoes = JSON.stringify(data.cards);
        }

        // Handle Password Update
        if (data.newPassword && data.currentPassword) {
            // Verify old password
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user || !user.senha) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const isPasswordValid = await bcrypt.compare(data.currentPassword, user.senha);
            if (!isPasswordValid) {
                return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
            updateData.senha = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        // Return updated user data (exclude password)
        const { senha: _, ...userSafe } = updatedUser;

        return NextResponse.json(userSafe);
    } catch (error) {
        console.error("Update User Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
