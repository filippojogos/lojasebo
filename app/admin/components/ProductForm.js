"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

export default function ProductForm({ initialData, isEdit }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        precoOriginal: '',
        preco: '',
        categoria: '',
        subcategoria: '',
        imagem: '',
        tag: '',
        descricao: '',
        sku: '',
        estoque: '',
        rating: 5,
        ...initialData
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            preco: parseFloat(formData.preco),
            precoOriginal: parseFloat(formData.precoOriginal || 0),
            estoque: parseInt(formData.estoque),
            rating: parseFloat(formData.rating)
        };

        try {
            const url = isEdit ? `/api/products/${initialData.id}` : '/api/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(isEdit ? 'Produto atualizado!' : 'Produto criado!');
                router.push('/admin/produtos');
                router.refresh();
            } else {
                alert('Erro ao salvar produto');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Nome do Produto</label>
                    <input name="nome" value={formData.nome} onChange={handleChange} style={inputStyle} required />
                </div>

                <div>
                    <label style={labelStyle}>Preço (R$)</label>
                    <input type="number" step="0.01" name="preco" value={formData.preco} onChange={handleChange} style={inputStyle} required />
                </div>

                <div>
                    <label style={labelStyle}>Preço Original (De)</label>
                    <input type="number" step="0.01" name="precoOriginal" value={formData.precoOriginal} onChange={handleChange} style={inputStyle} />
                </div>

                <div>
                    <label style={labelStyle}>Categoria</label>
                    <select name="categoria" value={formData.categoria} onChange={handleChange} style={inputStyle} required>
                        <option value="">Selecione...</option>
                        <option value="Livros">Livros</option>
                        <option value="Video Game">Video Game</option>
                        <option value="CDs de Música">CDs de Música</option>
                        <option value="HQs & Mangás">HQs & Mangás</option>
                        <option value="DVDs & Blu-Ray">DVDs & Blu-Ray</option>
                        <option value="Card Game">Card Game</option>
                        <option value="VHS">VHS</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Subcategoria</label>
                    <input name="subcategoria" value={formData.subcategoria} onChange={handleChange} style={inputStyle} placeholder="Ex: Sony, Rock, Mangá..." />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>URL da Imagem</label>
                    <input name="imagem" value={formData.imagem} onChange={handleChange} style={inputStyle} placeholder="https://..." required />
                    {formData.imagem && <img src={formData.imagem} alt="Preview" style={{ height: '100px', marginTop: '10px', objectFit: 'contain' }} />}
                </div>

                <div>
                    <label style={labelStyle}>SKU</label>
                    <input name="sku" value={formData.sku} onChange={handleChange} style={inputStyle} required />
                </div>

                <div>
                    <label style={labelStyle}>Estoque</label>
                    <input type="number" name="estoque" value={formData.estoque} onChange={handleChange} style={inputStyle} required />
                </div>

                <div>
                    <label style={labelStyle}>Tag (Opcional)</label>
                    <input name="tag" value={formData.tag} onChange={handleChange} style={inputStyle} placeholder="Ex: Oferta, Raro..." />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Descrição</label>
                    <textarea name="descricao" value={formData.descricao} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} required />
                </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => router.back()} className="btn-outline">
                    Cancelar
                </button>
                <button type="submit" className="btn-cta" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
            </div>
        </form>
    );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' };
