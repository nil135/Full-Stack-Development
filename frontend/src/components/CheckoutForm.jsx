"use client";

import { useState } from "react";
import { checkoutAPI } from "@/utils/api";
import { validateAddress, formatPrice } from "@/utils/validation";
import styles from "@/styles/checkout.module.scss";

export default function CheckoutForm({ cartItems, onOrderCreated }) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Billing, 3: Review
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    sameAsBilling: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handle address input change
   */
  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [name]: value,
      },
    }));

    // Clear error for this field
    const errorKey = `${addressType}.${name}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  /**
   * Validate current step
   */
  const validateStep = (stepNum) => {
    const stepErrors = {};

    if (stepNum === 1) {
      const validation = validateAddress(formData.shippingAddress);
      if (!validation.valid) {
        Object.keys(validation.errors).forEach((field) => {
          stepErrors[`shippingAddress.${field}`] = validation.errors[field];
        });
      }
    }

    if (stepNum === 2 && !formData.sameAsBilling) {
      const validation = validateAddress(formData.billingAddress);
      if (!validation.valid) {
        Object.keys(validation.errors).forEach((field) => {
          stepErrors[`billingAddress.${field}`] = validation.errors[field];
        });
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }

    return true;
  };

  /**
   * Handle step navigation
   */
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setErrorMessage("");
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setErrorMessage("");
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateStep(2)) {
      return;
    }

    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsBilling ? null : formData.billingAddress,
      };

      // Create order
      const response = await checkoutAPI.createOrder(orderData);

      if (response.data.success) {
        // Call callback with order info
        onOrderCreated(response.data.order);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to create order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate total
   */
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm} noValidate>
      <div className={styles.formContainer}>
        <h1>Checkout</h1>

        {errorMessage && (
          <div className={styles.errorMessage} role="alert">
            ✗ {errorMessage}
          </div>
        )}

        {/* Step 1: Shipping Address */}
        {step >= 1 && (
          <fieldset
            className={`${styles.step} ${step === 1 ? styles.active : ""}`}
          >
            <legend>1. Shipping Address</legend>

            <div className={styles.formGroup}>
              <label htmlFor="street">Street Address *</label>
              <input
                id="street"
                type="text"
                name="street"
                value={formData.shippingAddress.street}
                onChange={(e) => handleAddressChange(e, "shippingAddress")}
                placeholder="123 Main Street"
                required
                maxLength={100}
                disabled={loading}
                aria-invalid={!!errors["shippingAddress.street"]}
              />
              {errors["shippingAddress.street"] && (
                <span className={styles.error}>
                  {errors["shippingAddress.street"]}
                </span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.shippingAddress.city}
                  onChange={(e) => handleAddressChange(e, "shippingAddress")}
                  placeholder="New York"
                  required
                  maxLength={50}
                  disabled={loading}
                  aria-invalid={!!errors["shippingAddress.city"]}
                />
                {errors["shippingAddress.city"] && (
                  <span className={styles.error}>
                    {errors["shippingAddress.city"]}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state">State *</label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.shippingAddress.state}
                  onChange={(e) => handleAddressChange(e, "shippingAddress")}
                  placeholder="NY"
                  required
                  maxLength={50}
                  disabled={loading}
                  aria-invalid={!!errors["shippingAddress.state"]}
                />
                {errors["shippingAddress.state"] && (
                  <span className={styles.error}>
                    {errors["shippingAddress.state"]}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  id="zipCode"
                  type="text"
                  name="zipCode"
                  value={formData.shippingAddress.zipCode}
                  onChange={(e) => handleAddressChange(e, "shippingAddress")}
                  placeholder="10001"
                  required
                  maxLength={10}
                  disabled={loading}
                  aria-invalid={!!errors["shippingAddress.zipCode"]}
                />
                {errors["shippingAddress.zipCode"] && (
                  <span className={styles.error}>
                    {errors["shippingAddress.zipCode"]}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country">Country *</label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.shippingAddress.country}
                  onChange={(e) => handleAddressChange(e, "shippingAddress")}
                  placeholder="USA"
                  required
                  maxLength={50}
                  disabled={loading}
                  aria-invalid={!!errors["shippingAddress.country"]}
                />
                {errors["shippingAddress.country"] && (
                  <span className={styles.error}>
                    {errors["shippingAddress.country"]}
                  </span>
                )}
              </div>
            </div>

            {step === 1 && (
              <button
                type="button"
                className={styles.nextButton}
                onClick={handleNextStep}
                disabled={loading}
              >
                Continue to Billing →
              </button>
            )}
          </fieldset>
        )}

        {/* Step 2: Billing Address */}
        {step >= 2 && (
          <fieldset
            className={`${styles.step} ${step === 2 ? styles.active : ""}`}
          >
            <legend>2. Billing Address</legend>

            <div className={styles.formGroup + " " + styles.checkboxGroup}>
              <input
                id="sameAsBilling"
                type="checkbox"
                name="sameAsBilling"
                checked={formData.sameAsBilling}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    sameAsBilling: e.target.checked,
                  }));
                }}
                disabled={loading}
              />
              <label htmlFor="sameAsBilling">Same as shipping address</label>
            </div>

            {!formData.sameAsBilling && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="billing-street">Street Address *</label>
                  <input
                    id="billing-street"
                    type="text"
                    name="street"
                    value={formData.billingAddress.street}
                    onChange={(e) => handleAddressChange(e, "billingAddress")}
                    placeholder="123 Main Street"
                    required
                    maxLength={100}
                    disabled={loading}
                    aria-invalid={!!errors["billingAddress.street"]}
                  />
                  {errors["billingAddress.street"] && (
                    <span className={styles.error}>
                      {errors["billingAddress.street"]}
                    </span>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="billing-city">City *</label>
                    <input
                      id="billing-city"
                      type="text"
                      name="city"
                      value={formData.billingAddress.city}
                      onChange={(e) => handleAddressChange(e, "billingAddress")}
                      placeholder="New York"
                      required
                      maxLength={50}
                      disabled={loading}
                      aria-invalid={!!errors["billingAddress.city"]}
                    />
                    {errors["billingAddress.city"] && (
                      <span className={styles.error}>
                        {errors["billingAddress.city"]}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="billing-state">State *</label>
                    <input
                      id="billing-state"
                      type="text"
                      name="state"
                      value={formData.billingAddress.state}
                      onChange={(e) => handleAddressChange(e, "billingAddress")}
                      placeholder="NY"
                      required
                      maxLength={50}
                      disabled={loading}
                      aria-invalid={!!errors["billingAddress.state"]}
                    />
                    {errors["billingAddress.state"] && (
                      <span className={styles.error}>
                        {errors["billingAddress.state"]}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="billing-zipCode">ZIP Code *</label>
                    <input
                      id="billing-zipCode"
                      type="text"
                      name="zipCode"
                      value={formData.billingAddress.zipCode}
                      onChange={(e) => handleAddressChange(e, "billingAddress")}
                      placeholder="10001"
                      required
                      maxLength={10}
                      disabled={loading}
                      aria-invalid={!!errors["billingAddress.zipCode"]}
                    />
                    {errors["billingAddress.zipCode"] && (
                      <span className={styles.error}>
                        {errors["billingAddress.zipCode"]}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="billing-country">Country *</label>
                    <input
                      id="billing-country"
                      type="text"
                      name="country"
                      value={formData.billingAddress.country}
                      onChange={(e) => handleAddressChange(e, "billingAddress")}
                      placeholder="USA"
                      required
                      maxLength={50}
                      disabled={loading}
                      aria-invalid={!!errors["billingAddress.country"]}
                    />
                    {errors["billingAddress.country"] && (
                      <span className={styles.error}>
                        {errors["billingAddress.country"]}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className={styles.stepButtons}>
              <button
                type="button"
                className={styles.backButton}
                onClick={handlePreviousStep}
                disabled={loading}
              >
                ← Back to Shipping
              </button>
              <button
                type="button"
                className={styles.nextButton}
                onClick={handleNextStep}
                disabled={loading}
              >
                Continue to Payment →
              </button>
            </div>
          </fieldset>
        )}

        {/* Step 3: Review */}
        {step >= 3 && (
          <fieldset
            className={`${styles.step} ${step === 3 ? styles.active : ""}`}
          >
            <legend>3. Review & Confirm</legend>

            <div className={styles.reviewSection}>
              <h3>Shipping Address</h3>
              <p>{formData.shippingAddress.street}</p>
              <p>
                {formData.shippingAddress.city},{" "}
                {formData.shippingAddress.state}{" "}
                {formData.shippingAddress.zipCode}
              </p>
              <p>{formData.shippingAddress.country}</p>
            </div>

            {!formData.sameAsBilling && (
              <div className={styles.reviewSection}>
                <h3>Billing Address</h3>
                <p>{formData.billingAddress.street}</p>
                <p>
                  {formData.billingAddress.city},{" "}
                  {formData.billingAddress.state}{" "}
                  {formData.billingAddress.zipCode}
                </p>
                <p>{formData.billingAddress.country}</p>
              </div>
            )}

            <div className={styles.stepButtons}>
              <button
                type="button"
                className={styles.backButton}
                onClick={handlePreviousStep}
                disabled={loading}
              >
                ← Back to Billing
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading
                  ? "Creating Order..."
                  : "Create Order & Continue to Payment"}
              </button>
            </div>
          </fieldset>
        )}
      </div>

      {/* Order Summary */}
      <aside className={styles.orderSummary}>
        <h2>Order Summary</h2>
        <div className={styles.items}>
          {cartItems.map((item, index) => (
            <div key={index} className={styles.item}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className={styles.total}>
          <strong>Total:</strong>
          <strong>{formatPrice(total)}</strong>
        </div>
      </aside>
    </form>
  );
}
