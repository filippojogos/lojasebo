const { MercadoPagoConfig, Preference } = require('mercadopago');

// Token de Teste encontrado no código
const client = new MercadoPagoConfig({ accessToken: 'TEST-167855422731656-010418-8a531b1dbcd4c8081cad20038e6b84e0-139089034' });

async function testPayment() {
    console.log("Iniciando teste de criação de preferência (Checkout)...");

    const preference = new Preference(client);

    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'item-id-123',
                        title: 'Produto de Teste (Script)',
                        quantity: 1,
                        unit_price: 10.50
                    }
                ],
                payer: {
                    email: 'test_user_123456@testuser.com'
                }
            }
        });

        console.log("✅ Sucesso!");
        console.log("ID da Preferência:", result.id);
        console.log("URL de Checkout (Sandbox):", result.init_point);
        console.log("---------------------------------------------------");
        console.log("Esse token parece estar VÁLIDO para o ambiente de TESTES (Sandbox).");

    } catch (error) {
        console.error("❌ Erro ao criar preferência:", error);
        console.log("---------------------------------------------------");
        console.log("O token pode estar inválido ou expirado.");
    }
}

testPayment();
