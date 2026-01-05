"use client";

import React, { useState, useEffect } from "react";
// import { getProducts } from "./data/products";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Heart, ShoppingCart, Rocket, Gamepad2 } from "lucide-react";
import { useWishlist } from "./context/WishlistContext";
import ProductSection from "./components/ProductSection";

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [homeConfig, setHomeConfig] = useState({ mainHighlights: [], categoryHighlights: {} });

  const defaultSlides = [
    {
      id: 1,
      title: "Semana do Leitor",
      desc: "Descontos de até 50% em clássicos da literatura. Aproveite o frete grátis!",
      icon: <BookOpen size={150} />,
      bg: "linear-gradient(90deg, var(--deep-purple) 0%, #4a148c 100%)",
      duration: 5
    },
    {
      id: 2,
      title: "Geek Festival",
      desc: "Os melhores HQs e Mangás com preços imperdíveis para você colecionar.",
      icon: <Rocket size={150} />,
      bg: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)",
      duration: 5
    },
    {
      id: 3,
      title: "Level Up!",
      desc: "Games e Consoles de última geração com entrega rápida.",
      icon: <Gamepad2 size={150} />,
      bg: "linear-gradient(90deg, #991b1b 0%, #dc2626 100%)",
      duration: 5
    }
  ];

  const slides = banners.length > 0 ? banners : defaultSlides;

  useEffect(() => {
    async function fetchData() {
      try {
        const [resProducts, resBanners, resConfig] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/banners', { cache: 'no-store' }),
          fetch('/api/home-config', { cache: 'no-store' })
        ]);

        if (resProducts.ok) setProducts(await resProducts.json());
        if (resBanners.ok) setBanners(await resBanners.json());
        if (resConfig.ok) setHomeConfig(await resConfig.json());

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // ... slideshow effects ...

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Helper to get products by ID list
  const getProductsByIds = (ids) => {
    if (!ids || !Array.isArray(ids)) return [];
    return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  };

  // Mixed Strategy: Use Manual Config if available, else Auto Filter
  const getConfigOrAuto = (categoryName, autoFilterFn) => {
    const manualIds = homeConfig.categoryHighlights?.[categoryName];
    if (manualIds && manualIds.length > 0) {
      return getProductsByIds(manualIds);
    }
    return autoFilterFn();
  };

  const manualMain = getProductsByIds(homeConfig.mainHighlights);
  // If no manual main highlights, fallback to auto (e.g. recent or offers)
  const finalHighlights = manualMain.length > 0 ? manualMain : products.filter(p => p.tag === 'Oferta' || p.tag === 'Destaque' || p.tag === 'Novo').slice(0, 4);

  // Filter Functions (Auto Fallback)
  const getBooks = () => products.filter(p => p.categoria === 'Livros');
  const getDvds = () => products.filter(p => p.categoria === 'DVD´s' || p.categoria === 'Blue-Ray' || p.categoria === 'DVDs & Blu-Ray');
  const getCds = () => products.filter(p => p.categoria === 'CD´s' || p.categoria === 'CDs de Música');
  const getGames = () => products.filter(p => p.categoria === 'Video Game');
  const getComics = () => products.filter(p => p.categoria === 'HQ´s' || p.categoria === 'Mangas' || p.categoria === 'HQs & Mangás');
  const getCards = () => products.filter(p => p.categoria === 'Card Game');
  const getVhs = () => products.filter(p => p.categoria === 'VHS');

  const BannerContent = () => {
    const slide = slides[currentSlide];
    const hasText = slide.title || slide.desc;

    if (!hasText) return null;

    return (
      <div className="hero-text" style={{ animation: 'fadeIn 0.5s ease', zIndex: 2 }} key={slide.id}>
        {slide.title && <h1>{slide.title}</h1>}
        {slide.desc && <p>{slide.desc}</p>}
      </div>
    );
  };

  return (
    <div>
      {/* Hero Carousel */}
      <section className="hero-section">
        {/* ... (carousel code unchanged) ... */}
        {slides[currentSlide]?.link ? (
          <Link href={slides[currentSlide].link} style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'block' }}>
            <div className="hero-banner" style={{
              background: slides[currentSlide].image ? `url(${slides[currentSlide].image}) center/cover no-repeat` : slides[currentSlide].bg || '#333',
              transition: 'background 0.5s ease',
              position: 'relative',
              cursor: 'pointer'
            }}>
              {/* Overlay for readability if image exists */}
              {slides[currentSlide].image && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1 }}></div>}

              <button className="carousel-control prev" onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }} style={{ zIndex: 3 }}>
                <ChevronLeft size={24} />
              </button>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', alignItems: 'center' }}>
                <BannerContent />
              </div>

              <button className="carousel-control next" onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }} style={{ zIndex: 3 }}>
                <ChevronRight size={24} />
              </button>

              <div className="carousel-indicators" style={{ zIndex: 3 }}>
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(index); }}
                  ></span>
                ))}
              </div>
            </div>
          </Link>
        ) : (
          <div className="hero-banner" style={{
            background: slides[currentSlide].image ? `url(${slides[currentSlide].image}) center/cover no-repeat` : slides[currentSlide].bg || '#333',
            transition: 'background 0.5s ease',
            position: 'relative'
          }}>
            {/* Same structure but without Link wrapper, or just use Link="#"? Let's keep it clean. */}
            {slides[currentSlide].image && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1 }}></div>}

            <button className="carousel-control prev" onClick={prevSlide} style={{ zIndex: 3 }}>
              <ChevronLeft size={24} />
            </button>

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', alignItems: 'center' }}>
              <BannerContent />
            </div>

            <button className="carousel-control next" onClick={nextSlide} style={{ zIndex: 3 }}>
              <ChevronRight size={24} />
            </button>

            <div className="carousel-indicators" style={{ zIndex: 3 }}>
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Product Sections */}
      {products.length > 0 ? (
        <>
          <ProductSection title="Destaques da Semana" products={finalHighlights} linkHref="#" showLink={false} />

          <ProductSection title="Livros" products={getConfigOrAuto("Livros", getBooks)} linkHref="/categoria/livros" />
          <ProductSection title="HQs & Mangás" products={getConfigOrAuto("HQs & Mangás", getComics)} linkHref="/categoria/hqs-mangas" />
          <ProductSection title="CDs de Música" products={getConfigOrAuto("CDs de Música", getCds)} linkHref="/categoria/cds-de-musica" />
          <ProductSection title="VHS" products={getConfigOrAuto("VHS", getVhs)} linkHref="/categoria/vhs" />
          <ProductSection title="DVDs & Blu-Ray" products={getConfigOrAuto("DVDs & Blu-Ray", getDvds)} linkHref="/categoria/dvds-blu-ray" />
          <ProductSection title="Video Game" products={getConfigOrAuto("Video Game", getGames)} linkHref="/categoria/video-game" />
          <ProductSection title="Card Game" products={getConfigOrAuto("Card Game", getCards)} linkHref="/categoria/card-game" />
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Carregando vitrine...
        </p>
      )}
    </div>
  );
}
