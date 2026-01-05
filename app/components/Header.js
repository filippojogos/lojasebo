"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingCart, Heart, X, Package } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { products } from '../data/products';

export default function Header() {
  const { wishlist } = useWishlist();
  const { toggleCart, cartCount } = useCart();
  const { user, login, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const closeTimeoutRef = React.useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);



  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const filtered = products.filter(p =>
        p.nome.toLowerCase().includes(query.toLowerCase()) ||
        p.categoria.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    router.push(`/produto/${productId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsLoginOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsLoginOpen(false);
    }, 500); // 0.5 second delay
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      await login({ email, password });
      setIsLoginOpen(false);
    } catch (err) {
      alert("Falha no login. Verifique seus dados.");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoginOpen(false); // Close dropdown on logout
  };

  return (
    <>
      {!pathname?.startsWith('/admin') && (
        <header>
          <div className="navbar">
            {/* ... existing startup code ... */}
            <div className="logo-container">
              <Link href="/">
                <img src="/logo.png" alt="Loja Sebo" />
              </Link>
            </div>


            <div className="search-bar" style={{ position: 'relative' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
                <input
                  type="text"
                  placeholder="O que você procura hoje? Livros, games..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <button type="submit">
                  <Search size={18} />
                </button>
              </form>

              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  borderRadius: '0 0 8px 8px',
                  zIndex: 1001,
                  overflow: 'hidden'
                }}>
                  {suggestions.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                      style={{
                        padding: '10px 15px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <img src={product.imagem} alt={product.nome} style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: '#333' }}>{product.nome}</span>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>{product.categoria}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="nav-links">
              {/* Login / User Section */}
              <div
                className="nav-item login-trigger"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <User size={24} />
                <span>{mounted && user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}</span>

                {/* Dropdown */}
                <div className={`login-dropdown ${isLoginOpen ? 'active' : ''}`}>
                  {mounted && user ? (
                    /* Logged In View */
                    <div className="logged-in-view">
                      <div className="user-profile-header" style={{ textAlign: 'center', paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
                        <div style={{ width: '50px', height: '50px', background: 'var(--deep-purple)', color: 'white', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <strong>{user.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.email}</div>
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                          <Link href="/minha-conta/dados" style={{ color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <User size={16} /> Minha Conta
                          </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                          <Link href="/minha-conta/pedidos" style={{ color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Package size={16} /> Meus Pedidos
                          </Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                          <Link href="/favoritos" style={{ color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Heart size={16} /> Favoritos
                          </Link>
                        </li>
                        <li>
                          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e74c3c', textDecoration: 'none', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', padding: 0, fontSize: '1rem' }}>
                            <X size={16} /> Sair
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    /* Logged Out View */
                    <div className="logged-out-view">
                      <h3>Minha Conta</h3>
                      <form onSubmit={handleLogin} id="quick-login">
                        <input name="email" type="email" placeholder="E-mail / Login" required />
                        <input name="password" type="password" placeholder="Senha" required />
                        <button type="submit" className="btn-cta btn-block" style={{ marginTop: '10px' }}>Entrar</button>
                      </form>
                      <div className="dropdown-footer">
                        <Link href="/cadastro">Criar Conta</Link>
                        <Link href="/esqueci-senha">Esqueci a senha</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="nav-item">
                <Link href="/favoritos" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white', textDecoration: 'none' }}>
                  <Heart size={24} />
                  {mounted && wishlist.length > 0 && (
                    <span className="cart-count">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </div>

              <div className="nav-item cart-trigger" onClick={toggleCart}>
                <div className="cart-icon">
                  <ShoppingCart size={24} />
                  {mounted && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="categories-bar" style={pathname?.startsWith('/admin') ? { top: 0 } : {}}>
        <div className="categories-container">
          {[
            { label: 'Livros', href: '/categoria/livros' },
            { label: 'HQs & Mangás', href: '/categoria/hqs-mangas' },
            { label: 'CDs de Música', href: '/categoria/cds-de-musica' },
            { label: 'VHS', href: '/categoria/vhs' },
            { label: 'DVDs & Blu-Ray', href: '/categoria/dvds-blu-ray' },
            {
              label: 'Video Game',
              href: '/categoria/video-game',
              subcategories: [
                { label: 'NINTENDO', href: '/categoria/video-game/nintendo' },
                { label: 'XBOX', href: '/categoria/video-game/xbox' },
                { label: 'SONY', href: '/categoria/video-game/sony' },
                { label: 'SEGA', href: '/categoria/video-game/sega' },
                { label: 'PC', href: '/categoria/video-game/pc' }
              ]
            },
            {
              label: 'Card Game',
              href: '/categoria/card-game',
              subcategories: [
                { label: 'Pokemon TCG', href: '/categoria/card-game/pokemon-tcg' },
                { label: 'Yu-Gi-Oh!', href: '/categoria/card-game/yu-gi-oh' },
                { label: 'Magic', href: '/categoria/card-game/magic' }
              ]
            }
          ].map((cat) => {
            const isAdmin = pathname?.startsWith('/admin');
            const catHref = isAdmin ? `/admin${cat.href}` : cat.href;

            return (
              <div key={cat.label} className="category-item-container">
                <Link href={catHref} className="category-link">
                  {cat.label}
                </Link>
                {cat.subcategories && (
                  <div className="category-dropdown">
                    {cat.subcategories.map(sub => {
                      const subHref = isAdmin ? `/admin${sub.href}` : sub.href;
                      return (
                        <Link key={sub.label} href={subHref} className="subcategory-link">
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
