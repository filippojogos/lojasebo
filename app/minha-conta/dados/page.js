"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function DadosPage() {
    const { user, updateUserData } = useAuth();
    const [showToast, setShowToast] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserData({ name: formData.name, email: formData.email, phone: formData.phone });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div>
            <h2 className="section-title">Meus Dados</h2>
            <form className="dashboard-form" onSubmit={handleSubmit}>
                <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>CPF</label>
                        <input
                            type="text"
                            value="123.456.789-00"
                            readOnly
                            style={{ background: '#f9f9f9', color: '#777', cursor: 'not-allowed' }}
                        />
                    </div>
                </div>
                <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Celular</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button type="submit" className="btn-cta">Salvar Alterações</button>

                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-dark)' }}>Alterar Senha</h3>
                    <div className="form-group">
                        <label>Senha Atual</label>
                        <input
                            type="password"
                            value={formData.currentPassword || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nova Senha</label>
                        <input
                            type="password"
                            value={formData.newPassword || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn-outline"
                        style={{ marginTop: '10px' }}
                        onClick={async () => {
                            if (!formData.currentPassword || !formData.newPassword) {
                                alert("Preencha a senha atual e a nova senha.");
                                return;
                            }
                            // Call updateUserData which calls /api/user/update
                            // Note: updateUserData in context might not handle errors well (it returns true/false), 
                            // so we rely on the backend error response if possible. 
                            // But usually context catches errors. 
                            // To be safer, let's call API directly or trust context.
                            // Let's try calling updateUserData first since it handles session refresh.
                            const success = await updateUserData({
                                currentPassword: formData.currentPassword,
                                newPassword: formData.newPassword
                            });

                            if (success) {
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);
                                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' })); // Clear fields
                                alert("Senha alterada com sucesso!");
                            } else {
                                alert("Erro ao alterar senha. Verifique sua senha atual.");
                            }
                        }}
                    >
                        Atualizar Senha
                    </button>
                    {/* Note: Ideally we should move password to its own form or separate state to avoid sending it with profile updates, 
                        but since updateUserData sends everything, we need to be careful. 
                        Actually, updateUserData sends `data` argument. 
                        Wait, `handleSubmit` calls `updateUserData` with specific fields.
                        So here we invoke `updateUserData` with ONLY password fields. Correct.
                    */}
                </div>
            </form>

            {/* Toast Notification */}
            {showToast && (
                <div className="toast show" style={{ background: '#4caf50' }}>
                    <CheckCircle size={20} />
                    <span>Dados alterados com sucesso!</span>
                </div>
            )}
        </div>
    );
}
