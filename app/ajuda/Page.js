"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, User, CreditCard, Package, BookOpen } from 'lucide-react';

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('geral');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    { id: 'geral', label: 'Geral & Produtos', icon: <BookOpen size={20} /> },
    { id: 'conta', label: 'Minha Conta', icon: <User size={20} /> },
    { id: 'pagamentos', label: 'Pagamentos', icon: <CreditCard size={20} /> },
    { id: 'pedidos', label: 'Pedidos & Entregas', icon: <Package size={20} /> },
  ];

  const faqs = {
    geral: [
      {
        question: "Os produtos são originais e verdadeiros?",
        answer: "Sim! Garantimos a autenticidade de todos os nossos itens. Livros, HQs, games e colecionáveis passam por uma curadoria rigorosa."
      },
      {
        question: "O produto é novo ou usado? Está lacrado?",
        answer: "Trabalhamos com ambos. A condição (Novo, Usado, Seminovo) está sempre descrita no detalhe do produto. Se o item estiver lacrado de fábrica, essa informação estará destacada no título ou descrição."
      },
      {
        question: "Como funciona a compra de itens usados?",
        answer: "Itens usados são higienizados e testados. Garantimos que estejam em boas condições de uso. Fotos reais podem ser solicitadas via chat se necessário."
      },
      {
        question: "Onde ficam meus produtos favoritos?",
        answer: "Você pode encontrar seus itens salvos clicando no ícone de Coração ❤️ no topo do site (cabeçalho) ou acessando 'Minha Conta > Favoritos'."
      }
    ],
    conta: [
      {
        question: "Como criar uma conta?",
        answer: "Clique em 'Entrar' no topo do site e selecione 'Cadastre-se'. Preencha seus dados básicos e pronto! É necessário ter uma conta com endereço cadastrado para finalizar compras."
      },
      {
        question: "Como recuperar minha senha?",
        answer: "Na tela de login, clique em 'Esqueci minha senha'. Enviaremos um link de redefinição para o seu e-mail cadastrado."
      },
      {
        question: "Posso alterar meu e-mail, nome ou celular?",
        answer: "Sim. Acesse 'Minha Conta > Meus Dados' para atualizar essas informações a qualquer momento."
      },
      {
        question: "Por que não posso alterar meu CPF?",
        answer: "O CPF é a chave principal do seu cadastro e está vinculado ao histórico fiscal das suas compras. Por segurança, ele não pode ser alterado. Caso tenha digitado errado no cadastro, entre em contato via 'Fale Conosco'."
      },
      {
        question: "Como excluir minha conta?",
        answer: "Para solicitar a exclusão definitiva dos seus dados, entre em contato com nosso suporte pelo chat ('Fale Conosco') ou envie um e-mail para privacidade@lojasebo.com.br."
      }
    ],
    pagamentos: [
      {
        question: "Quais as formas de pagamento?",
        answer: "Aceitamos Pix (com 10% de desconto e aprovação imediata), Boleto Bancário e Cartão de Crédito em até 12x."
      },
      {
        question: "Como pagar com Pix?",
        answer: "Ao finalizar o pedido, geramos um código 'Copia e Cola' e um QR Code. Abra o app do seu banco, escolha Pix > Pagar com QR Code ou Copia e Cola. O pagamento expira em 30 minutos."
      },
      {
        question: "Quanto tempo para aprovar o Boleto?",
        answer: "O boleto tem vencimento de 3 dias úteis. Após o pagamento, a compensação bancária pode levar de 1 a 3 dias úteis para ser confirmada em nosso sistema."
      },
      {
        question: "Como pagar com Cartão de Crédito?",
        answer: "Basta inserir os dados do seu cartão no checkout. Você pode salvar o cartão para compras futuras. Aceitamos as principais bandeiras (Visa, Master, Elo, Amex)."
      },
      {
        question: "Como baixar a 2ª via da Nota Fiscal ou Boleto?",
        answer: "Acesse 'Minha Conta > Meus Pedidos'. No pedido desejado, você encontrará botões para baixar a 2ª via do boleto (se pendente) ou a Nota Fiscal (se faturado)."
      }
    ],
    pedidos: [
      {
        question: "Como acompanhar minha compra?",
        answer: "Acesse 'Minha Conta > Meus Pedidos'. Lá você verá o status atual de cada compra e o código de rastreio correios/transportadora assim que enviado."
      },
      {
        question: "Como pagar um pedido pendente?",
        answer: "Vá em 'Meus Pedidos', localize a compra com status 'Aguardando Pagamento' e clique em 'Pagar Agora' ou 'Ver Detalhes' para retomar o pagamento."
      },
      {
        question: "Como cancelar um pedido?",
        answer: "Se o pedido ainda não foi enviado, você pode cancelar diretamente no detalhe do pedido em 'Minha Conta'. Se já foi enviado, recuse a entrega."
      },
      {
        question: "Como devolver um produto?",
        answer: "Você tem até 7 dias corridos após o recebimento para devolução por arrependimento. Acesse o pedido e clique em 'Solicitar Devolução' ou chame no chat."
      }
    ]
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 className="section-title">Central de Ajuda</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Como podemos te ajudar hoje?</p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveTab(cat.id); setOpenIndex(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              border: 'none',
              background: activeTab === cat.id ? 'var(--primary-orange)' : '#f5f5f5',
              color: activeTab === cat.id ? 'white' : '#555',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === cat.id ? '0 4px 10px rgba(255, 107, 0, 0.2)' : 'none'
            }}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="faq-list" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {faqs[activeTab].map((faq, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #eee',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{
                width: '100%',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '1rem',
                color: '#333'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  background: openIndex === index ? 'var(--primary-orange)' : '#f0f0f0',
                  color: openIndex === index ? 'white' : '#666',
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                }}>
                  <HelpCircle size={18} />
                </div>
                {faq.question}
              </span>
              {openIndex === index ? <ChevronUp size={20} color="#999" /> : <ChevronDown size={20} color="#999" />}
            </button>

            {openIndex === index && (
              <div style={{ padding: '0 20px 25px 67px', color: '#555', lineHeight: '1.6', borderTop: '1px solid #f9f9f9', animation: 'fadeIn 0.3s ease' }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}