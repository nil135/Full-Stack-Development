'use client';

import Image from 'next/image';
import { Card, Button } from 'react-bootstrap';
import styles from '@/styles/home.scss';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
     const { addToCart } = useCart();

     const handleAddToCart = () => {
          addToCart(product);
          toast.success(`✅ ${product.name} added to cart!`, {
               position: 'top-right',
               autoClose: 2000,
          });
     };

     return (
          <Card className={styles['product-card']}>
               <div className={styles['product-image-wrapper']}>
                    <Card.Img
                         variant="top"
                         src={product.image || 'https://picsum.photos/200'}
                         alt={product.name}
                         className={styles['product-image']}
                    />
               </div>
               <Card.Body className={styles['product-info']}>
                    <Card.Title>{product.name}</Card.Title>
                    <div className={styles.rating}>⭐ {product.rating || 4.5} (Reviews: {product.reviews || 0})</div>
                    <div className={styles.price}>${product.price}</div>
                    <Card.Text>{product.description}</Card.Text>
                    <Button variant="primary" className="w-100" onClick={handleAddToCart}>
                         Add to Cart
                    </Button>
               </Card.Body>
          </Card>
     );
}
