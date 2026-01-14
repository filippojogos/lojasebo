import "./globals.css";
import "./styles/draft-styles.css";
import { Inter } from 'next/font/google';
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import PopupDisplay from "./components/PopupDisplay";
import VisitTracker from "./components/VisitTracker";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Loja Sebo - O Melhor do Geek e Cultura",
  description: "Livros, Games, Mangás e muito mais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo-aba.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <WishlistProvider>
          <CartProvider>
            <AuthProvider>
              <VisitTracker />
              <div className="min-h-screen flex flex-col">
                <Header />
                <PopupDisplay />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <CartSidebar />
              </div>
            </AuthProvider>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html >
  );
}
