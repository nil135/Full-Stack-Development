'use client';

import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import styles from '../styles/home.scss';
import { useEffect, useState } from 'react';

export default function Home() {
     const [products, setProducts] = useState([]);

     useEffect(() => {
          // Fetch products from backend API
          const fetchProducts = async () => {
               try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                    const data = await response.json();
                    setProducts(data);
               } catch (error) {
                    console.error('Error fetching products:', error);
                    // Use mock data if API fails
                    setProducts(mockProducts);
               }
          };

          fetchProducts();
     }, []);

     return (
          <>
               <HeroSection />
               <section className={styles['products-section']}>
                    <div className="container">
                         <h2>Featured Products</h2>
                         <div className="grid grid-3">
                              {products.length > 0 ? (
                                   products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                   ))
                              ) : (
                                   mockProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                   ))
                              )}
                         </div>
                    </div>
               </section>
          </>
     );
}

// Mock data for development
const mockProducts = [
     {
          id: 1,
          name: 'Premium Wireless Headphones',
          price: 199.99,
          image: '/products/headphones.jpg',
          description: 'High-quality sound with noise cancellation',
          rating: 4.8,
          reviews: 124,
     },
     {
          id: 2,
          name: 'Smartwatch Pro',
          price: 299.99,
          image: '/products/smartwatch.jpg',
          description: 'Track your fitness with advanced features',
          rating: 4.6,
          reviews: 89,
     },
     {
          id: 3,
          name: 'Portable Charger',
          price: 49.99,
          image: '/products/charger.jpg',
          description: 'Fast charging for all your devices',
          rating: 4.9,
          reviews: 256,
     },
     {
          id: 4,
          name: 'USB-C Cable',
          price: 14.99,
          image: '/products/cable.jpg',
          description: 'Durable and fast data transfer',
          rating: 4.7,
          reviews: 412,
     },
     {
          id: 5,
          name: 'Camera Backpack',
          price: 79.99,
          image: '/products/backpack.jpg',
          description: 'Protective storage for your gear',
          rating: 4.5,
          reviews: 67,
     },
     {
          id: 6,
          name: 'Phone Stand',
          price: 24.99,
          image: '/products/phone-stand.jpg',
          description: 'Adjustable stand for all phones',
          rating: 4.4,
          reviews: 178,
     },
];
