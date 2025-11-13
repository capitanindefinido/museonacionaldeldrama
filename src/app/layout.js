import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShopWidget from '../components/ShopWidget';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Museo Nacional del Drama',
  description: 'Exposición virtual inmersiva de Drama26',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="drama">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-base-100 text-base-content font-[Montserrat,Arial,Helvetica,sans-serif]">
        <CartProvider>
          <div className="flex flex-col h-full">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
          {/* <ShopWidget /> */}
        </CartProvider>
      </body>
    </html>
  );
}
