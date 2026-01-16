"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                // Simulate sending email by logging to console (for now)
                // Redirect to code verification
                router.push(`/login/recuperar?email=${encodeURIComponent(email)}`);
            } else {
                alert("Erro ao processar. Verifique o e-mail.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', color: '#666' }}>
                <ArrowLeft size={20} /> Voltar
            </Link>

            <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Recuperar Senha</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Digite seu e-mail para receber o código de recuperação.</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>E-mail Cadastrado</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} style={{ position: 'absolute', left: '10px', top: '12px', color: '#999' }} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #ddd', borderRadius: '8px' }}
                            placeholder="exemplo@email.com"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#2c3e50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'wait' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Enviando...' : 'Enviar Código'}
                </button>
            </form>
        </div>
    );
}
