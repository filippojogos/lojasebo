"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Edit, Plus, X, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function EnderecosPage() {
    const { user, updateUserData } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Custom Confirm Logic
    const [addresses, setAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        number: '',
        comp: '',
        city: '',
        zip: '',
        priority: false
    });

    useEffect(() => {
        if (user && user.addresses) {
            setAddresses(user.addresses);
        } else {
            const initialData = [
                { id: 1, name: "Minha Casa", street: "Rua Vergueiro", number: "1000", comp: "Apto 42", zip: "01504-000", city: "São Paulo - SP", priority: true },
                { id: 2, name: "Trabalho", street: "Av. Paulista", number: "2000", comp: "CJ 1010", zip: "01311-000", city: "São Paulo - SP", priority: false }
            ];
            if (user && !user.addresses) {
                updateUserData({ addresses: initialData });
            } else if (!user) {
                setAddresses(initialData);
            }
        }
    }, [user]);

    const showToastMsg = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSave = (e) => {
        e.preventDefault();

        let updatedList = [...addresses];

        if (isEditing) {
            updatedList = updatedList.map(addr => {
                if (addr.id === editingId) {
                    return { ...addr, ...formData };
                }
                return addr;
            });
        } else {
            const newAddress = {
                id: Date.now(),
                ...formData
            };
            updatedList.push(newAddress);
        }

        // Handle Priority Logic - Ensure only one priority exists
        if (formData.priority) {
            updatedList = updatedList.map(addr => ({
                ...addr,
                priority: false // Reset all others
            }));

            // Set the current one as priority
            const index = isEditing
                ? updatedList.findIndex(a => a.id === editingId)
                : updatedList.length - 1;

            if (index !== -1) updatedList[index].priority = true;
        } else if (!isEditing && addresses.length === 0) {
            // First address ever is always priority
            updatedList[0].priority = true;
        } else if (isEditing && addresses.length === 1) {
            // Can't uncheck priority if it's the only one
            updatedList[0].priority = true;
        }

        setAddresses(updatedList);
        if (user) updateUserData({ addresses: updatedList });

        showToastMsg("Endereço salvo com sucesso!");
        closeModal();
    };

    const openEditModal = (addr) => {
        setFormData({
            name: addr.name,
            street: addr.street,
            number: addr.number,
            comp: addr.comp || '',
            city: addr.city,
            zip: addr.zip,
            priority: addr.priority
        });
        setEditingId(addr.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const openNewModal = () => {
        setFormData({ name: '', street: '', number: '', comp: '', city: '', zip: '', priority: false });
        setIsEditing(false);
        setEditingId(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: '', street: '', number: '', comp: '', city: '', zip: '', priority: false });
        setShowDeleteConfirm(false);
    };

    // Triggered by "Excluir" button in Edit Modal
    const handleDeleteRequest = () => {
        if (addresses.length <= 1) {
            // Close edit modal first to show the alert clearly
            setShowModal(false);
            setToast({ show: true, message: 'Last address error', type: 'last-address-error' });
            return;
        }
        setShowDeleteConfirm(true); // Show custom confirmation
    };

    // Confirmed Action
    const confirmDelete = () => {
        const isDeletingPrimary = addresses.find(a => a.id === editingId)?.priority;
        let updatedList = addresses.filter(addr => addr.id !== editingId);

        if (isDeletingPrimary && updatedList.length > 0) {
            updatedList[0].priority = true; // Auto-promote first remaining
        }

        setAddresses(updatedList);
        if (user) updateUserData({ addresses: updatedList });

        showToastMsg("Endereço excluído com sucesso.");
        closeModal(); // Closes both modals
    };

    return (
        <div>
            <button className="btn-cta" onClick={openNewModal} style={{ padding: '8px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Plus size={16} /> Novo Endereço
            </button>


            {/* WHITE BALLOON ALERT FOR LAST ADDRESS */}
            {
                toast.show && toast.type === 'last-address-error' && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        padding: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        zIndex: 2000,
                        textAlign: 'center',
                        maxWidth: '300px',
                        animation: 'floatIn 0.3s ease-out'
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
                        <button
                            onClick={() => setToast({ show: false, message: '', type: '' })}
                            style={{
                                background: '#333',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                width: '100%'
                            }}
                        >
                            Entendi
                        </button>
                    </div>
                )
            }

            <div id="address-list-container">
                {addresses.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum endereço cadastrado.</p>}

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

            {/* EDIT/CREATE MODAL */}
            {
                showModal && (
                    <div className="modal-overlay" style={{ zIndex: 1000 }}>
                        <div className="modal">
                            <button className="close-modal" onClick={closeModal}><X size={24} /></button>
                            <div className="modal-header">
                                <h3>{isEditing ? 'Editar Endereço' : 'Novo Endereço'}</h3>
                            </div>

                            {/* If Delete Confirmation is showing, hide form content or overlay it? 
                            Better to overlay a smaller modal on top or replace content. 
                            Replacing content is cleaner for mobile.
                        */}
                            {!showDeleteConfirm ? (
                                <form onSubmit={handleSave}>
                                    <div className="form-group">
                                        <label>Nome do Endereço (ex: Casa, Trabalho)</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Minha Casa"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                                        <div className="form-group" style={{ flex: 2 }}>
                                            <label>Rua / Avenida</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.street}
                                                onChange={e => setFormData({ ...formData, street: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Número</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.number}
                                                onChange={e => setFormData({ ...formData, number: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Complemento</label>
                                        <input
                                            type="text"
                                            value={formData.comp}
                                            onChange={e => setFormData({ ...formData, comp: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Cidade - UF</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>CEP</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.zip}
                                                onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                                        <input
                                            type="checkbox"
                                            id="isPriority"
                                            checked={formData.priority}
                                            onChange={e => setFormData({ ...formData, priority: e.target.checked })}
                                            style={{ width: 'auto', margin: 0 }}
                                        />
                                        <label htmlFor="isPriority" style={{ margin: 0, cursor: 'pointer' }}>Definir como endereço principal</label>
                                    </div>

                                    <button type="submit" className="btn-cta btn-block" style={{ marginTop: '20px' }}>Salvar Endereço</button>

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
                                            <Trash2 size={16} /> Excluir Endereço
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
                                        Você está prestes a excluir este endereço permanentemente. Essa ação não pode ser desfeita.
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            type="button"
                                            className="btn-outline"
                                            style={{ flex: 1 }}
                                            onClick={() => setShowDeleteConfirm(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cta"
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
                )
            }

            {/* TOAST NOTIFICATION */}
            {
                toast.show && (
                    <div className={`toast show ${toast.type === 'error' ? 'error' : ''}`}>
                        {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                        <span>{toast.message}</span>
                    </div>
                )
            }
        </div >
    );
}
