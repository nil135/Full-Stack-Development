'use client';

import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function Contact() {
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          subject: '',
          message: '',
     });

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }));
     };

     const handleSubmit = (e) => {
          e.preventDefault();
          console.log('Form submitted:', formData);
          alert('Thank you for your message! We will get back to you soon.');
          setFormData({ name: '', email: '', subject: '', message: '' });
     };

     return (
          <>
               <div className="bg-primary text-white py-5">
                    <Container>
                         <h1 className="mb-3">Contact Us</h1>
                         <p className="lead">We'd love to hear from you</p>
                    </Container>
               </div>
               <Container className="py-5">
                    <div className="row">
                         <div className="col-lg-6 mx-auto">
                              <Form onSubmit={handleSubmit}>
                                   <Form.Group className="mb-3">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                             type="text"
                                             name="name"
                                             placeholder="Your name"
                                             value={formData.name}
                                             onChange={handleChange}
                                             required
                                        />
                                   </Form.Group>

                                   <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                             type="email"
                                             name="email"
                                             placeholder="your@email.com"
                                             value={formData.email}
                                             onChange={handleChange}
                                             required
                                        />
                                   </Form.Group>

                                   <Form.Group className="mb-3">
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control
                                             type="text"
                                             name="subject"
                                             placeholder="Subject"
                                             value={formData.subject}
                                             onChange={handleChange}
                                             required
                                        />
                                   </Form.Group>

                                   <Form.Group className="mb-3">
                                        <Form.Label>Message</Form.Label>
                                        <Form.Control
                                             as="textarea"
                                             rows={5}
                                             name="message"
                                             placeholder="Your message"
                                             value={formData.message}
                                             onChange={handleChange}
                                             required
                                        />
                                   </Form.Group>

                                   <div className="d-grid gap-2">
                                        <Button variant="primary" size="lg" type="submit">
                                             Send Message
                                        </Button>
                                   </div>
                              </Form>

                              <div className="mt-5 p-4 bg-light rounded">
                                   <h4 className="mb-3">Other Ways to Reach Us</h4>
                                   <p>
                                        <strong>Email:</strong> info@ecomstore.com
                                   </p>
                                   <p>
                                        <strong>Phone:</strong> 1-800-ECOM-STORE
                                   </p>
                                   <p>
                                        <strong>Hours:</strong> Monday - Friday, 9AM - 9PM EST
                                   </p>
                              </div>
                         </div>
                    </div>
               </Container>
          </>
     );
}
