"use client";

import React from 'react';
import { BookOpen, RefreshCw, Truck } from 'lucide-react';

export default function SobrePage() {
    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Sobre a Loja Sebo</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
                    Conectando histórias, games e cultura pop de geração para geração. Somos apaixonados pelo que fazemos.
                </p>
            </div>

            {/* Mission/Vision */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center', marginBottom: '80px' }}>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/logo-novo.png" alt="Loja Sebo Team" style={{ maxHeight: '150px', opacity: 1 }} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#333' }}>Nossa Missão</h2>
                    <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#555' }}>
                        Nascemos com o objetivo de dar uma nova vida a livros, jogos e itens colecionáveis. Acreditamos que cada item tem uma história que merece continuar nas mãos de outra pessoa.
                    </p>
                    <p style={{ lineHeight: '1.6', color: '#555' }}>
                        Somos especialistas em garimpar raridades e garantir que você tenha acesso a produtos testados, higienizados e de qualidade, com o preço justo de um sebo e a qualidade de uma loja especializada.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '60px' }}>
                <div style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: '#ffe0b2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary-orange)' }}>
                        <BookOpen size={28} />
                    </div>
                    <h3 style={{ marginBottom: '10px' }}>Curadoria Especializada</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Avaliamos item a item para garantir que você receba exatamente o que espera.
                    </p>
                </div>
                <div style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: '#e0f2f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#00695c' }}>
                        <RefreshCw size={28} />
                    </div>
                    <h3 style={{ marginBottom: '10px' }}>Economia Circular</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Promovemos o reuso e a sustentabilidade, diminuindo o impacto ambiental.
                    </p>
                </div>
                <div style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: '#e1bee7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#7b1fa2' }}>
                        <Truck size={28} />
                    </div>
                    <h3 style={{ marginBottom: '10px' }}>Entrega Segura</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Embalagens reforçadas para que seu colecionável chegue intacto até você.
                    </p>
                </div>
            </div>
        </div>
    );
}
