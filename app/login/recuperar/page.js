"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle } from 'lucide-react'; // Fixed checkCircle import case too if needed, usually Lucide is PascalCase 'CheckCircle'

function RecoverForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const router = useRouter();

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            alert("Senhas não conferem!");
            return;
        }
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, password })
            });

            if (res.ok) {
                alert("Senha alterada com sucesso! Faça login.");
                router.push('/login');
            } else {
                const err = await res.json();
                alert("Erro: " + (err.error || "Código inválido"));
            }
        } catch (error) {
            alert("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Redefinir Senha</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Código enviado para: <b>{email}</b></p>

            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
                ℹ️ Em modo de teste, o código foi exibido no "Console" do navegador (F12) ou na resposta da API.
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Código de Verificação</label>
                    <input
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ex: 123456"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', letterSpacing: '5px', fontWeight: 'bold', textAlign: 'center' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Nova Senha</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label>Confirmar Senha</label>
                    <input
                        type="password"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {loading ? 'Redefinindo...' : 'Alterar Senha'}
                </button>
            </form>
        </div>
    );
}

export default function RecoverPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid #eee', borderTop: '3px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        }>
            <RecoverForm />
        </Suspense>
    );
}
