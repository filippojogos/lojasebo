"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Search, Plus } from 'lucide-react';

import Toast from '../../components/Toast';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const showToast = (message, type = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error("Erro API Produtos");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch products", error);
            setProducts([]); // Prevent crash
            showToast("Erro ao carregar produtos", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirmDeleteId === id) {
            try {
                const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    showToast('Produto excluído com sucesso!', 'success');
                    fetchProducts(); // Refresh list
                    setConfirmDeleteId(null);
                } else {
                    showToast('Erro ao excluir produto.', 'error');
                }
            } catch (error) {
                console.error("Error deleting:", error);
                showToast('Erro de conexão', 'error');
            }
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId(null), 3000);
        }
    };

    const filteredProducts = products.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Carregando painel...</div>;

    return (
        <div>
            {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#2c3e50' }}>Gerenciar Produtos</h1>
                <Link href="/x9z4p2-k7m3v5q8-w2y1n6j4/produtos/novo" className="btn-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                    <Plus size={20} /> Novo Produto
                </Link>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '10px 15px', borderRadius: '8px', maxWidth: '400px' }}>
                    <Search size={20} color="#999" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou SKU..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Imagem</th>
                            <th style={thStyle}>Produto</th>
                            <th style={thStyle}>Categoria</th>
                            <th style={thStyle}>Preço</th>
                            <th style={thStyle}>Estoque</th>
                            <th style={thStyle} align="right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={tdStyle}>#{product.id}</td>
                                <td style={tdStyle}>
                                    <img src={product.imagem} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee' }} />
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: 'bold', color: '#333' }}>{product.nome}</div>
                                </td>
                                <td style={tdStyle}>{product.categoria}</td>
                                <td style={tdStyle}>R$ {product.preco.toFixed(2)}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                                        background: product.estoque > 0 ? '#e8f5e9' : '#ffebee',
                                        color: product.estoque > 0 ? '#2e7d32' : '#c62828'
                                    }}>
                                        {product.estoque} un
                                    </span>
                                </td>
                                <td style={tdStyle} align="right">
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <Link href={`/x9z4p2-k7m3v5q8-w2y1n6j4/produtos/editar/${product.id}`} style={actionBtnStyle} title="Editar">
                                            <Edit size={18} color="#2980b9" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{
                                                ...actionBtnStyle,
                                                background: confirmDeleteId === product.id ? '#d32f2f' : 'transparent',
                                                borderRadius: '4px',
                                                color: confirmDeleteId === product.id ? 'white' : '#c0392b',
                                                minWidth: '32px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Excluir"
                                        >
                                            {confirmDeleteId === product.id ? <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0 5px' }}>Confirmar?</span> : <Trash2 size={18} color="#c0392b" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>Nenhum produto encontrado.</div>
                )}
            </div>
        </div>
    );
}

const thStyle = { padding: '15px 20px', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' };
const tdStyle = { padding: '15px 20px', fontSize: '0.95rem' };
const actionBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };
