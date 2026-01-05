"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Search, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DestaquesAdminPage() {
    const router = useRouter();
    const [config, setConfig] = useState({ mainHighlights: [], categoryHighlights: {} });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state for selecting products
    const [selectionModalOpen, setSelectionModalOpen] = useState(false);
    const [targetCategory, setTargetCategory] = useState(null); // 'main' or category name

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resConfig, resProducts] = await Promise.all([
                    fetch('/api/home-config'),
                    fetch('/api/products')
                ]);
                setConfig(await resConfig.json());
                setProducts(await resProducts.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch('/api/home-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) alert("Destaques atualizados!");
            else alert("Erro ao salvar");
        } catch (e) {
            alert("Erro de conexão");
        }
    };

    const openSelectionModal = (target) => {
        setTargetCategory(target);
        setSearchTerm("");
        setSelectionModalOpen(true);
    };

    const addProduct = (productId) => {
        setConfig(prev => {
            const newConfig = { ...prev };

            if (targetCategory === 'main') {
                if (newConfig.mainHighlights.includes(productId)) return prev;
                if (newConfig.mainHighlights.length >= 4) {
                    alert("Máximo de 4 destaques principais.");
                    return prev;
                }
                newConfig.mainHighlights = [...newConfig.mainHighlights, productId];
            } else {
                // Category Highlight
                const catList = newConfig.categoryHighlights[targetCategory] || [];
                if (catList.includes(productId)) return prev;
                if (catList.length >= 8) {
                    alert("Máximo de 8 produtos por categoria nesta vitrine.");
                    return prev;
                }
                newConfig.categoryHighlights = {
                    ...newConfig.categoryHighlights,
                    [targetCategory]: [...catList, productId]
                };
            }
            return newConfig;
        });
        setSelectionModalOpen(false);
    };

    const removeProduct = (target, productId) => {
        setConfig(prev => {
            const newConfig = { ...prev };
            if (target === 'main') {
                newConfig.mainHighlights = newConfig.mainHighlights.filter(id => id !== productId);
            } else {
                newConfig.categoryHighlights[target] = (newConfig.categoryHighlights[target] || []).filter(id => id !== productId);
            }
            return newConfig;
        });
    };

    // Helper to get product details
    const getProd = (id) => products.find(p => p.id === id);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (targetCategory === 'main') return true; // Destaques principais aceita tudo

        const cat = p.categoria;

        switch (targetCategory) {
            case "Livros":
                return cat === "Livros";
            case "HQs & Mangás":
                return cat === "HQ´s" || cat === "Mangas" || cat === "HQs & Mangás";
            case "CDs de Música":
                return cat === "CD´s" || cat === "CDs de Música";
            case "VHS":
                return cat === "VHS";
            case "DVDs & Blu-Ray":
                return cat === "DVD´s" || cat === "Blue-Ray" || cat === "DVDs & Blu-Ray";
            case "Video Game":
                return cat === "Video Game";
            case "Card Game":
                return cat === "Card Game";
            default:
                return true;
        }
    });

    if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;

    const categories = [
        "Livros",
        "HQs & Mangás",
        "CDs de Música",
        "VHS",
        "DVDs & Blu-Ray",
        "Video Game",
        "Card Game"
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => router.push('/admin')} className="btn-outline">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 style={{ margin: 0 }}>Gerenciar Destaques</h1>
                </div>
                <button onClick={handleSave} className="btn-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={18} /> Salvar Alterações
                </button>
            </div>

            {/* Main Highlights */}
            <section style={{ marginBottom: '40px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Destaques Principais (Topo)</h2>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{config.mainHighlights.length}/4</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                    {config.mainHighlights.map(id => {
                        const p = getProd(id);
                        if (!p) return null;
                        return (
                            <div key={id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', position: 'relative', background: '#f9f9f9' }}>
                                <img src={p.imagem} style={{ width: '100%', height: '150px', objectFit: 'contain', marginBottom: '10px' }} />
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>{p.nome}</div>
                                <button onClick={() => removeProduct('main', id)} style={{ position: 'absolute', top: 5, right: 5, background: 'red', color: 'white', borderRadius: '50%', width: '24px', height: '24px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
                            </div>
                        );
                    })}
                    {config.mainHighlights.length < 4 && (
                        <button onClick={() => openSelectionModal('main')} style={{ border: '2px dashed #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '230px', cursor: 'pointer', background: 'transparent' }}>
                            <Plus size={32} color="#ccc" />
                            <span style={{ color: '#999', marginTop: '10px' }}>Adicionar</span>
                        </button>
                    )}
                </div>
            </section>

            {/* Category Highlights */}
            {categories.map(cat => (
                <section key={cat} style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Vitrine: {cat}</h2>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>{(config.categoryHighlights[cat] || []).length}/8</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                        {(config.categoryHighlights[cat] || []).map(id => {
                            const p = getProd(id);
                            if (!p) return null;
                            return (
                                <div key={id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', position: 'relative', background: '#f9f9f9' }}>
                                    <img src={p.imagem} style={{ width: '100%', height: '100px', objectFit: 'contain', marginBottom: '10px' }} />
                                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', height: '35px', overflow: 'hidden' }}>{p.nome}</div>
                                    <button onClick={() => removeProduct(cat, id)} style={{ position: 'absolute', top: 5, right: 5, background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                                </div>
                            );
                        })}
                        {(!config.categoryHighlights[cat] || config.categoryHighlights[cat].length < 8) && (
                            <button onClick={() => openSelectionModal(cat)} style={{ border: '2px dashed #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px', cursor: 'pointer', background: 'transparent' }}>
                                <Plus size={24} color="#ccc" />
                                <span style={{ color: '#999', marginTop: '5px', fontSize: '0.8rem' }}>Adicionar</span>
                            </button>
                        )}
                    </div>
                </section>
            ))}

            {/* Product Selection Modal */}
            {selectionModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', width: '90%', maxWidth: '600px', maxHeight: '80vh', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>
                                Selecionar Produto
                                {targetCategory !== 'main' && <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                                    (Filtro: {targetCategory})
                                </span>}
                            </h3>
                            <button onClick={() => setSelectionModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <div style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '0 10px' }}>
                                <Search size={18} color="#666" />
                                <input
                                    placeholder="Buscar produto..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '10px', border: 'none', outline: 'none' }}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '0 15px 15px' }}>
                            {filteredProducts.map(p => (
                                <div key={p.id} onClick={() => addProduct(p.id)} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }} className="hover-bg-gray">
                                    <img src={p.imagem} style={{ width: '40px', height: '40px', objectFit: 'contain', marginRight: '15px' }} />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{p.nome}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.categoria} - R$ {p.preco}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
