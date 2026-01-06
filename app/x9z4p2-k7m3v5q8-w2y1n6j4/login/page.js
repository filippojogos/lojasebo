"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Accept both passwords for backward compatibility/ease of use
        // Strong password verification
        if (password === 'X9$mK#7pL@2qR!5zW&') {
            // Set cookie with 1 day expiration
            const date = new Date();
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
            document.cookie = `admin_token=true; expires=${date.toUTCString()}; path=/`;

            // Use window.location to force a full refresh and ensure Layout picks up the cookie
            window.location.href = '/x9z4p2-k7m3v5q8-w2y1n6j4/produtos';
        } else {
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--deep-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white' }}>
                    <Lock size={30} />
                </div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#333' }}>Área Administrativa</h1>

                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Senha de Acesso"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(false); }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            border: error ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '1rem'
                        }}
                    />
                    {error && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '15px' }}>Senha incorreta</p>}

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'var(--deep-purple)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
