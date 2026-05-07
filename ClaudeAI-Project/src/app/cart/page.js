'use client';

import { Container, Table, Button } from 'react-bootstrap';

export default function Cart() {
     const cartItems = [
          { id: 1, name: 'Premium Wireless Headphones', price: 199.99, quantity: 1 },
          { id: 2, name: 'Portable Charger', price: 49.99, quantity: 2 },
     ];

     const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

     return (
          <>
               <div className="bg-primary text-white py-5">
                    <Container>
                         <h1 className="mb-3">Shopping Cart</h1>
                         <p className="lead">Review and checkout your items</p>
                    </Container>
               </div>
               <Container className="py-5">
                    <Table striped bordered hover responsive>
                         <thead className="bg-light">
                              <tr>
                                   <th>Product</th>
                                   <th>Price</th>
                                   <th>Quantity</th>
                                   <th>Total</th>
                                   <th>Action</th>
                              </tr>
                         </thead>
                         <tbody>
                              {cartItems.map((item) => (
                                   <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>${item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                             <Button variant="danger" size="sm">
                                                  Remove
                                             </Button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </Table>
                    <div className="text-end mt-4">
                         <h3 className="mb-3">Total: ${total.toFixed(2)}</h3>
                         <Button variant="primary" size="lg" className="me-2">
                              Checkout
                         </Button>
                         <Button variant="outline-secondary" size="lg">
                              Continue Shopping
                         </Button>
                    </div>
               </Container>
          </>
     );
}
