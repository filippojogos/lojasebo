
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Procurando produto 'Senhor dos Anéis'...");

    // Find valid product
    const products = await prisma.product.findMany({
        where: {
            nome: {
                contains: 'Senhor',
                mode: 'insensitive'
            }
        }
    });

    if (products.length === 0) {
        console.log("Produto não encontrado.");
        return;
    }

    const product = products[0];
    console.log(`Produto encontrado: ${product.nome} (ID: ${product.id})`);

    // Update
    console.log("Atualizando dimensões...");
    const updated = await prisma.product.update({
        where: { id: product.id },
        data: {
            weight: 0.3,   // 300g
            width: 13.5,   // 13.5cm
            height: 3,     // 3cm
            depth: 20.8,   // 20.8cm
            estoque: 2,
            preco: 43.56
        }
    });

    console.log("✅ Produto atualizado com sucesso via script direto!");
    console.log(updated);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
