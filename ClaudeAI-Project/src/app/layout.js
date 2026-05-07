import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.scss';
import '../styles/pages.scss';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
     title: 'EcomStore - Your Online Shopping Destination',
     description: 'Shop amazing products at great prices with fast delivery',
     keywords: 'ecommerce, shopping, products, online store',
};

export default function RootLayout({ children }) {
     return (
          <html lang="en">
               <body>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
               </body>
          </html>
     );
}
