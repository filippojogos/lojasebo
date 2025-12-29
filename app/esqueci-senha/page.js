"use client";
import React from 'react';
import Link from 'next/link';

export default function EsqueciSenhaPage() {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Recuperar Senha</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                    Digite seu e-mail abaixo e enviaremos as instruções para redefinir sua senha.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert('E-mail de recuperação enviado (simulado)!'); }}>
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" placeholder="seu@email.com" required />
                    </div>
                    <button type="submit" className="btn-cta btn-block">Enviar Instruções</button>
                </form>
                <p className="auth-footer">
                    <Link href="/login">Voltar para o Login</Link>
                </p>
            </div>
        </div>
    );
}
