const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('Criando usuário de teste...');
    const email = 'cliente@teste.com';
    // Senha simples para teste: 123123
    const senha = await bcrypt.hash('123123', 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            senha, // Atualiza a senha se o usuário já existir
            nome: 'Cliente Teste'
        },
        create: {
            nome: 'Cliente Teste',
            email,
            senha,
            cpf: '000.000.000-00',
            telefone: '(11) 99999-9999',
            endereco: 'Rua Teste, 123 - Bairro Teste, Cidade - SP'
        }
    });

    console.log(`Usuário criado/atualizado com sucesso:`);
    console.log(`Email: ${user.email}`);
    console.log(`Senha: 123123`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
