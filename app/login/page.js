"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login success via Context
        login({ name: "João Pipo", email: email || "pipo@sebo.com" });
        router.push('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Bem-vindo de volta!</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>E-mail</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="********"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-cta btn-block">Entrar</button>
                </form>
                <div className="auth-divider">ou</div>
                <Link href="/cadastro" className="btn-outline btn-block" style={{ display: 'block', textDecoration: 'none' }}>
                    Criar nova conta
                </Link>
                <p className="auth-footer">
                    <Link href="/esqueci-senha">Esqueci minha senha</Link>
                </p>
            </div>
        </div>
    );
}
