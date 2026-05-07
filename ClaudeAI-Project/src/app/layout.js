import 'bootstrap/dist/css/bootstrap.css';
import '@/styles/globals.scss';
import '@/styles/pages.scss';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
     title: 'EcomStore - Your Online Shopping Destination',
     description: 'Shop amazing products at great prices with fast delivery',
     keywords: 'ecommerce, shopping, products, online store',
};

export default function RootLayout({ children }) {
     return (
          <html lang="en">
               <body>
                    <CartProvider>
                         <ToastProvider />
                         <Navbar />
                         <main>{children}</main>
                         <Footer />
                    </CartProvider>
               </body>
          </html>
     );
}
