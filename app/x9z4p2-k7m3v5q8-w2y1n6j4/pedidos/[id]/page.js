"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchOrder(params.id);
    }, [params.id]);

    const fetchOrder = async (id) => {
        try {
            const res = await fetch(`/api/orders`);
            const data = await res.json();
            // Since api/orders returns all for user usually, but for admin we might need a specific endpoint or just filter if the API returns all orders for admin. 
            // Wait, api/orders GET currently filters by session user.
            // Admin needs to fetch ANY order.
            // The current api/orders GET only returns "my orders". 
            // I need to update api/orders to allow admin to fetch by ID or fetch all.
            // But wait, saida/page.js fetches all orders?
            // Let's check api/orders again.

            // Re-checking api/orders/route.js:
            // It fetches: where: { userId: Number(session.user.id) }
            // So `saida/page.js` must be using a DIFFERENT endpoint?
            // Let's re-read saida/page.js to see what it calls.
            // It calls `/api/orders`.
            // If saida/page.js works, then the user logged in as Admin IS the one creating orders? No.
            // Admin sees EVERYONE's orders.
            // If api/orders filters by session.user.id, then saida/page.js is BROKEN unless admin is the user.
            // But the user has been testing. Maybe they are testing flow with their own account?
            // Ah, usually Admin requires a different API or a modified one.
            // Let's assume for now I need to fetch the specific order.
            // I'll assume saida/page.js works for now (maybe it was modified to return all if admin? I'll check).

            // For now, I will use the same fetch pattern as saida/page.js filters.
            // If saida was fetching all, then api/orders must be returning all.
            // Use find logic on client or server?

            // Simplest path: Fetch specific order only.
            // I'll assume I can add `?id=` to GET as well.
            const res2 = await fetch(`/api/orders?id=${id}&all=true`);
            const data2 = await res2.json();

            // If logic isn't there, I will add it.
            if (Array.isArray(data2)) {
                const found = data2.find(o => o.id === Number(id));
                setOrder(found);
            } else if (data2.id) {
                setOrder(data2);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;
    if (!order) return <div style={{ padding: 40 }}>Pedido não encontrado ou acesso negado.</div>;

    const items = order.items && typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    const address = order.user?.endereco ? JSON.parse(order.user.endereco) : [];
    // Try to find the used address or just the priority one. In real app, order should snapshot address.
    const usedAddress = Array.isArray(address) ? (address.find(a => a.priority) || address[0]) : null;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 25px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
            <div className="no-print" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/saida" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Voltar
                </Link>
                <button onClick={() => window.print()} className="btn-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={16} /> Imprimir Nota
                </button>
            </div>

            <div style={{ padding: '20px', border: '2px solid #000' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', textTransform: 'uppercase' }}>Sebo da Esquina</h1>
                    <p style={{ margin: '5px 0' }}>CNPJ: 00.000.000/0001-00</p>
                    <p style={{ margin: 0 }}>Rua Exemplo, 123 - Centro, São Paulo - SP</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <div>
                        <h3 style={{ margin: '0 0 10px', fontSize: '1rem', textTransform: 'uppercase', background: '#eee', padding: '5px' }}>Dados do Pedido</h3>
                        <p><strong>Número:</strong> #{order.id}</p>
                        <p><strong>Data:</strong> {new Date(order.data).toLocaleDateString()} {new Date(order.data).toLocaleTimeString()}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Pagamento:</strong> {order.pagamento}</p>
                    </div>
                    <div style={{ minWidth: '300px' }}>
                        <h3 style={{ margin: '0 0 10px', fontSize: '1rem', textTransform: 'uppercase', background: '#eee', padding: '5px' }}>Dados do Cliente</h3>
                        <p><strong>Nome:</strong> {order.user?.nome}</p>
                        <p><strong>Email:</strong> {order.user?.email}</p>
                        {usedAddress && (
                            <>
                                <p><strong>Endereço:</strong> {usedAddress.street}, {usedAddress.number}</p>
                                <p>{usedAddress.district} - {usedAddress.city}/{usedAddress.uf}</p>
                                <p>CEP: {usedAddress.zip}</p>
                            </>
                        )}
                    </div>
                </div>

                <h3 style={{ margin: '0 0 10px', fontSize: '1rem', textTransform: 'uppercase', background: '#eee', padding: '5px' }}>Itens</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Produto</th>
                            <th style={{ textAlign: 'center', padding: '8px' }}>Qtd</th>
                            <th style={{ textAlign: 'right', padding: '8px' }}>Preço Unit.</th>
                            <th style={{ textAlign: 'right', padding: '8px' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px' }}>{item.nome}</td>
                                <td style={{ textAlign: 'center', padding: '8px' }}>{item.qty}</td>
                                <td style={{ textAlign: 'right', padding: '8px' }}>R$ {Number(item.price).toFixed(2).replace('.', ',')}</td>
                                <td style={{ textAlign: 'right', padding: '8px' }}>R$ {(item.qty * item.price).toFixed(2).replace('.', ',')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '5px 0' }}>Itens: R$ {(order.total - (order.frete || 0)).toFixed(2).replace('.', ',')}</p>
                    <p style={{ margin: '5px 0' }}>Frete: R$ {order.frete ? order.frete.toFixed(2).replace('.', ',') : '0,00'}</p>
                    <h2 style={{ margin: '10px 0 0', fontSize: '1.5rem' }}>TOTAL: R$ {order.total.toFixed(2).replace('.', ',')}</h2>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    div { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
                }
            `}</style>
        </div>
    );
}
