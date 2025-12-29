"use client";
import React from 'react';
import Link from 'next/link';

export default function CadastroPage() {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Criar Nova Conta</h2>
                <form onSubmit={(e) => { e.preventDefault(); alert('Cadastro simulado!'); }}>
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input type="text" placeholder="Seu nome" required />
                    </div>
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" placeholder="seu@email.com" required />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input type="password" placeholder="********" required />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Senha</label>
                        <input type="password" placeholder="********" required />
                    </div>
                    <button type="submit" className="btn-cta btn-block">Cadastrar</button>
                </form>
                <p className="auth-footer">
                    Já tem uma conta? <Link href="/login">Fazer Login</Link>
                </p>
            </div>
        </div>
    );
}
