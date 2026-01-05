const fetch = require('node-fetch');

async function testShipping() {
    try {
        const response = await fetch('http://localhost:3000/api/shipping/calc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destCep: "01001-000", // Praça da Sé (SP)
                products: [
                    { weight: 0.5, height: 5, width: 15, length: 20, qty: 1 }
                ]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testShipping();
