"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("sebo_cart");
        if (saved) {
            setCartItems(JSON.parse(saved));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("sebo_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            const stock = product.estoque !== undefined ? product.estoque : 99; // Default high stock if undefined

            if (existingItem) {
                const newQty = existingItem.qty + quantity;
                if (newQty > stock) {
                    alert(`Limite de estoque atingido! Você já tem ${existingItem.qty} no carrinho.`);
                    // If adding strict quantity, maybe add up to stock? For now, just block.
                    return prevItems;
                }
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: newQty }
                        : item
                );
            }
            // Ensure price key exists even if source is preco
            const price = product.price !== undefined ? product.price : product.preco;
            return [...prevItems, { ...product, price, estoque: stock, qty: quantity }];
        });
        setIsCartOpen(true); // Open sidebar on add
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, change) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === productId) {
                    const newQty = item.qty + change;
                    const stock = item.estoque !== undefined ? item.estoque : 99;

                    if (newQty < 1) return item; // Don't remove if < 1
                    if (newQty > stock) {
                        alert(`Apenas ${stock} unidades disponíveis.`);
                        return item;
                    }
                    return { ...item, qty: newQty };
                }
                return item;
            })
        );
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeCart = () => setIsCartOpen(false);

    const cartTotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.qty) || 1;
        return acc + (price * qty);
    }, 0);

    const cartCount = cartItems.reduce((acc, item) => {
        const qty = parseInt(item.qty) || 0;
        return acc + qty;
    }, 0);

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("sebo_cart");
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart, // Exposed
            isCartOpen,
            toggleCart,
            closeCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
