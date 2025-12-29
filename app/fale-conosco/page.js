"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, ShoppingBag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function FaleConoscoPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Olá! Eu sou a IA da Loja Sebo. 🤖\nPosso te ajudar com dúvidas sobre pedidos, pagamentos, conta ou indicar produtos incríveis!\n\nO que você precisa hoje?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate Support AI Processing
        setTimeout(() => {
            const botResponse = generateAIResponse(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', ...botResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (text) => {
        const lowerText = text.toLowerCase();

        // 1. ACCOUNT & LOGIN
        if (lowerText.includes('senha') || lowerText.includes('recuperar')) {
            return { text: "Para recuperar sua senha, vá até a tela de Login e clique em 'Esqueci minha senha'. Enviaremos um link para seu e-mail cadastrado." };
        }
        if (lowerText.includes('criar conta') || lowerText.includes('cadastro')) {
            return { text: "Criar uma conta é fácil! Clique em 'Entrar' no topo do site e selecione 'Cadastre-se'. Você precisará de um e-mail válido, CPF e criar uma senha." };
        }
        if (lowerText.includes('deletar') || lowerText.includes('excluir conta')) {
            return { text: "Poxa, que pena que quer nos deixar! 😢 Para excluir sua conta, por questões de segurança, envie um e-mail para privacidade@lojasebo.com.br solicitando a remoção dos dados." };
        }
        if (lowerText.includes('alterar') && (lowerText.includes('nome') || lowerText.includes('email') || lowerText.includes('celular'))) {
            return { text: "Você pode alterar nome, e-mail e celular acessando 'Minha Conta > Meus Dados'." };
        }
        if (lowerText.includes('cpf')) {
            return { text: "O CPF não pode ser alterado pois é a chave principal do seu cadastro fiscal. Se houve erro de digitação no registro, entre em contato com nosso suporte humano." };
        }
        if (lowerText.includes('endereço') || lowerText.includes('mudar endereço')) {
            return { text: "Você pode gerenciar seus endereços em 'Minha Conta > Endereços'. Lá você pode adicionar novos, editar ou excluir (lembrando que é preciso manter pelo menos um endereço principal)." };
        }

        // 2. NAVIGATION & FAVORITES
        if (lowerText.includes('favorito') || lowerText.includes('coração')) {
            return { text: "Seus itens favoritos ficam salvos no 'Coração' ❤️ lá no topo do site. É uma ótima forma de salvar o que você quer comprar depois!" };
        }
        if (lowerText.includes('finalizar') || lowerText.includes('compra')) {
            return { text: "Para finalizar a compra, vá ao seu Carrinho e clique em 'Finalizar Compra'. Importante: você precisa estar logado e ter um endereço cadastrado." };
        }

        // 3. PAYMENTS
        if (lowerText.includes('pix')) {
            return { text: "O Pix é nossa opção mais rápida! Ele dá 10% de desconto e aprova na hora. O código expira em 30 minutos." };
        }
        if (lowerText.includes('boleto')) {
            return { text: "O boleto bancário tem vencimento de 3 dias úteis. A compensação pode levar até 72h. Você pode baixar a 2ª via em 'Meus Pedidos' se o boleto vencer ou você perdê-lo." };
        }
        if (lowerText.includes('cartão') || lowerText.includes('parcela')) {
            return { text: "Aceitamos cartões de crédito em até 12x. Todas as transações são criptografadas e seguras." };
        }
        if (lowerText.includes('segunda via') || lowerText.includes('2ª via')) {
            return { text: "Você pode baixar a 2ª via do boleto ou da Nota Fiscal acessando 'Minha Conta > Meus Pedidos' e clicando no pedido correspondente." };
        }

        // 4. ORDERS & RETURNS
        if (lowerText.includes('rastrei') || lowerText.includes('chegar') || lowerText.includes('pedido')) {
            return { text: "Você pode rastrear todos os seus pedidos na área 'Minha Conta > Meus Pedidos'. O código de rastreio aparece lá assim que a transportadora coleta o pacote." };
        }
        if (lowerText.includes('cancelar') || lowerText.includes('cancelamento')) {
            return { text: "Se o pedido ainda não foi enviado, cancele direto em 'Meus Pedidos'. Se já está em trânsito, basta recusar a entrega que faremos o reembolso assim que voltar." };
        }
        if (lowerText.includes('devolver') || lowerText.includes('troca')) {
            return { text: "Você tem 7 dias corridos após a entrega para devolver por arrependimento. Basta solicitar em 'Meus Pedidos'. O produto deve estar nas mesmas condições recebidas." };
        }
        if (lowerText.includes('pendente') || lowerText.includes('pagar agora')) {
            return { text: "Se seu pedido está 'Aguardando Pagamento', vá em 'Meus Pedidos' e clique em 'Pagar Agora' para gerar o Pix ou Boleto novamente." };
        }

        // 5. PRODUCTS (Simulated Search)
        if (lowerText.includes('harry potter') || lowerText.includes('livro')) {
            return {
                text: "Eu encontrei algo que você pode gostar! Esses livros são muito procurados por aqui.",
                product: {
                    name: "Box Harry Potter - Edição Premium",
                    price: "R$ 249,90",
                    image: "https://m.media-amazon.com/images/I/71zWjR+P7qL._SY466_.jpg",
                    condition: "Novo - Lacrado"
                }
            };
        }
        if (lowerText.includes('batman') || lowerText.includes('hq') || lowerText.includes('quadrinho')) {
            return {
                text: "Temos várias HQs do Batman! Olha essa raridade que chegou recentemente:",
                product: {
                    name: "Batman: O Cavaleiro das Trevas (Definitiva)",
                    price: "R$ 89,90",
                    image: "https://m.media-amazon.com/images/I/91+1SUO3vUL._SY466_.jpg",
                    condition: "Usado - Ótimo Estado"
                }
            };
        }
        if (lowerText.includes('zelda') || lowerText.includes('jogo') || lowerText.includes('game')) {
            return {
                text: "Games retrô e atuais é com a gente mesmo! Dá uma olhada nesse aqui:",
                product: {
                    name: "The Legend of Zelda: Breath of the Wild",
                    price: "R$ 299,00",
                    image: "https://m.media-amazon.com/images/I/81KGsJ1B46L._AC_SY445_.jpg",
                    condition: "Seminovo"
                }
            };
        }

        // 6. GENERAL AUTHENTICITY
        if (lowerText.includes('original') || lowerText.includes('verdadeiro') || lowerText.includes('falso')) {
            return { text: "Garantimos 100% que todos os nossos produtos são originais. Nossa equipe faz uma curadoria rigorosa antes de colocar qualquer item à venda." };
        }
        if (lowerText.includes('lacrado') || lowerText.includes('novo')) {
            return { text: "Se o produto for novo e lacrado de fábrica, avisamos em destaque no perfil do produto. Se for usado, descrevemos o estado com detalhes e fotos reais." };
        }

        // DEFAULT FALLBACK
        return { text: "Desculpe, ainda estou aprendendo e não entendi muito bem. 😅\nTente perguntar sobre 'como rastrear', 'formas de pagamento' ou 'trocar senha'." };
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 className="section-title">Fale Conosco</h1>
                <p style={{ color: '#666' }}>Converse com nossa Inteligência Artificial para tirar suas dúvidas instantaneamente.</p>
            </div>

            <div className="chat-container" style={{
                flex: 1,
                border: '1px solid #ddd',
                borderRadius: '16px',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
            }}>
                <div className="chat-header" style={{
                    padding: '15px 25px',
                    background: 'var(--deep-purple)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={24} />
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#2ecc71', borderRadius: '50%', border: '2px solid var(--deep-purple)' }}></div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Sebo Assistant</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Responde na hora • 24/7</div>
                    </div>
                </div>

                <div className="chat-messages" style={{ flex: 1, padding: '25px', overflowY: 'auto', background: '#f5f7fb' }}>
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '20px'
                            }}
                        >
                            <div style={{
                                maxWidth: '75%',
                                display: 'flex',
                                gap: '12px',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                            }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: msg.sender === 'user' ? 'var(--primary-orange)' : '#e0e0e0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: msg.sender === 'user' ? 'white' : '#555',
                                    flexShrink: 0
                                }}>
                                    {msg.sender === 'user' ? <User size={18} /> : <Bot size={20} />}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {/* Text Bubble */}
                                    <div style={{
                                        padding: '14px 18px',
                                        borderRadius: '18px',
                                        background: msg.sender === 'user' ? 'var(--primary-orange)' : 'white',
                                        color: msg.sender === 'user' ? 'white' : '#333',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        borderRadius: msg.sender === 'user' ? '18px 0 18px 18px' : '0 18px 18px 18px',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-line'
                                    }}>
                                        {msg.text}
                                    </div>

                                    {/* Product Suggestion Card (if any) */}
                                    {msg.product && (
                                        <div style={{
                                            background: 'white',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            border: '1px solid #eee',
                                            marginTop: '5px',
                                            width: '240px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            animation: 'fadeIn 0.5s ease'
                                        }}>
                                            <div style={{ width: '100%', height: '140px', background: '#f8f8f8', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {/* Fallback image logic or real helper */}
                                                {msg.product.image ? (
                                                    <img src={msg.product.image} alt={msg.product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <ShoppingBag size={40} color="#ddd" />
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px', lineHeight: '1.2' }}>{msg.product.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>{msg.product.condition}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ color: 'var(--primary-orange)', fontWeight: 'bold' }}>{msg.product.price}</span>
                                                <button style={{
                                                    background: 'var(--deep-purple)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 10px',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    Ver <ExternalLink size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={20} color="#555" />
                            </div>
                            <div style={{ padding: '14px 18px', background: 'white', borderRadius: '0 18px 18px 18px', color: '#666', fontStyle: 'italic', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                Digitandoo...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} style={{ padding: '20px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Digite sua dúvida (ex: 'como pagar com pix', 'tem livros do harry potter?')..."
                        style={{
                            flex: 1,
                            padding: '15px 20px',
                            borderRadius: '30px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            fontSize: '0.95rem',
                            background: '#f8f9fa'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        style={{
                            background: 'var(--primary-orange)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            cursor: input.trim() ? 'pointer' : 'default',
                            opacity: input.trim() ? 1 : 0.6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(255, 107, 0, 0.3)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Send size={22} style={{ marginLeft: '3px' }} />
                    </button>
                </form>
            </div>
        </div>
    );
}
