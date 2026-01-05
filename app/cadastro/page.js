"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
    const { login } = useAuth(); // Log in automatically after register
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        telefone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create User
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao criar conta');
            }

            // 2. Login automatically (with small delay to ensure DB consistency)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const loginResult = await login({
                email: formData.email,
                password: formData.senha
            });

            if (loginResult?.error) {
                throw new Error("Conta criada, mas erro ao logar: " + loginResult.error);
            }

            // 3. Redirect
            router.push('/');
            router.refresh();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '40px 20px' }}>
            <div style={{ width: '100%', maxWidth: '500px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

                <div style={{ background: 'var(--primary-orange)', padding: '30px 20px', textAlign: 'center', color: 'white' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>Crie sua conta</h1>
                    <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Junte-se a nós e compre seus jogos e livros favoritos!</p>
                </div>

                <div style={{ padding: '30px' }}>
                    {error && (
                        <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', color: '#ff4d4f', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem' }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div>
                            <label style={labelStyle}>Nome Completo</label>
                            <div style={inputContainerStyle}>
                                <User size={18} style={iconStyle} />
                                <input
                                    name="nome"
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="Seu Nome"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Email</label>
                            <div style={inputContainerStyle}>
                                <Mail size={18} style={iconStyle} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>CPF</label>
                                <div style={inputContainerStyle}>
                                    <FileText size={18} style={iconStyle} />
                                    <input
                                        name="cpf"
                                        type="text"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Telefone / WhatsApp</label>
                                <div style={inputContainerStyle}>
                                    <Phone size={18} style={iconStyle} />
                                    <input
                                        name="telefone"
                                        type="tel"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Senha</label>
                            <div style={inputContainerStyle}>
                                <Lock size={18} style={iconStyle} />
                                <input
                                    name="senha"
                                    type="password"
                                    required
                                    value={formData.senha}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="Mínimo 6 caracteres"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-cta"
                            style={{ marginTop: '10px', padding: '14px', borderRadius: '8px', fontSize: '1rem', width: '100%' }}
                        >
                            {loading ? 'Criando conta...' : 'Cadastrar'}
                        </button>
                    </form>

                    <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        Já tem cadastro?{' '}
                        <Link href="/login" style={{ color: 'var(--primary-orange)', fontWeight: 'bold', textDecoration: 'none' }}>
                            Acesse aqui
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '0.9rem' };
const inputContainerStyle = { position: 'relative' };
const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' };
const inputStyle = { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.95rem', outline: 'none' };
