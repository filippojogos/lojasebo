"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalProfit: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalVisits: 0,
        todayVisits: 0
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
                let visitorsToday = 0;
                try {
                    const vRes = await fetch('/api/stats');
                    if (vRes.ok) {
                        const vData = await vRes.json();
                        visits = vData.visits || 0;
                        visitorsToday = vData.today || 0;
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
                    totalVisits: visits,
                    todayVisits: visitorsToday
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
                    title="Visitantes (Total)"
                    value={stats.totalVisits}
                    icon={Users}
                    color="#16a085"
                />
                <StatCard
                    title="Visitantes (Hoje)"
                    value={stats.todayVisits || 0}
                    icon={Users}
                    color="#1abc9c"
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
                        <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>
                            Nenhuma atividade recente.
                        </div>
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                {/* Zone removed requested by user */}
            </div>
        </div>
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

function ResetButton() {
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!confirm("ATENÇÃO: Você está prestes a APAGAR TODOS os Pedidos e Clientes de teste.\n(Os Produtos serão mantidos)\n\nTem certeza absoluta?")) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/reset-data', { method: 'POST' });
            if (res.ok) {
                alert("Dados de teste limpos com sucesso!");
                window.location.reload();
            } else {
                alert("Erro ao limpar dados.");
            }
        } catch (e) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleReset}
            disabled={loading}
            style={{
                background: '#fff0f0',
                color: '#c0392b',
                border: '1px solid #e74c3c',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: loading ? 'wait' : 'pointer',
                fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '8px'
            }}
        >
            {loading ? 'Limpando...' : '🗑️ LIMPAR DADOS DE TESTE (Pedidos e Clientes)'}
        </button>
    );
}

