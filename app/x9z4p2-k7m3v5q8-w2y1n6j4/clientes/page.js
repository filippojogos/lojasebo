"use client";

import React, { useState, useEffect } from 'react';
import { Search, User, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 50;

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCustomers(data);
            }
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja apagar este cliente? Isso apagará também o histórico de pedidos dele.")) return;

        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCustomers(prev => prev.filter(c => c.id !== id));
            } else {
                alert("Erro ao apagar");
            }
        } catch (e) {
            alert("Erro de conexão");
        }
    };

    // Filter
    const filteredCustomers = customers.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cpf.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loading) return <div>Carregando Clientes...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={() => router.push('/x9z4p2-k7m3v5q8-w2y1n6j4')} className="btn-outline">
                    <ArrowLeft size={18} />
                </button>
                <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', margin: 0 }}>Gestão de Clientes</h1>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '10px 15px', borderRadius: '8px', maxWidth: '400px' }}>
                    <Search size={20} color="#999" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, CPF ou email..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={thStyle}>Cliente</th>
                            <th style={thStyle}>CPF</th>
                            <th style={thStyle}>contato</th>
                            <th style={thStyle}>Endereço</th>
                            <th style={thStyle}>Total Gasto</th>
                            <th style={thStyle}>Cadastro</th>
                            <th style={thStyle}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCustomers.map(customer => (
                            <tr key={customer.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#e0f7fa', color: '#006064', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#333' }}>{customer.nome}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#777' }}>#{customer.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={tdStyle}>{customer.cpf}</td>
                                <td style={tdStyle}>
                                    <div>{customer.telefone}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#777' }}>{customer.email}</div>
                                </td>
                                <td style={tdStyle} style={{ maxWidth: '200px' }}>{customer.endereco_principal}</td>
                                <td style={tdStyle}>
                                    <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
                                        R$ {customer.total_gasto.toFixed(2).replace('.', ',')}
                                    </span>
                                </td>
                                <td style={tdStyle}>{new Date(customer.data_cadastro).toLocaleDateString()}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        style={{ background: '#fff0f0', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: 'red' }}
                                        title="Excluir Cliente"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paginatedCustomers.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>Nenhum cliente encontrado.</div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn-outline"
                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                        Anterior
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#555' }}>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn-outline"
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}

const thStyle = { padding: '15px 20px', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' };
const tdStyle = { padding: '15px 20px', fontSize: '0.95rem', color: '#555' };
