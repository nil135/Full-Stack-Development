'use client';

import Link from 'next/link';
import { Navbar, Container, Nav } from 'react-bootstrap';
import styles from '../styles/navbar.scss';

export default function NavbarComponent() {
     return (
          <Navbar bg="light" expand="lg" sticky="top" className="navbar-custom shadow-sm">
               <Container>
                    <Navbar.Brand as={Link} href="/" className="fw-bold fs-5">
                         🛍️ EcomStore
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                         <Nav className="ms-auto">
                              <Nav.Link as={Link} href="/" className="me-3">
                                   Home
                              </Nav.Link>
                              <Nav.Link as={Link} href="/products" className="me-3">
                                   Products
                              </Nav.Link>
                              <Nav.Link as={Link} href="/about" className="me-3">
                                   About
                              </Nav.Link>
                              <Nav.Link as={Link} href="/contact" className="me-3">
                                   Contact
                              </Nav.Link>
                              <Nav.Link as={Link} href="/cart" className="btn btn-primary text-white ms-2">
                                   🛒 Cart
                              </Nav.Link>
                         </Nav>
                    </Navbar.Collapse>
               </Container>
          </Navbar>
     );
}