"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function MaintenancePopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Open popup slightly after load
        const timer = setTimeout(() => setIsOpen(true), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    return (
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(5px)'
            }}
            className="p-4"
        >
            <div
                style={{
                    maxWidth: '450px',
                    width: '100%',
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                className="dark:bg-gray-900 border border-red-500/30"
            >

                {/* Header */}
                <div className="bg-red-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <AlertTriangle className="w-6 h-6" />
                        <span>SITE EM MANUTENÇÃO</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white hover:bg-red-700/50 rounded-full p-1 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 text-center">
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                        <p className="text-red-700 dark:text-red-400 font-medium">
                            🚧 Estamos realizando testes no sistema.
                        </p>
                    </div>

                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                        <p>
                            Qualquer compra que for feita neste momento <br />
                            <strong className="text-red-600 dark:text-red-400">NÃO SERÁ VÁLIDA.</strong>
                        </p>
                        <p className="text-sm">
                            Por favor, evite realizar pagamentos ou finalizar pedidos até que este aviso seja removido.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors mt-2"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
