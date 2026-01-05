"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, GripVertical, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ImageCropperModal from '../components/ImageCropperModal';

export default function BannersAdminPage() {
    const router = useRouter();
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]); // Store products for selection
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Edit State
    const [editingBanner, setEditingBanner] = useState(null); // id of banner or 'new'

    // Form State
    const [tempBannerData, setTempBannerData] = useState({});
    const [linkMode, setLinkMode] = useState('category'); // 'category' | 'product' | 'custom'
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');

    // Crop State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

    // Categories Configuration
    const CATEGORIES = {
        "Livros": "livros",
        "HQs & Mangás": "hqs-mangas",
        "CDs de Música": "cds-de-musica",
        "VHS": "vhs",
        "DVDs & Blu-Ray": "dvds-blu-ray",
        "Video Game": {
            slug: "video-game",
            subs: ["Nintendo", "Xbox", "Sony", "Sega", "PC"]
        },
        "Card Game": {
            slug: "card-game",
            subs: ["Pokemon TCG", "Yu-Gi-Oh!", "Magic"]
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [resBanners, resProducts] = await Promise.all([
                fetch('/api/banners'),
                fetch('/api/products')
            ]);

            setBanners(await resBanners.json());
            setProducts(await resProducts.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        if (banners.length >= 6) {
            alert("Limite máximo de 6 banners atingido. Remova um banner existente para criar um novo.");
            return;
        }

        setEditingBanner('new');
        setLinkMode('category');
        setSelectedCategory('');
        setSelectedSubCategory('');
        setSelectedProductId('');

        setTempBannerData({
            title: '',
            desc: '',
            link: '',
            duration: 5,
            image: '',
            bgColor: '#333333'
        });
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner.id);
        setTempBannerData({ ...banner });

        // Try to reverse-engineer mode from existing link
        if (banner.link && banner.link.startsWith('/produto/')) {
            setLinkMode('product');
            setSelectedProductId(banner.link.split('/')[2] || '');
        } else if (banner.link && banner.link.startsWith('/categoria/')) {
            setLinkMode('category');
            // This is a bit heuristic, but sufficient for now
            // We won't pre-fill the select boxes perfectly for complex cases without more parsing logic
            // User can just reset them if they want to change the link
        } else {
            setLinkMode('custom');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja remover este banner?")) return;

        try {
            await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
            fetchData(); // Refresh both to be safe
        } catch (error) {
            alert("Erro ao deletar");
        }
    };

    // Update the actual link string whenever selection components change
    useEffect(() => {
        if (!editingBanner) return;

        let finalLink = tempBannerData.link;

        if (linkMode === 'category') {
            if (selectedCategory) {
                const catConfig = CATEGORIES[selectedCategory];
                let slug = typeof catConfig === 'object' ? catConfig.slug : catConfig;

                finalLink = `/categoria/${slug}`;
                if (selectedSubCategory && typeof catConfig === 'object') {
                    // Convert subcategory name to slug format roughly (simplistic)
                    // Matches what we did in productUtils: normalize -> slug
                    const subSlug = selectedSubCategory.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
                    finalLink += `/${subSlug}`;
                }
            }
        } else if (linkMode === 'product') {
            if (selectedProductId) {
                finalLink = `/produto/${selectedProductId}`;
            }
        }

        // Only update if changed prevents infinite loops if carefully managed, 
        // but here we just update the specific field if it differs
        if (finalLink !== tempBannerData.link && linkMode !== 'custom') {
            setTempBannerData(prev => ({ ...prev, link: finalLink }));
        }
    }, [linkMode, selectedCategory, selectedSubCategory, selectedProductId]);


    const handleSave = async () => {
        setIsSaving(true);
        try {
            const method = editingBanner === 'new' ? 'POST' : 'PUT';
            const res = await fetch('/api/banners', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tempBannerData)
            });

            if (res.ok) {
                setEditingBanner(null);
                fetchData();
            } else {
                alert("Erro ao salvar");
            }
        } catch (error) {
            alert("Erro de conexão");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageToCrop(reader.result);
            setCropModalOpen(true);
        });
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleCropComplete = async (croppedFile) => {
        setCropModalOpen(false);

        // Upload immediately
        const formData = new FormData();
        formData.append('file', croppedFile);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const json = await res.json();
            if (json.url) {
                setTempBannerData(prev => ({ ...prev, image: json.url }));
            }
        } catch (err) {
            alert("Erro no upload");
        }
    };

    const moveBanner = async (index, direction) => {
        const newBanners = [...banners];
        if (direction === 'up' && index > 0) {
            [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
        } else if (direction === 'down' && index < newBanners.length - 1) {
            [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
        } else {
            return;
        }

        // Reassign order
        const ordered = newBanners.map((b, i) => ({ ...b, order: i + 1 }));
        setBanners(ordered); // Optimistic

        await fetch('/api/banners', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ordered)
        });
    };

    if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;

    const currentCatConfig = selectedCategory ? CATEGORIES[selectedCategory] : null;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => router.push('/admin')} className="btn-outline">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={{ margin: 0 }}>Gerenciar Banners</h1>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>{banners.length} / 6 banners</span>
                    </div>
                </div>
                {!editingBanner && (
                    <button onClick={handleCreateNew} className="btn-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: banners.length >= 6 ? 0.5 : 1, cursor: banners.length >= 6 ? 'not-allowed' : 'pointer' }}>
                        <Plus size={18} /> Novo Banner
                    </button>
                )}
            </div>

            {/* List View */}
            {!editingBanner && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {banners.map((banner, index) => (
                        <div key={banner.id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginRight: '15px' }}>
                                <button onClick={() => moveBanner(index, 'up')} disabled={index === 0} style={{ border: 'none', background: 'transparent', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                                <button onClick={() => moveBanner(index, 'down')} disabled={index === banners.length - 1} style={{ border: 'none', background: 'transparent', cursor: index === banners.length - 1 ? 'default' : 'pointer', opacity: index === banners.length - 1 ? 0.3 : 1 }}>▼</button>
                            </div>

                            <div style={{ width: '120px', height: '60px', background: '#eee', borderRadius: '4px', overflow: 'hidden', marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {banner.image ? <img src={banner.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={24} color="#ccc" />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>{banner.title || <span style={{ color: '#ccc', fontStyle: 'italic' }}>Sem Título (Apenas Imagem)</span>}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{banner.link}</div>
                            </div>

                            <div style={{ marginRight: '20px', fontSize: '0.9rem', color: '#888' }}>
                                {banner.duration}s
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleEdit(banner)} style={{ padding: '8px 15px', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => handleDelete(banner.id)} style={{ padding: '8px', border: '1px solid #ffcccc', borderRadius: '4px', background: '#fff0f0', color: 'red', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Nenhum banner cadastrado.</div>}
                </div>
            )}

            {/* Edit View */}
            {editingBanner && (
                <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginBottom: '20px' }}>{editingBanner === 'new' ? 'Criar Banner' : 'Editar Banner'}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
                        {/* Image */}
                        <div>
                            <div style={{ height: '150px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', border: '2px dashed #ddd' }}>
                                {tempBannerData.image ? (
                                    <img src={tempBannerData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#999', fontSize: '0.8rem', padding: '10px' }}>
                                        <ImageIcon size={32} /><br />
                                        1920x600 (Wide)
                                    </div>
                                )}
                            </div>
                            <input type="file" id="bannerUpload" style={{ display: 'none' }} onChange={handleImageSelect} accept="image/*" />
                            <label htmlFor="bannerUpload" className="btn-outline" style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}>Escolher Imagem</label>
                        </div>

                        {/* Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Título (Opcional)</label>
                                <input
                                    value={tempBannerData.title}
                                    onChange={e => setTempBannerData({ ...tempBannerData, title: e.target.value })}
                                    placeholder="Ex: Promoção de Natal"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Descrição (Opcional)</label>
                                <input
                                    value={tempBannerData.desc}
                                    onChange={e => setTempBannerData({ ...tempBannerData, desc: e.target.value })}
                                    placeholder="Ex: Descontos de até 50%"
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                />
                            </div>

                            {/* Link Type Selector */}
                            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>Destino do Banner</label>

                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <input type="radio" name="linkMode" checked={linkMode === 'category'} onChange={() => setLinkMode('category')} />
                                        Categoria
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <input type="radio" name="linkMode" checked={linkMode === 'product'} onChange={() => setLinkMode('product')} />
                                        Produto Específico
                                    </label>
                                </div>

                                {linkMode === 'category' && (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <select
                                            value={selectedCategory}
                                            onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory(''); }}
                                            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        >
                                            <option value="">Selecione uma Categoria...</option>
                                            {Object.keys(CATEGORIES).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>

                                        {currentCatConfig && typeof currentCatConfig === 'object' && currentCatConfig.subs && (
                                            <select
                                                value={selectedSubCategory}
                                                onChange={e => setSelectedSubCategory(e.target.value)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                            >
                                                <option value="">(Opcional) Subcategoria...</option>
                                                {currentCatConfig.subs.map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )}

                                {linkMode === 'product' && (
                                    <select
                                        value={selectedProductId}
                                        onChange={e => setSelectedProductId(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    >
                                        <option value="">Selecione um Produto...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nome} - R$ {p.preco}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                                    Link Gerado: <strong>{tempBannerData.link || "Nenhum"}</strong>
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Duração: {tempBannerData.duration}s</label>
                                <input
                                    type="range" min="3" max="20"
                                    value={tempBannerData.duration}
                                    onChange={e => setTempBannerData({ ...tempBannerData, duration: parseInt(e.target.value) })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button onClick={() => setEditingBanner(null)} style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                        <button onClick={handleSave} className="btn-cta" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> {isSaving ? 'Salvando...' : 'Salvar Banner'}
                        </button>
                    </div>
                </div>
            )}

            {cropModalOpen && (
                <ImageCropperModal
                    imageSrc={imageToCrop}
                    onClose={() => { setCropModalOpen(false); setImageToCrop(null); }}
                    onCropComplete={handleCropComplete}
                    aspect={1920 / 600} // Banner aspect ratio (3.2:1)
                />
            )}
        </div>
    );
}
