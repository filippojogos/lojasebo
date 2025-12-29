"use client";

import React from 'react';
import Link from 'next/link';
import { CreditCard, QrCode } from 'lucide-react';

export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-col">
                    <h3>Loja Sebo</h3>
                    <ul className="footer-links">
                        <li><Link href="/sobre">Sobre Nós</Link></li>
                        <li><Link href="/ajuda">FAQ</Link></li>
                        <li><Link href="/fale-conosco">Fale Conosco (IA Chat)</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3>Categorias</h3>
                    <ul className="footer-links" style={{ columns: 2 }}>
                        <li><Link href="/categoria/livros">Livros</Link></li>
                        <li><Link href="/categoria/hqs-mangas">HQs & Mangás</Link></li>
                        <li><Link href="/categoria/cds-de-musica">CDs</Link></li>
                        <li><Link href="/categoria/vhs">VHS</Link></li>
                        <li><Link href="/categoria/dvds-blu-ray">DVDs</Link></li>
                        <li><Link href="/categoria/video-game">Games</Link></li>
                        <li><Link href="/categoria/card-game">Card Games</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3>Pagamento e Envio</h3>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '10px' }}>Aceitamos:</p>
                    <div className="payment-methods">
                        <div className="payment-icon"><CreditCard size={16} /></div>
                        <div className="payment-icon"><span style={{ fontWeight: 'bold', fontSize: '10px' }}>VISA</span></div>
                        <div className="payment-icon"><QrCode size={16} /></div>
                    </div>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', marginTop: '15px' }}>Envio via:</p>
                    <div style={{ color: 'white', fontWeight: 'bold', marginTop: '5px' }}>SUPER FRETE 📦</div>
                </div>
            </div>
            <div className="copyright">
                &copy; 2025 Loja Sebo. Todos os direitos reservados. | <Link href="/admin/login" style={{ color: '#aaa', textDecoration: 'none', marginLeft: '10px', fontSize: '0.8rem' }}>Admin Access</Link>
            </div>
        </footer>
    );
}
