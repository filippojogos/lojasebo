
const fetch = require('node-fetch'); // Assuming node-fetch is available or using native fetch in Node 18+

async function testUpdate() {
    // 1. First, find the product ID
    console.log("Fetching products to find 'Senhor dos Aneis'...");
    const res = await fetch('http://localhost:3000/api/products');
    if (!res.ok) {
        console.error("Failed to fetch products:", res.status, res.statusText);
        return;
    }
    const products = await res.json();
    const product = products.find(p => p.nome.toLowerCase().includes('senhor'));

    if (!product) {
        console.error("Product not found!");
        return;
    }

    console.log(`Found Product: ${product.nome} (ID: ${product.id})`);

    // 2. Try to update it
    const payload = {
        weight: 0.3,
        width: 13.5, // Float
        height: 3,
        depth: 20.8,
        estoque: 2,
        preco: 43.56,
        categoria: 'Livros'
    };

    console.log("Sending Payload:", payload);

    const updateRes = await fetch(`http://localhost:3000/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await updateRes.json();
    console.log("Update Response Code:", updateRes.status);
    console.log("Update Response Body:", JSON.stringify(data, null, 2));
}

testUpdate();
