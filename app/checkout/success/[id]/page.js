"use client";

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage({ params }) {
    // In Next.js 15+, params is a promise
    // But in this setup checking previous files it seems we are on Next 13/14 stable.
    // However, user route files used 'await params', so let's be safe.

    // Actually, simplifying: just use generic success for now or try to unwrap param
    // The route we set is /checkout/success/[id]
    // So folder structure should be app/checkout/success/[id]/page.js

    const router = useRouter();

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '100px', height: '100px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', color: '#2e7d32' }}>
                <CheckCircle size={60} />
            </div>

            <h1 style={{ color: '#2c3e50', marginBottom: '15px' }}>Pedido Realizado com Sucesso!</h1>
            <p style={{ maxWidth: '500px', color: '#555', marginBottom: '30px', fontSize: '1.1rem' }}>
                Seu pagamento está sendo processado pelo Mercado Pago. <br />
                Assim que aprovado, enviaremos os produtos para o endereço cadastrado.
            </p>

            <div style={{ display: 'flex', gap: '15px' }}>
                <Link href="/" className="btn-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Home size={18} /> Voltar para Loja
                </Link>
                <Link href="/minha-conta/pedidos" className="btn-outline">
                    Ver Meus Pedidos
                </Link>
            </div>
        </div>
    );
}
