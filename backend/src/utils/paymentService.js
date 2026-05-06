const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');

// Configure PayPal
paypal.configure({
     mode: process.env.PAYPAL_MODE || 'sandbox',
     client_id: process.env.PAYPAL_CLIENT_ID,
     client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

/**
 * Stripe Payment Processing
 */
class StripePaymentService {
     /**
      * Create a payment intent for Stripe
      * Returns client secret to complete payment on frontend
      */
     static async createPaymentIntent(amount, orderId, metadata = {}) {
          try {
               const paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(amount), // Must be in cents
                    currency: 'usd',
                    metadata: {
                         orderId: orderId.toString(),
                         ...metadata,
                    },
                    // For SCA (Strong Customer Authentication) compliance
                    payment_method_types: ['card'],
               });

               return {
                    success: true,
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
               };
          } catch (error) {
               console.error('Stripe payment intent error:', error);
               return {
                    success: false,
                    error: error.message,
               };
          }
     }

     /**
      * Confirm payment after frontend tokenization
      */
     static async confirmPayment(paymentIntentId) {
          try {
               const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

               return {
                    success: paymentIntent.status === 'succeeded',
                    status: paymentIntent.status,
                    transactionId: paymentIntent.id,
                    amount: paymentIntent.amount,
                    metadata: paymentIntent.metadata,
               };
          } catch (error) {
               console.error('Stripe confirmation error:', error);
               return {
                    success: false,
                    error: error.message,
               };
          }
     }

     /**
      * Refund a Stripe payment
      */
     static async refund(chargeId, amount = null) {
          try {
               const refund = await stripe.refunds.create({
                    charge: chargeId,
                    amount: amount ? Math.round(amount) : undefined,
               });

               return {
                    success: true,
                    refundId: refund.id,
                    status: refund.status,
               };
          } catch (error) {
               console.error('Stripe refund error:', error);
               return {
                    success: false,
                    error: error.message,
               };
          }
     }
}

/**
 * PayPal Payment Processing
 */
class PayPalPaymentService {
     /**
      * Create a payment for PayPal
      */
     static async createPayment(amount, orderId, redirectUrls) {
          return new Promise((resolve, reject) => {
               const paymentDetails = {
                    intent: 'sale',
                    payer: {
                         payment_method: 'paypal',
                    },
                    transactions: [
                         {
                              amount: {
                                   total: (amount / 100).toFixed(2), // Convert cents to dollars
                                   currency: 'USD',
                                   details: {
                                        subtotal: (amount / 100).toFixed(2),
                                   },
                              },
                              description: `Order #${orderId}`,
                              invoice_number: orderId.toString(),
                         },
                    ],
                    redirect_urls: redirectUrls,
               };

               paypal.payment.create(paymentDetails, (error, payment) => {
                    if (error) {
                         console.error('PayPal creation error:', error);
                         reject({
                              success: false,
                              error: error.message,
                         });
                    } else {
                         const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
                         resolve({
                              success: true,
                              paymentId: payment.id,
                              approvalUrl: approvalUrl?.href,
                         });
                    }
               });
          });
     }

     /**
      * Execute payment after user approval
      */
     static async executePayment(paymentId, payerId) {
          return new Promise((resolve, reject) => {
               paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
                    if (error) {
                         console.error('PayPal execution error:', error);
                         reject({
                              success: false,
                              error: error.message,
                         });
                    } else {
                         const transaction = payment.transactions[0].related_resources[0].sale;
                         resolve({
                              success: true,
                              transactionId: transaction.id,
                              status: transaction.state,
                              amount: payment.transactions[0].amount.total,
                         });
                    }
               });
          });
     }

     /**
      * Refund a PayPal payment
      */
     static async refund(saleId, amount = null) {
          return new Promise((resolve, reject) => {
               const refundDetails = amount
                    ? { amount: (amount / 100).toFixed(2) } // Convert cents to dollars
                    : {};

               paypal.sale.find(saleId, (error, sale) => {
                    if (error) {
                         console.error('PayPal sale lookup error:', error);
                         reject({
                              success: false,
                              error: error.message,
                         });
                    } else {
                         sale.refund(refundDetails, (error, refund) => {
                              if (error) {
                                   console.error('PayPal refund error:', error);
                                   reject({
                                        success: false,
                                        error: error.message,
                                   });
                              } else {
                                   resolve({
                                        success: true,
                                        refundId: refund.id,
                                        status: refund.state,
                                   });
                              }
                         });
                    }
               });
          });
     }
}

module.exports = {
     StripePaymentService,
     PayPalPaymentService,
};
