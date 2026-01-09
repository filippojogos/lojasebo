"use client";

import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PopupAdminPage() {
    // ESTADO
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // CARREGAR DADOS
    useEffect(() => {
        fetch('/api/popup-config')
            .then(r => r.json())
            .then(d => { setConfig(d); setLoading(false); })
            .catch(err => {
                console.error("Erro ao carregar popup:", err);
                setLoading(false);
            });
    }, []);

    // SALVAR
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/popup-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                const updatedConfig = await res.json();
                setConfig(updatedConfig); // Atualiza com o que veio do servidor (Single Source of Truth)
                alert('Configuração salva com sucesso!');
            } else {
                alert('Erro ao salvar.');
            }
        } catch (e) {
            alert('Erro de conexão.');
        } finally {
            setSaving(false);
        }
    };

    // UPLOAD IMAGEM
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) setConfig({ ...config, imageUrl: data.url });
        } catch (err) {
            alert('Erro no upload da imagem');
        }
    };

    if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;
    if (!config) return <div style={{ padding: 40 }}>Erro ao carregar configuração.</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '10px' }}>Gerenciar Pop-up Inicial</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Configure o aviso de manutenção ou promoções que aparecem ao entrar no site.</p>

            <section style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

                {/* ATIVAR / DESATIVAR */}
                <div style={{ marginBottom: '25px', padding: '15px', background: config.active ? '#e8f8f5' : '#fdfefe', border: '1px solid #eee', borderRadius: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', color: config.active ? '#27ae60' : '#7f8c8d' }}>
                        <input
                            type="checkbox"
                            checked={config.active}
                            onChange={e => setConfig({ ...config, active: e.target.checked })}
                            style={{ transform: 'scale(1.5)' }}
                        />
                        {config.active ? 'Pop-up ATIVO' : 'Pop-up DESATIVADO'}
                    </label>
                </div>

                <div style={{ opacity: config.active ? 1 : 0.6, pointerEvents: config.active ? 'all' : 'none', transition: 'opacity 0.3s' }}>

                    {/* TIPO */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#444' }}>Tipo de Aviso</h3>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={{ flex: 1, cursor: 'pointer', border: config.type === 'maintenance' ? '2px solid #e74c3c' : '1px solid #ddd', padding: '15px', borderRadius: '8px', background: config.type === 'maintenance' ? '#fdedec' : 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <input type="radio" name="popupType" checked={config.type === 'maintenance'} onChange={() => setConfig({ ...config, type: 'maintenance' })} />
                                    <span style={{ fontWeight: 'bold', color: '#c0392b' }}>Manutenção (Bloqueio Total)</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666', paddingLeft: '24px' }}>
                                    O site fica inacessível para clientes. Apenas administradores logados podem acessar.
                                </div>
                            </label>

                            <label style={{ flex: 1, cursor: 'pointer', border: config.type === 'image' ? '2px solid #3498db' : '1px solid #ddd', padding: '15px', borderRadius: '8px', background: config.type === 'image' ? '#ebf5fb' : 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <input type="radio" name="popupType" checked={config.type === 'image'} onChange={() => setConfig({ ...config, type: 'image' })} />
                                    <span style={{ fontWeight: 'bold', color: '#2980b9' }}>Imagem / Promoção</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666', paddingLeft: '24px' }}>
                                    Exibe uma imagem sobre o site com opção de fechar. Ideal para avisos e ofertas.
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* CONFIGURACAO DE IMAGEM (APENAS SE TIPO IMAGE) */}
                    {config.type === 'image' && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                            <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#444' }}>Imagem do Pop-up</h3>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{ width: '200px', height: '200px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px dashed #ccc' }}>
                                    {config.imageUrl ? (
                                        <img src={config.imageUrl} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <ImageIcon size={40} color="#ccc" />
                                    )}
                                </div>
                                <div>
                                    <input type="file" id="popupImage" style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
                                    <label htmlFor="popupImage" className="btn-outline" style={{ display: 'inline-block', marginBottom: '10px', cursor: 'pointer' }}>Escolher Imagem</label>
                                    <div style={{ fontSize: '0.85rem', color: '#888' }}>Recomendado: 600x600px ou 800x600px</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '40px', textAlign: 'right' }}>
                    <button onClick={handleSave} className="btn-cta" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 30px', fontSize: '1rem' }}>
                        <Save size={20} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>

            </section>
        </div>
    );
}
