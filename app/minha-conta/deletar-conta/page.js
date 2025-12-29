"use client";

import React, { useState } from 'react';
import { Trash2, AlertTriangle, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DeletarContaPage() {
    const { logout } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState('form'); // form, confirm, success
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setStep('confirm');
    };

    const handleConfirmDelete = () => {
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            setStep('success');
        }, 1500);
    };

    const handleFinalClose = () => {
        logout(); // Logout user
        router.push('/'); // Redirect home
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Trash2 size={28} /> Deletar Conta
                </h1>
                <p style={{ color: '#666', marginTop: '5px' }}>
                    Esta ação é permanente. Todos os seus dados serão apagados.
                </p>
            </div>

            {/* Main Content */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #ffebee' }}>

                <div style={{ background: '#fff5f5', borderLeft: '4px solid #e74c3c', padding: '15px', borderRadius: '4px', marginBottom: '30px', display: 'flex', gap: '15px' }}>
                    <AlertTriangle color="#e74c3c" size={24} style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.9rem', color: '#c0392b' }}>
                        <strong>Atenção:</strong> Ao deletar sua conta, você perderá acesso ao seu histórico de pedidos, favoritos e endereços salvos. Se você tem pedidos em andamento, aguarde a conclusão antes de excluir a conta.
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Confirme seu E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Digite sua Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={() => router.back()}
                            style={{ flex: 1 }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Continuar Exclusão
                        </button>
                    </div>
                </form>
            </div>

            {/* CONFIRMATION MODAL */}
            {step === 'confirm' && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#e74c3c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'white' }}>
                                <AlertTriangle size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.4rem', color: '#333' }}>Tem certeza absoluta?</h2>
                            <p style={{ color: '#666', marginTop: '10px' }}>
                                Essa ação não pode ser desfeita. Sua conta será permanentemente removida da nossa base de dados.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setStep('form')}
                                style={{ ...btnStyle, background: '#f5f5f5', color: '#333' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={loading}
                                style={{ ...btnStyle, background: '#e74c3c', color: 'white' }}
                            >
                                {loading ? 'Apagando...' : 'Sim, Deletar Tudo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL */}
            {step === 'success' && (
                <div style={modalOverlayStyle} onClick={handleFinalClose}>
                    <div style={{ ...modalContentStyle, animation: 'pulse-scale 0.5s ease-out' }} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#2ecc71', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'white' }}>
                                <Check size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.4rem', color: '#333' }}>Conta Deletada</h2>
                            <p style={{ color: '#666', marginTop: '10px' }}>
                                Sentiremos sua falta! 😢<br />
                                Sua conta foi excluída com sucesso e você será desconectado.
                            </p>
                        </div>
                        <button
                            onClick={handleFinalClose}
                            style={{ ...btnStyle, background: 'var(--deep-purple)', color: 'white', width: '100%' }}
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.2s ease'
};

const modalContentStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
};

const btnStyle = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem'
};
