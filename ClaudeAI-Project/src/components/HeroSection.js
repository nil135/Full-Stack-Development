'use client';

import Link from 'next/link';
import { Button } from 'react-bootstrap';
import styles from '../styles/home.scss';

export default function HeroSection() {
     return (
          <section className={styles.hero}>
               <div className="container">
                    <h1>Welcome to EcomStore</h1>
                    <p>Discover amazing products at unbeatable prices. Shop now and enjoy fast delivery!</p>
                    <div className={styles['cta-buttons']}>
                         <Button href="/products" className="btn-primary btn-lg">
                              Shop Now
                         </Button>
                         <Button href="/about" variant="outline-primary" className="btn-lg">
                              Learn More
                         </Button>
                    </div>
               </div>
          </section>
     );
}
