'use client';

import { Container, Row, Col, Card } from 'react-bootstrap';

export default function About() {
     return (
          <>
               <div className="bg-primary text-white py-5">
                    <Container>
                         <h1 className="mb-3">About EcomStore</h1>
                         <p className="lead">Your trusted online shopping destination</p>
                    </Container>
               </div>
               <Container className="py-5">
                    <Row className="mb-5">
                         <Col lg={8}>
                              <h2 className="mb-3">Our Story</h2>
                              <p>
                                   Welcome to EcomStore, your trusted online shopping destination. We provide a wide selection of
                                   high-quality products with excellent customer service. Since our founding, we've been committed
                                   to delivering the best shopping experience to our customers.
                              </p>
                         </Col>
                    </Row>
                    <Row className="mb-5">
                         <Col md={6} className="mb-4">
                              <Card className="h-100 shadow-sm">
                                   <Card.Body>
                                        <Card.Title className="text-primary">Our Mission</Card.Title>
                                        <Card.Text>
                                             To provide the best online shopping experience with quality products at competitive prices.
                                        </Card.Text>
                                   </Card.Body>
                              </Card>
                         </Col>
                         <Col md={6} className="mb-4">
                              <Card className="h-100 shadow-sm">
                                   <Card.Body>
                                        <Card.Title className="text-primary">Our Vision</Card.Title>
                                        <Card.Text>
                                             To become the leading online marketplace trusted by millions worldwide for exceptional products
                                             and outstanding service.
                                        </Card.Text>
                                   </Card.Body>
                              </Card>
                         </Col>
                    </Row>
                    <Row>
                         <Col md={4} className="mb-4">
                              <Card className="text-center shadow-sm">
                                   <Card.Body>
                                        <h3 className="text-primary mb-2">100K+</h3>
                                        <p>Happy Customers</p>
                                   </Card.Body>
                              </Card>
                         </Col>
                         <Col md={4} className="mb-4">
                              <Card className="text-center shadow-sm">
                                   <Card.Body>
                                        <h3 className="text-primary mb-2">50K+</h3>
                                        <p>Products</p>
                                   </Card.Body>
                              </Card>
                         </Col>
                         <Col md={4} className="mb-4">
                              <Card className="text-center shadow-sm">
                                   <Card.Body>
                                        <h3 className="text-primary mb-2">24/7</h3>
                                        <p>Customer Support</p>
                                   </Card.Body>
                              </Card>
                         </Col>
                    </Row>
               </Container>
          </>
     );
}
