"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentAPI } from "@/utils/api";
import { formatPrice } from "@/utils/validation";
import styles from "@/styles/payment.module.scss";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

/**
 * Inner payment form component (uses Stripe hooks)
 */
function StripePaymentForm({
  orderId,
  amount,
  onSuccess,
  onError,
  loading,
  setLoading,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError("");
    }
  };

  const handleStripePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setCardError("");

    try {
      // Create payment intent on backend
      const intentResponse = await paymentAPI.createStripeIntent({
        amount,
        orderId,
      });

      if (!intentResponse.data.success) {
        setCardError("Failed to create payment intent");
        setLoading(false);
        return;
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentResponse.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        },
      );

      if (error) {
        setCardError(error.message);
        onError(error.message);
        setLoading(false);
        return;
      }

      // Confirm payment on backend
      const confirmResponse = await paymentAPI.confirmStripePayment({
        paymentIntentId: paymentIntent.id,
        orderId,
      });

      if (confirmResponse.data.success) {
        onSuccess({
          processor: "stripe",
          transactionId: confirmResponse.data.transactionId,
        });
      } else {
        onError("Payment confirmation failed");
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      setCardError(error.message || "Payment processing failed");
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleStripePayment} className={styles.stripeForm}>
      <div className={styles.formGroup}>
        <label>Card Information</label>
        <div className={styles.cardElement}>
          <CardElement
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424242",
                  fontFamily: "Arial, sans-serif",
                  "::placeholder": {
                    color: "#ccc",
                  },
                },
                invalid: {
                  color: "#d32f2f",
                },
              },
            }}
          />
        </div>
      </div>

      {cardError && (
        <div className={styles.error} role="alert">
          ✗ {cardError}
        </div>
      )}

      <button
        type="submit"
        className={styles.payButton}
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay ${formatPrice(amount)}`}
      </button>
    </form>
  );
}

/**
 * PayPal Payment Form Component
 */
function PayPalPaymentForm({
  orderId,
  amount,
  onSuccess,
  onError,
  loading,
  setLoading,
}) {
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // Load PayPal script
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayPalPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current URLs for redirect
      const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order=${orderId}`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?order=${orderId}`;

      // Create PayPal payment
      const createResponse = await paymentAPI.createPayPalPayment({
        amount,
        orderId,
        returnUrl,
        cancelUrl,
      });

      if (createResponse.data.success) {
        // Redirect to PayPal approval URL
        window.location.href = createResponse.data.approvalUrl;
      } else {
        onError("Failed to create PayPal payment");
      }
    } catch (error) {
      console.error("PayPal error:", error);
      onError(error.message || "PayPal payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayPalPayment} className={styles.paypalForm}>
      <button
        type="submit"
        className={styles.paypalButton}
        disabled={!paypalLoaded || loading}
      >
        {loading ? "Redirecting to PayPal..." : "✓ Pay with PayPal"}
      </button>
    </form>
  );
}

/**
 * Main Payment Page Component
 */
export default function PaymentPage({ orderId, amount }) {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handle successful payment
   */
  const handlePaymentSuccess = (result) => {
    setSuccessMessage(
      `Payment successful! Transaction ID: ${result.transactionId}`,
    );

    // Redirect to order confirmation page
    setTimeout(() => {
      window.location.href = `/order/confirmation?id=${orderId}&tx=${result.transactionId}`;
    }, 2000);
  };

  /**
   * Handle payment error
   */
  const handlePaymentError = (error) => {
    setErrorMessage(error);
  };

  return (
    <div className={styles.paymentPage}>
      <div className={styles.container}>
        <h1>Complete Payment</h1>

        {successMessage && (
          <div className={styles.successMessage} role="alert">
            ✓ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className={styles.errorMessage} role="alert">
            ✗ {errorMessage}
          </div>
        )}

        <div className={styles.paymentMethodSelector}>
          <div className={styles.methodOption}>
            <input
              type="radio"
              id="stripe"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="stripe">
              <span className={styles.icon}>💳</span>
              <span className={styles.name}>Credit Card (Stripe)</span>
              <span className={styles.description}>
                Visa, Mastercard, American Express
              </span>
            </label>
          </div>

          <div className={styles.methodOption}>
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="paypal">
              <span className={styles.icon}>🅿️</span>
              <span className={styles.name}>PayPal</span>
              <span className={styles.description}>
                Fast and secure checkout
              </span>
            </label>
          </div>
        </div>

        <div className={styles.paymentForm}>
          {paymentMethod === "stripe" ? (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                orderId={orderId}
                amount={amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                loading={loading}
                setLoading={setLoading}
              />
            </Elements>
          ) : (
            <PayPalPaymentForm
              orderId={orderId}
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>

        <div className={styles.securityInfo}>
          <p>
            🔒 Your payment information is encrypted and secure. We never store
            your full card details.
          </p>
        </div>
      </div>
    </div>
  );
}
