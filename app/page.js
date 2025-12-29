"use client";

import React, { useState, useEffect } from "react";
import { getProducts } from "./data/products";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Heart, ShoppingCart, Rocket, Gamepad2 } from "lucide-react";
import { useWishlist } from "./context/WishlistContext";
import ProductSection from "./components/ProductSection";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Semana do Leitor",
      desc: "Descontos de até 50% em clássicos da literatura. Aproveite o frete grátis!",
      icon: <BookOpen size={150} />,
      bg: "linear-gradient(90deg, var(--deep-purple) 0%, #4a148c 100%)"
    },
    {
      id: 2,
      title: "Geek Festival",
      desc: "Os melhores HQs e Mangás com preços imperdíveis para você colecionar.",
      icon: <Rocket size={150} />,
      bg: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)"
    },
    {
      id: 3,
      title: "Level Up!",
      desc: "Games e Consoles de última geração com entrega rápida.",
      icon: <Gamepad2 size={150} />,
      bg: "linear-gradient(90deg, #991b1b 0%, #dc2626 100%)"
    }
  ];

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  // Auto-rotate effect (resets on manual interaction)
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // 5 seconds interval
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Filter Functions
  const getHighlights = () => products.filter(p => p.tag === 'Oferta' || p.tag === 'Destaque' || p.tag === 'Novo' || p.rating === 5).slice(0, 4);
  const getBooks = () => products.filter(p => p.categoria === 'Livros');
  const getDvds = () => products.filter(p => p.categoria === 'DVDs & Blu-Ray'); // Note: Make sure data matches strictly "DVDs & Blu-Ray" or normalize
  const getCds = () => products.filter(p => p.categoria === 'CDs de Música');
  const getGames = () => products.filter(p => p.categoria === 'Video Game');
  const getComics = () => products.filter(p => p.categoria === 'HQs & Mangás');
  const getCards = () => products.filter(p => p.categoria === 'Card Game');
  const getVhs = () => products.filter(p => p.categoria === 'VHS');

  return (
    <div>
      {/* Hero Carousel */}
      <section className="hero-section">
        <div className="hero-banner" style={{ background: slides[currentSlide].bg, transition: 'background 0.5s ease' }}>
          <button className="carousel-control prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>

          <div className="hero-text" style={{ animation: 'fadeIn 0.5s ease' }} key={slides[currentSlide].id}>
            <h1>{slides[currentSlide].title}</h1>
            <p>{slides[currentSlide].desc}</p>
            <a href="#" className="btn-cta">Confira as Ofertas</a>
          </div>

          <div className="hero-image" style={{ marginRight: '40px', opacity: 0.3, animation: 'fadeIn 0.5s ease' }} key={`img-${slides[currentSlide].id}`}>
            {slides[currentSlide].icon}
          </div>

          <button className="carousel-control next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Product Sections */}
      {products.length > 0 ? (
        <>
          <ProductSection title="Destaques da Semana" products={getHighlights()} linkHref="#" showLink={false} />
          <ProductSection title="Livros" products={getBooks()} linkHref="/categoria/livros" />
          <ProductSection title="HQs & Mangás" products={getComics()} linkHref="/categoria/hqs-mangas" />
          <ProductSection title="CDs de Música" products={getCds()} linkHref="/categoria/cds-de-musica" />
          <ProductSection title="VHS" products={getVhs()} linkHref="/categoria/vhs" />
          <ProductSection title="DVDs & Blu-Ray" products={getDvds()} linkHref="/categoria/dvds-blu-ray" />
          <ProductSection title="Video Game" products={getGames()} linkHref="/categoria/video-game" />
          <ProductSection title="Card Game" products={getCards()} linkHref="/categoria/card-game" />
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Carregando vitrine...
        </p>
      )}
    </div>
  );
}
