"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CarteiraPage() {
    const { user, updateUserData, loading } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [cards, setCards] = useState([]);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: '',
        priority: false
    });

    useEffect(() => {
        if (user && user.cards) {
            // Simple deep compare to avoid unnecessary re-renders
            if (JSON.stringify(user.cards) !== JSON.stringify(cards)) {
                setCards(user.cards);
            }
        }
    }, [user]);

    const showToastMsg = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSave = (e) => {
        e.preventDefault();

        let updatedList = [...cards];

        if (isEditing) {
            updatedList = updatedList.map(c => {
                if (c.id === editingId) {
                    return { ...c, ...formData, number: formData.number.slice(-4) };
                }
                return c;
            });
        } else {
            const last4 = formData.number.slice(-4);
            const newCard = {
                id: Date.now(),
                name: formData.name.toUpperCase(),
                number: last4,
                brand: "MasterCard",
                expiry: formData.expiry,
                gradient: Math.random() > 0.5 ? "gradient-1" : "gradient-2",
                priority: false
            };
            updatedList.push(newCard);
        }

        if (formData.priority) {
            updatedList = updatedList.map(c => ({
                ...c,
                priority: (isEditing ? c.id === editingId : c.id === updatedList[updatedList.length - 1].id)
            }));
        } else if (!isEditing && cards.length === 0) {
            updatedList[0].priority = true;
        }

        setCards(updatedList);

        updateUserData({ cards: updatedList })
            .then(success => {
                if (success) {
                    showToastMsg("Cartão salvo com sucesso!");
                    closeModal();
                } else {
                    showToastMsg("Erro ao salvar cartão.", "error");
                }
            })
            .catch(err => {
                console.error(err);
                showToastMsg("Erro inesperado.", "error");
            });
    };

    const openNewModal = () => {
        setFormData({ name: '', number: '', expiry: '', cvv: '', priority: false });
        setIsEditing(false);
        setEditingId(null);
        setShowModal(true);
    };

    const openEditModal = (card) => {
        setFormData({
            name: card.name,
            number: card.number,
            expiry: card.expiry,
            cvv: '***',
            priority: card.priority
        });
        setEditingId(card.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: '', number: '', expiry: '', cvv: '', priority: false });
        setShowDeleteConfirm(false);
    };

    // Triggered by "Excluir" button in Edit Modal
    const handleDeleteRequest = () => {
        if (cards.length <= 1) {
            showToastMsg("Você não pode excluir seu único cartão.", "error");
            return;
        }
        setShowDeleteConfirm(true);
    };

    // Confirmed Action
    const confirmDelete = () => {
        const isDeletingPrimary = cards.find(c => c.id === editingId)?.priority;
        let updatedList = cards.filter(c => c.id !== editingId);

        if (isDeletingPrimary && updatedList.length > 0) {
            updatedList[0].priority = true; // Auto-promote first remaining
        }

        setCards(updatedList);

        updateUserData({ cards: updatedList })
            .then(success => {
                if (success) {
                    showToastMsg("Cartão excluído com sucesso.");
                    closeModal();
                } else {
                    showToastMsg("Erro ao excluir cartão.", "error");
                }
            });
    };

    if (loading || !user) return <div style={{ padding: '20px' }}>Carregando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Minha Carteira</h2>
                <button className="btn-buy" onClick={openNewModal} style={{ width: 'auto' }}>+ Novo Cartão</button>
            </div>

            <div className="wallet-grid">
                {cards.map(card => (
                    <div key={card.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => openEditModal(card)}>
                        {card.priority && (
                            <div className="priority-tag" style={{ position: 'absolute', top: '-10px', left: '10px', zIndex: 10 }}>
                                Principal
                            </div>
                        )}

                        <div
                            className={`credit-card-ui ${card.gradient}`}
                            style={{
                                position: 'relative',
                                border: card.priority ? '2px solid var(--primary-orange)' : 'none',
                                boxShadow: card.priority ? '0 0 15px rgba(255,101,0,0.2)' : '0 10px 20px rgba(0,0,0,0.2)',
                                transform: 'none'
                            }}
                        >
                            <div className="card-logo">{card.brand}</div>
                            <div className="card-chip" style={{ width: '40px', height: '30px', background: '#e0e0e0', borderRadius: '4px' }}></div>
                            <div className="card-number">**** **** **** {card.number}</div>
                            <div className="card-info">
                                <span>{card.name}</span>
                                <span>{card.expiry}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" style={{ display: 'flex', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{isEditing ? 'Detalhes do Cartão' : 'Novo Cartão'}</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        {!showDeleteConfirm ? (
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label>Nome no Cartão</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: JOAO P PIPO"
                                        required
                                        className="form-control"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        readOnly={isEditing}
                                        style={isEditing ? { background: '#f9f9f9', color: '#777' } : {}}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Número do Cartão</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength="16"
                                        required
                                        className="form-control"
                                        value={formData.number}
                                        onChange={e => setFormData({ ...formData, number: e.target.value })}
                                        readOnly={isEditing}
                                        style={isEditing ? { background: '#f9f9f9', color: '#777' } : {}}
                                    />
                                </div>

                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                                    <input
                                        type="checkbox"
                                        id="isCardPriority"
                                        checked={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.checked })}
                                        style={{ width: 'auto', margin: 0 }}
                                    />
                                    <label htmlFor="isCardPriority" style={{ margin: 0, cursor: 'pointer' }}>Definir como cartão principal</label>
                                </div>

                                <button type="submit" className="btn-cta btn-block" style={{ marginTop: '20px' }}>
                                    {isEditing ? 'Salvar Alterações' : 'Salvar Cartão'}
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteRequest}
                                        style={{
                                            marginTop: '15px',
                                            width: '100%',
                                            background: 'none',
                                            border: '1px solid #e74c3c',
                                            color: '#e74c3c',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Trash2 size={16} /> Excluir Cartão
                                    </button>
                                )}
                            </form>
                        ) : (
                            /* DELETE CONFIRMATION VIEW INSIDE MODAL */
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ background: '#ffebee', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <AlertTriangle size={32} color="#c62828" />
                                </div>
                                <h4 style={{ color: '#c62828', marginBottom: '10px' }}>Tem certeza?</h4>
                                <p style={{ color: '#666', marginBottom: '30px' }}>
                                    Você está prestes a excluir este cartão permanentemente. Essa ação não pode ser desfeita.
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        className="btn-outline btn-block"
                                        style={{ flex: 1 }}
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-cta btn-block"
                                        style={{ flex: 1, background: '#c62828', borderColor: '#c62828' }}
                                        onClick={confirmDelete}
                                    >
                                        Sim, Excluir
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toast.show && (
                <div className={`toast show ${toast.type === 'error' ? 'error' : ''}`}>
                    {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}
