const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Seed Products
    const productsPath = path.join(__dirname, '../app/data/products.json')
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))

    for (const p of productsData) {
        // Check if product already exists (optional, but good for re-running)
        // using findFirst since we don't have unique constraint on name, but ID is autoincrement in SQLite
        // We will force ID to match JSON ID to keep consistency
        await prisma.product.upsert({
            where: { id: p.id },
            update: {},
            create: {
                id: p.id,
                nome: p.nome,
                preco: p.preco,
                precoOriginal: p.precoOriginal,
                categoria: p.categoria,
                subcategoria: p.subcategoria,
                imagem: p.imagem,
                tag: p.tag,
                descricao: p.descricao,
                sku: p.sku,
                rating: p.rating,
                estoque: p.estoque,
                galeria: JSON.stringify(p.galeria || []),
            },
        })
    }
    console.log(`Seeded ${productsData.length} products`)

    // 2. Seed Users
    const usersPath = path.join(__dirname, '../app/data/users.json')
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))

    // Simple hash for dev environment (pass: 123456)
    // using a fixed hash to avoid needing bcrypt in this specific seed file if not desired, 
    // but better to allow login. 
    // $2a$10$.... is a bcrypt hash. Let's rely on the app logic or just set a dummy that satisfies the string constraint.
    // Ideally, we'd require bcrypt here. Let's try to require it since we installed it.

    let bcrypt;
    try {
        bcrypt = require('bcryptjs');
    } catch (e) {
        console.warn("bcryptjs not found, using placeholder password");
    }

    const defaultPasswordHash = bcrypt ? await bcrypt.hash('123456', 10) : 'placeholder_hash';

    for (const u of usersData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                senha: defaultPasswordHash // Update existing with password
            },
            create: {
                id: u.id,
                nome: u.nome,
                email: u.email,
                senha: defaultPasswordHash,
                telefone: u.telefone,
                cpf: u.cpf,
                endereco: u.endereco_principal,
            },
        })
    }
    console.log(`Seeded ${usersData.length} users`)

    // 3. Seed Orders
    const ordersPath = path.join(__dirname, '../app/data/orders.json')
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'))

    for (const o of ordersData) {
        await prisma.order.upsert({
            where: { id: o.id },
            update: {},
            create: {
                id: o.id,
                total: o.total,
                lucro: o.lucro,
                status: o.status,
                data: new Date(o.data), // Parse ISO string to Date
                pagamento: o.pagamento,
                userId: o.cliente.id,
                items: JSON.stringify(o.itens),
            },
        })
    }
    console.log(`Seeded ${ordersData.length} orders`)

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
