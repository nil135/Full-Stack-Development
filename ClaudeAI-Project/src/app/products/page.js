'use client';

import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../../components/ProductCard';

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
];

export default function Products() {
     return (
          <>
               <div className="bg-primary text-white py-5">
                    <Container>
                         <h1 className="mb-3">All Products</h1>
                         <p className="lead">Browse our complete collection of premium products</p>
                    </Container>
               </div>
               <Container className="py-5">
                    <Row xs={1} sm={2} lg={3} className="g-4">
                         {mockProducts.map((product) => (
                              <Col key={product.id}>
                                   <ProductCard product={product} />
                              </Col>
                         ))}
                    </Row>
               </Container>
          </>
     );
}
