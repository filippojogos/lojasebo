"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Upload, X } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal';

export default function ProductForm({ initialData, isEdit }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Crop State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [currentImageToCrop, setCurrentImageToCrop] = useState(null);
    const [pendingFiles, setPendingFiles] = useState([]); // Queue for multiple files
    const [formData, setFormData] = useState({
        nome: '',
        preco: '',
        categoria: '',
        subcategoria: '', // Still keeping it for internal structure if needed, or we can repurpose
        imagem: '', // Main image
        galeria: [], // Extra images
        descricao: '',
        estoque: '',
        weight: '0.3',
        width: '15',
        height: '5',
        depth: '20',
        // Removed: SKU, Tag, PrecoOriginal
        ...initialData
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // 1. Intercepta seleção de arquivo
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Se for upload múltiplo, vamos processar o primeiro agora e guardar os outros se quiser (mas vamos simplificar: focar sempre no primeiro para Crop)
        // Se usuário selecionar múltiplos, vamos assumir que quer Crop no primeiro.
        // Melhor: vamos processar um por um se quiser.
        // Implementação Simplificada: Pega o primeiro arquivo para crop.

        const file = files[0];
        setCurrentImageToCrop(null); // Reset

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setCurrentImageToCrop(reader.result);
            setPendingFiles([file]); // Store file access
            setCropModalOpen(true);
        });
        reader.readAsDataURL(file);

        // Limpa o input
        e.target.value = '';
    };

    // Helper to compress and convert to Base64
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG 0.8
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    // 2. Recebe a imagem cortada, converte para Base64 (DB Storage)
    const handleCropComplete = async (croppedFile) => {
        setCropModalOpen(false);
        setUploading(true);
        setCurrentImageToCrop(null);

        try {
            // Se o arquivo já vier como blob/file, converte. Se vier como base64 string, usa direto.
            let base64Image;
            if (typeof croppedFile === 'string') {
                base64Image = croppedFile;
            } else {
                base64Image = await compressImage(croppedFile);
            }

            setFormData(prev => {
                const currentGaleria = prev.galeria || [];
                // Se não tem imagem principal, a nova vira a principal. Se já tem, adiciona na galeria.
                // Correção: Adiciona ao FINAL da galeria, mas se for a primeira, define como imagem principal também.
                const newGaleria = [...currentGaleria, base64Image];

                // Se imagem principal estiver vazia, define esta como principal
                const newImagem = prev.imagem || base64Image;

                return {
                    ...prev,
                    imagem: newImagem,
                    galeria: newGaleria
                };
            });
        } catch (err) {
            console.error("Image processing failed", err);
            alert("Falha ao processar imagem.");
        } finally {
            setUploading(false);
        }
    };

    const handleCropCancel = () => {
        setCropModalOpen(false);
        setCurrentImageToCrop(null);
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const newGaleria = prev.galeria.filter((_, i) => i !== index);
            return {
                ...prev,
                imagem: newGaleria.length > 0 ? newGaleria[0] : '', // Adjust count accordingly
                galeria: newGaleria
            };
        });
    };

    const moveImage = (index, direction) => {
        setFormData(prev => {
            const newGaleria = [...prev.galeria];
            if (direction === 'left' && index > 0) {
                [newGaleria[index], newGaleria[index - 1]] = [newGaleria[index - 1], newGaleria[index]];
            } else if (direction === 'right' && index < newGaleria.length - 1) {
                [newGaleria[index], newGaleria[index + 1]] = [newGaleria[index + 1], newGaleria[index]];
            }
            return { ...prev, galeria: newGaleria, imagem: newGaleria[0] }; // Force 1st as cover or keep logic? User might want specific cover. Let's keep cover independent or sync? Usually 1st is cover.
        });
    };

    const setCover = (url) => {
        setFormData(prev => ({ ...prev, imagem: url }));
    }

    const categories = [
        "Livros", "HQ´s", "Mangas",
        "CD´s", "VHS", "DVD´s", "Blue-Ray",
        "Nintendo", "XBOX", "Sony", "Sega", "PC",
        "Pokemon TCG", "Yu-Gi-Oh!", "Magic"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Map flat selection to Category/Subcategory Structure
        let finalCategory = formData.categoria;
        let finalSubCategory = "";

        const videoGameSubs = ["Nintendo", "XBOX", "Sony", "Sega", "PC"];
        const cardGameSubs = ["Pokemon TCG", "Yu-Gi-Oh!", "Magic"];

        if (videoGameSubs.includes(formData.categoria)) {
            finalCategory = "Video Game";
            finalSubCategory = formData.categoria;
        } else if (cardGameSubs.includes(formData.categoria)) {
            finalCategory = "Card Game";
            finalSubCategory = formData.categoria;
        }

        const payload = {
            ...formData,
            categoria: finalCategory,
            subcategoria: finalSubCategory,
            preco: parseFloat(String(formData.preco).replace(',', '.')) || 0,
            estoque: parseInt(formData.estoque) || 0,
            weight: parseFloat(formData.weight) || 0.3,
            width: parseFloat(formData.width) || 15,
            height: parseFloat(formData.height) || 5,
            depth: parseFloat(formData.depth) || 20,
            sku: initialData?.sku || null,
            precoOriginal: parseFloat(initialData?.precoOriginal) || null,
            tag: initialData?.tag || null
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
                router.push('/x9z4p2-k7m3v5q8-w2y1n6j4/produtos');
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
        <form onSubmit={handleSubmit} style={{ background: '#fff', maxWidth: '1400px', margin: '20px auto', fontFamily: 'sans-serif', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#555', fontSize: '1.2rem' }}>
                    {isEdit ? `Editando: ${initialData.nome}` : 'Novo Produto'}
                </div>
                <button type="submit" className="btn-cta" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 25px' }}>
                    <Save size={18} /> {loading ? 'Salvando...' : 'SALVAR'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '40px', alignItems: 'start' }}>

                {/* Visual Editor - Left: Image */}
                <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '12px', border: '2px dashed #ddd' }}>

                    {/* Main Preview */}
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                        {formData.imagem ? (
                            <img src={formData.imagem} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ color: '#ccc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <ImageIcon size={48} />
                                <span>Capa do Produto</span>
                            </div>
                        )}
                    </div>

                    {/* Gallery Thumbs */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {formData.galeria && formData.galeria.map((url, idx) => (
                            <div key={idx} style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ height: '80px', borderRadius: '4px', overflow: 'hidden', position: 'relative', border: url === formData.imagem ? '3px solid #8e44ad' : '1px solid #ddd' }}>
                                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => setCover(url)} />
                                    <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>X</button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button type="button" onClick={() => moveImage(idx, 'left')} disabled={idx === 0} style={{ flex: 1, border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer', fontSize: '10px' }}>&lt;</button>
                                    <button type="button" onClick={() => setCover(url)} style={{ flex: 2, border: '1px solid #ddd', background: url === formData.imagem ? '#8e44ad' : 'white', color: url === formData.imagem ? 'white' : 'black', cursor: 'pointer', fontSize: '10px' }}>Capa</button>
                                    <button type="button" onClick={() => moveImage(idx, 'right')} disabled={idx === formData.galeria.length - 1} style={{ flex: 1, border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer', fontSize: '10px' }}>&gt;</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="btn-outline" style={{ display: 'block', textAlign: 'center', cursor: 'pointer', width: '100%', background: uploading ? '#eee' : 'white' }}>
                            {uploading ? 'Enviando...' : '📷 Adicionar Fotos (Max 6)'}
                        </label>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px', lineHeight: '1.4' }}>
                            <strong>Regras da Imagem:</strong><br />
                            - Fundo da imagem deve ser <strong>CLEAN</strong> (limpo/neutro).<br />
                            - Fundo da imagem deve ser <strong>CLEAN</strong> (limpo/neutro).<br />
                            - Máxima qualidade possível (não tremida).<br />
                            - <strong>Formato Padrão: 4:5 (ex: 800x1000px)</strong> - O sistema ajustará o corte automaticamente.
                        </div>
                    </div>
                </div>

                {/* Visual Editor - Right: Info */}
                <div>
                    {/* Name */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ ...labelStyle, fontSize: '0.9rem', color: '#999', textTransform: 'uppercase' }}>Nome do Produto</label>
                        <input
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            style={{ ...inputStyle, fontSize: '1.8rem', fontWeight: 'bold', padding: '15px', borderColor: '#eee', backgroundColor: '#fff' }}
                            placeholder="Ex: PlayStation 2 Slim..."
                            required
                        />
                    </div>

                    {/* Metadata Row */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Categoria</label>
                            <select name="categoria" value={formData.categoria} onChange={handleChange} style={inputStyle} required>
                                <option value="">Selecione...</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="preco"
                                value={formData.preco}
                                onChange={handleChange}
                                style={{ ...inputStyle, fontWeight: 'bold', color: 'var(--deep-purple)' }}
                                required
                            />
                        </div>

                        <div style={{ width: '100px' }}>
                            <label style={labelStyle}>Estoque</label>
                            <input
                                type="number"
                                name="estoque"
                                value={formData.estoque}
                                onChange={handleChange}
                                style={{ ...inputStyle, textAlign: 'center', fontWeight: 'bold' }}
                                required
                            />
                        </div>
                    </div>



                    {/* Shipping Dimensions Row */}
                    <div style={{ background: '#f0f4f8', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <label style={labelStyle}>Peso (kg)</label>
                            <input type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <label style={labelStyle}>Largura (cm)</label>
                            <input type="number" name="width" value={formData.width} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <label style={labelStyle}>Altura (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <label style={labelStyle}>Profundidade (cm)</label>
                            <input type="number" name="depth" value={formData.depth} onChange={handleChange} style={inputStyle} required />
                        </div>
                    </div>

                    {/* Description Guide */}
                    <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', border: '1px solid #ffeeba' }}>
                        <strong>⚠️ Detalhes Obrigatórios na Descrição:</strong>
                        <ul style={{ paddingLeft: '20px', marginTop: '5px', marginBottom: 0 }}>
                            <li>Citar avarias: riscos, rachaduras, partes quebradas, sujeira.</li>
                            <li>Condição: Lacrado? CIB (Completo na Caixa)? Loose (Só o cartucho/console)?</li>
                            <li>Faltam itens? (Encartes, manuais, caixa original)</li>
                            <li><strong>Cartuchos:</strong> Foi aberto e testado? Mostre a foto do chip (PCB).</li>
                        </ul>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ ...labelStyle, fontSize: '1.1rem', marginBottom: '10px' }}>Sobre o Produto</label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '200px', lineHeight: '1.5', resize: 'vertical' }}
                            placeholder="Ex: Console limpo e higienizado. Leitor funcionando 100%. Acompanha 1 controle original..."
                            required
                        />
                    </div>
                </div>
            </div>
            {
                cropModalOpen && (
                    <ImageCropperModal
                        imageSrc={currentImageToCrop}
                        originalFile={pendingFiles[0]}
                        onClose={handleCropCancel}
                        onCropComplete={handleCropComplete}
                    />
                )
            }
        </form >
    );
}

const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '0.85rem' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', transition: 'border 0.2s' };
