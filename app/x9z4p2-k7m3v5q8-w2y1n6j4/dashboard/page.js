"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalProfit: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalVisits: 0
    });
});
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchData = async () => {
        try {
            const [ordersRes, usersRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/users')
            ]);

            const orders = await ordersRes.json();
            const users = await usersRes.json();

            // Fetch visits (safe fail)
            let visits = 0;
            try {
                const vRes = await fetch('/api/stats');
                if (vRes.ok) {
                    const vData = await vRes.json();
                    visits = vData.visits || 0;
                }
            } catch (e) { }

            // Calculate Stats
            const totalSales = orders.reduce((acc, order) => acc + (order.total || 0), 0);
            const totalProfit = orders.reduce((acc, order) => acc + (order.lucro || 0), 0);

            setStats({
                totalSales,
                totalProfit,
                totalOrders: orders.length,
                totalCustomers: users.length,
                totalVisits: visits
            });
        });

            } catch (error) {
    console.error("Failed to fetch dashboard data", error);
} finally {
    setLoading(false);
}
        };

fetchData();
    }, []);

if (loading) return <div>Carregando Balanço...</div>;

return (
    <div>
        <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', marginBottom: '30px' }}>Dashboard (Balanço)</h1>

        {/* Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <StatCard
                title="Vendas Totais"
                value={`R$ ${stats.totalSales.toFixed(2).replace('.', ',')}`}
                icon={DollarSign}
                color="#27ae60"
            />
            <StatCard
                title="Lucro Líquido"
                value={`R$ ${stats.totalProfit.toFixed(2).replace('.', ',')}`}
                icon={TrendingUp}
                color="#2980b9"
                subtext="Margem estimada"
            />
            <StatCard
                title="Pedidos Realizados"
                value={stats.totalOrders}
                icon={ShoppingBag}
                color="#e67e22"
            />
            <StatCard
                title="Clientes Cadastrados"
                value={stats.totalCustomers}
                icon={Users}
                color="#8e44ad"
            />
            <StatCard
                title="Visitas Totais"
                value={stats.totalVisits}
                icon={Users}
                color="#16a085"
            />
        </div>

        {/* Placeholder for Charts/Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#555' }}>Resumo Mensal</h2>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: '8px', border: '2px dashed #eee', color: '#999' }}>
                    Gráfico de Vendas (Simulação)
                </div>
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#555' }}>Últimas Atividades</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {/* <li style={{ padding: '10px 0', borderBottom: '1px solid #eee', fontSize: '0.9rem', color: '#666' }}>
                            <strong>Nenhuma atividade recente.</strong>
                        </li> */}
                    <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>
                        Nenhuma atividade recente.
                    </div>
                </ul>
            </div>
        </div>

        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
            <h3 style={{ color: '#c0392b', marginBottom: '15px' }}>Zona de Perigo</h3>
            <ResetButton />
        </div>
    </ul>
                </div >
            </div >
        </div >
    );
}

function StatCard({ title, value, icon: Icon, color, subtext }) {
    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                <Icon size={30} />
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '5px' }}>{title}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>{value}</div>
                {subtext && <div style={{ fontSize: '0.8rem', color: color, marginTop: '2px' }}>{subtext}</div>}
            </div>
        </div>
    );
}
