"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function MaintenancePopup() {
    import React, { useState, useEffect } from 'react';
    import { X } from 'lucide-react';

    export default function GlobalPopup() {
        const [config, setConfig] = useState(null);
        const [visible, setVisible] = useState(false);

        useEffect(() => {
            // Fetch config on mount
            const fetchConfig = async () => {
                try {
                    const res = await fetch('/api/popup-config');
                    if (res.ok) {
                        const data = await res.json();
                        setConfig(data);

                        // Check if already seen in this session (unless it's maintenance, which always shows)
                        const seen = sessionStorage.getItem('popup_seen');

                        if (data.active) {
                            if (data.type === 'maintenance') {
                                setVisible(true); // Always show maintenance
                            } else if (!seen) {
                                // Show promo with delay
                                setTimeout(() => setVisible(true), 1000);
                            }
                        }
                    }
                } catch (e) {
                    console.error("Popup config error", e);
                }
            };
            fetchConfig();
        }, []);


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
                </div >
            </div >
        </div >
    );
    }
