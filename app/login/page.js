"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Mail, Lock, ArrowRight } from 'lucide-react';

function LoginContent() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({
                email: formData.email,
                password: formData.password
            });
            // Redirect on success
            router.push(redirectUrl);
            router.refresh();
        } catch (err) {
            setError('Email ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ background: 'var(--deep-purple)', padding: '30px 20px', textAlign: 'center', color: 'white' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>Bem-vindo de volta!</h1>
                    <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Acesse sua conta para continuar.</p>
                </div>

                <div style={{ padding: '30px' }}>
                    {error && (
                        <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', color: '#ff4d4f', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem' }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Senha</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '1rem', outline: 'none' }}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                <Link href="/esqueci-senha" style={{ fontSize: '0.85rem', color: 'var(--primary-orange)', textDecoration: 'none' }}>
                                    Esqueceu a senha?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-cta"
                            style={{ width: '100%', padding: '14px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem' }}
                        >
                            {loading ? 'Entrando...' : (
                                <>Entrar <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                        Não tem uma conta?{' '}
                        <Link href="/cadastro" style={{ color: 'var(--deep-purple)', fontWeight: 'bold', textDecoration: 'none' }}>
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Carregando...</div>}>
            <LoginContent />
        </Suspense>
    );
}
