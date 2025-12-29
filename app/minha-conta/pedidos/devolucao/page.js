"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function DevolucaoPage() {
    const [step, setStep] = useState(1);

    const handleConfirm = (e) => {
        e.preventDefault();
        setStep(2);
    };

    return (
        <div className="dashboard-container full-width">
            <h1 className="page-title-bar">Solicitar Devolução</h1>

            {step === 1 ? (
                <div className="content-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ marginBottom: '20px' }}>Selecione o motivo da devolução</h3>
                    <form onSubmit={handleConfirm}>
                        <div className="form-group">
                            <label>Item</label>
                            <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                                O Senhor dos Anéis + 2 itens
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Motivo</label>
                            <select className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} required>
                                <option value="">Selecione...</option>
                                <option>Arrependimento / Desistência</option>
                                <option>Produto com defeito</option>
                                <option>Produto errado</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Observações Adicionais</label>
                            <textarea style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                            <Link href="/minha-conta/pedidos" className="btn-outline">Cancelar</Link>
                            <button type="submit" className="btn-cta">Continuar</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="content-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '50px 20px' }}>
                    <CheckCircle size={64} color="var(--primary-orange)" style={{ marginBottom: '20px' }} />
                    <h2 style={{ marginBottom: '10px' }}>Solicitação Recebida!</h2>
                    <p style={{ color: '#666', marginBottom: '30px' }}>
                        Um código de postagem será enviado para seu e-mail em até 24 horas.
                    </p>
                    <Link href="/minha-conta/pedidos" className="btn-cta">Voltar para Pedidos</Link>
                </div>
            )}
        </div>
    );
}
