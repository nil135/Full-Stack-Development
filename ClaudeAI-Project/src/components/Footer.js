'use client';

import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/footer.scss';

export default function Footer() {
     return (
          <footer className={styles.footer}>
               <Container>
                    <Row className="gy-4">
                         <Col md={4}>
                              <h3>About Us</h3>
                              <p>Your one-stop shop for quality products at great prices.</p>
                         </Col>
                         <Col md={2}>
                              <h3>Quick Links</h3>
                              <ul className="list-unstyled">
                                   <li>
                                        <Link href="/">Home</Link>
                                   </li>
                                   <li>
                                        <Link href="/products">Products</Link>
                                   </li>
                                   <li>
                                        <Link href="/about">About</Link>
                                   </li>
                                   <li>
                                        <Link href="/contact">Contact</Link>
                                   </li>
                              </ul>
                         </Col>
                         <Col md={3}>
                              <h3>Customer Service</h3>
                              <ul className="list-unstyled">
                                   <li>
                                        <Link href="#">Shipping Info</Link>
                                   </li>
                                   <li>
                                        <Link href="#">Returns</Link>
                                   </li>
                                   <li>
                                        <Link href="#">FAQ</Link>
                                   </li>
                                   <li>
                                        <Link href="#">Support</Link>
                                   </li>
                              </ul>
                         </Col>
                         <Col md={3}>
                              <h3>Contact Info</h3>
                              <p>Email: info@ecomstore.com</p>
                              <p>Phone: 1-800-ECOM-STORE</p>
                              <p>Hours: 9AM - 9PM EST</p>
                         </Col>
                    </Row>
                    <div className={styles['footer-bottom']}>
                         <p>&copy; 2024 EcomStore. All rights reserved.</p>
                    </div>
               </Container>
          </footer>
     );
}
