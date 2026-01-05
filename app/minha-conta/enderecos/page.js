"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { MapPin, Edit, Plus, X, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

function EnderecosContent() {
    // 1. Core Hooks
    const { user, updateUserData, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromCheckout = searchParams.get('from') === 'checkout';

    // 2. Data State
    const [addresses, setAddresses] = useState([]);

    // 3. UI State
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // 4. Form State
    const [formData, setFormData] = useState({
        name: '', street: '', number: '', comp: '', city: '', zip: '', priority: false
    });

    // 5. Refs for Logic Control
    const initialAutoOpenDone = useRef(false);

    // 6. Auth Protection & Data Sync
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && user.addresses) {
            // DEEP COMPARE: Only update if strictly different to prevent loops
            const currentStr = JSON.stringify(addresses);
            const newStr = JSON.stringify(user.addresses);
            if (currentStr !== newStr) {
                setAddresses(user.addresses);
            }
        }
    }, [user, addresses]);

    // 7. Auto-Open Logic (Once per mount)
    useEffect(() => {
        if (fromCheckout && !loading && user && !initialAutoOpenDone.current) {
            if (addresses.length === 0) {
                openNewModal();
                initialAutoOpenDone.current = true;
            }
        }
    }, [fromCheckout, loading, user, addresses.length]);

    // 8. Helper Functions
    const showToastMsg = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const resetForm = () => {
        setFormData({ name: '', street: '', number: '', comp: '', city: '', zip: '', priority: false });
        setIsEditing(false);
        setEditingId(null);
        setShowDeleteConfirm(false);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const openNewModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (addr) => {
        setFormData({
            name: addr.name, street: addr.street, number: addr.number,
            comp: addr.comp || '', city: addr.city, zip: addr.zip, priority: addr.priority
        });
        setEditingId(addr.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    // 9. Core Actions (Save / Delete)
    const handleSave = (e) => {
        e.preventDefault();

        // Clone current list
        let updatedList = [...addresses];

        if (isEditing) {
            updatedList = updatedList.map(addr => {
                if (addr.id === editingId) return { ...addr, ...formData };
                return addr;
            });
        } else {
            const newAddress = { id: Date.now(), ...formData };
            updatedList.push(newAddress);
        }

        // Priority Logic
        if (formData.priority) {
            // If setting as priority, unset all others
            updatedList = updatedList.map(addr => ({ ...addr, priority: false }));

            // Find the one we just edited/added and make it true
            const targetId = isEditing ? editingId : updatedList[updatedList.length - 1].id;
            const targetIndex = updatedList.findIndex(a => a.id === targetId);
            if (targetIndex !== -1) updatedList[targetIndex].priority = true;
        }
        else if (updatedList.length === 1) {
            // Force priority if it's the only one
            updatedList[0].priority = true;
        }

        // Optimistic Update
        setAddresses(updatedList);
        closeModal(); // Close immediately for responsiveness
        showToastMsg("Processando...", "success");

        // Server Sync
        updateUserData({ addresses: updatedList })
            .then(success => {
                if (success) {
                    showToastMsg("Endereço salvo com sucesso!");
                } else {
                    // Revert on failure (could improve by keeping prev state, but simple for now)
                    showToastMsg("Erro ao salvar no servidor.", "error");
                }
            })
            .catch(() => {
                showToastMsg("Erro de conexão.", "error");
            });
    };

    const handleDelete = () => {
        // Final check to prevent deleting last address
        if (addresses.length <= 1) {
            showToastMsg("Você não pode excluir o único endereço.", "error");
            // In case modal is open:
            setToast({ show: true, message: 'Last address error', type: 'last-address-error' });
            return;
        }

        const isDeletingPrimary = addresses.find(a => a.id === editingId)?.priority;
        let updatedList = addresses.filter(a => a.id !== editingId);

        if (isDeletingPrimary && updatedList.length > 0) {
            updatedList[0].priority = true;
        }

        setAddresses(updatedList);
        updateUserData({ addresses: updatedList });

        showToastMsg("Endereço excluído.");
        closeModal();
    };

    const requestDelete = () => {
        if (addresses.length <= 1) {
            // Special White Balloon Alert Logic
            setToast({ show: true, message: 'Last address error', type: 'last-address-error' });
            return;
        }
        setShowDeleteConfirm(true);
    };


    if (loading || !user) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando...</div>;

    return (
        <div>
            {/* Header / CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#333' }}>Meus Endereços</h2>
                <button className="btn-cta" onClick={openNewModal} style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Plus size={16} /> Novo Endereço
                </button>
            </div>

            {/* WHITE BALLOON ALERT (SPECIAL REQUEST) */}
            {toast.show && toast.type === 'last-address-error' && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    zIndex: 2000, textAlign: 'center', maxWidth: '300px', animation: 'floatIn 0.3s ease-out'
                }}>
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ background: '#f5f5f5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <MapPin size={30} color="#333" />
                        </div>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#333' }}>Não é possível excluir!</h3>
                    <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
                        Você precisa ter pelo menos um endereço cadastrado para realizar suas compras.
                    </p>
                    <button onClick={() => setToast({ show: false, message: '', type: '' })} style={{
                        background: '#333', color: 'white', border: 'none', padding: '10px 20px',
                        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%'
                    }}>Entendi</button>
                    {/* Invisible overlay for balloon click-out if needed, but button is clear */}
                </div>
            )}


            {/* LIST */}
            {addresses.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '20px', border: '1px dashed #ddd'
                }}>
                    <div style={{ background: '#fff5e6', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                        <MapPin size={32} color="var(--primary-orange)" />
                    </div>
                    <h3 style={{ color: '#444', marginBottom: '8px' }}>Nenhum endereço cadastrado</h3>
                    <p style={{ color: '#777', marginBottom: '20px', maxWidth: '300px', margin: '0 auto 20px' }}>
                        Cadastre seu endereço para que possamos entregar seus produtos com segurança.
                    </p>
                    <button className="btn-cta" onClick={openNewModal}>
                        + Cadastrar Endereço
                    </button>
                </div>
            ) : (
                <div id="address-list-container" style={{ display: 'grid', gap: '15px' }}>
                    {addresses.map(addr => (
                        <div key={addr.id} className={`address-card ${addr.priority ? 'priority-card' : ''}`}>
                            {addr.priority && <div className="priority-tag">Principal</div>}
                            <div className="address-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={20} color="var(--primary-orange)" />
                                    <h4>{addr.name}</h4>
                                </div>
                                <div className="actions">
                                    <button className="action-btn" onClick={() => openEditModal(addr)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }} title="Editar">
                                        <Edit size={18} />
                                    </button>
                                </div>
                            </div>
                            <p style={{ marginBottom: '5px' }}>{addr.street}, {addr.number} {addr.comp && `- ${addr.comp}`}</p>
                            <p style={{ marginBottom: '5px' }}>{addr.city}</p>
                            <p style={{ color: '#999', fontSize: '0.9rem' }}>CEP: {addr.zip}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={handleOverlayClick} style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal" style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button className="close-modal" onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>

                        <div className="modal-header" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>{isEditing ? 'Editar Endereço' : 'Novo Endereço'}</h3>
                        </div>

                        {!showDeleteConfirm ? (
                            <form onSubmit={handleSave}>
                                <div className="form-group"><label>Nome do Endereço</label>
                                    <input type="text" className="form-control" placeholder="Ex: Minha Casa" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                                    <div className="form-group" style={{ flex: 2 }}><label>Rua / Avenida</label>
                                        <input type="text" className="form-control" required value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}><label>Número</label>
                                        <input type="text" className="form-control" required value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group"><label>Complemento</label>
                                    <input type="text" className="form-control" value={formData.comp} onChange={e => setFormData({ ...formData, comp: e.target.value })} />
                                </div>
                                <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                                    <div className="form-group" style={{ flex: 1 }}><label>Cidade - UF</label>
                                        <input type="text" className="form-control" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}><label>CEP</label>
                                        <input type="text" className="form-control" required value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                                    <input type="checkbox" id="isPriority" checked={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.checked })} style={{ width: 'auto', margin: 0 }} />
                                    <label htmlFor="isPriority" style={{ margin: 0, cursor: 'pointer' }}>Definir como endereço principal</label>
                                </div>
                                <button type="submit" className="btn-cta btn-block" style={{ marginTop: '20px', width: '100%' }}>Salvar Endereço</button>

                                {isEditing && (
                                    <button type="button" onClick={requestDelete} style={{ marginTop: '15px', width: '100%', background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Trash2 size={16} /> Excluir Endereço
                                    </button>
                                )}
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ background: '#ffebee', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <AlertTriangle size={32} color="#c62828" />
                                </div>
                                <h4 style={{ color: '#c62828', marginBottom: '10px' }}>Tem certeza?</h4>
                                <p style={{ color: '#666', marginBottom: '30px' }}>Você está prestes a excluir este endereço permanentemente. Essa ação não pode ser desfeita.</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
                                    <button type="button" className="btn-cta" style={{ flex: 1, background: '#c62828', borderColor: '#c62828' }} onClick={handleDelete}>Sim, Excluir</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast.show && toast.type !== 'last-address-error' && (
                <div className={`toast show ${toast.type === 'error' ? 'error' : ''}`}>
                    {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}

export default function EnderecosPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <EnderecosContent />
        </Suspense>
    );
}
