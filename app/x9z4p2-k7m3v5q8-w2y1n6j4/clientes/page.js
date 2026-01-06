"use client";

import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cpf.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Carregando Clientes...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', color: '#2c3e50', marginBottom: '30px' }}>Gestão de Clientes</h1>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '10px 15px', borderRadius: '8px', maxWidth: '400px' }}>
                    <Search size={20} color="#999" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, CPF ou email..."
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
                            <th style={thStyle}>Cliente</th>
                            <th style={thStyle}>CPF</th>
                            <th style={thStyle}>Contato</th>
                            <th style={thStyle}>Endereço Principal</th>
                            <th style={thStyle}>Total Gasto</th>
                            <th style={thStyle}>Cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
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
                                <td style={tdStyle} style={{ maxWidth: '250px' }}>{customer.endereco_principal}</td>
                                <td style={tdStyle}>
                                    <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
                                        R$ {customer.total_gasto.toFixed(2).replace('.', ',')}
                                    </span>
                                </td>
                                <td style={tdStyle}>{new Date(customer.data_cadastro).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>Nenhum cliente encontrado.</div>
                )}
            </div>
        </div>
    );
}

const thStyle = { padding: '15px 20px', textAlign: 'left', fontSize: '0.9rem', color: '#666', fontWeight: '600' };
const tdStyle = { padding: '15px 20px', fontSize: '0.95rem', color: '#555' };
