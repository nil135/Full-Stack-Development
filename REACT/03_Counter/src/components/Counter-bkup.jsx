import React, { useState } from "react";

const Counter = () => {
  const MIN = 0;
  const MAX = 10;

  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // Increment
  const handleIncrement = () => {
    if (count < MAX) {
      setCount(prev => prev + 1);
      setError("");
    }
  };

  // Decrement
  const handleDecrement = () => {
    if (count > MIN) {
      setCount(prev => prev - 1);
      setError("");
    }
  };

  // Reset
  const handleReset = () => {
    setCount(0);
    setError("");
  };

  // Set Value
  const handleSetValue = () => {
    const parsedValue = parseInt(inputValue, 10);

    if (isNaN(parsedValue)) {
      setError("Please enter a valid number");
      return;
    }

    if (parsedValue < MIN || parsedValue > MAX) {
      setError(`Value must be between ${MIN} and ${MAX}`);
      return;
    }

    setCount(parsedValue);
    setError("");
    setInputValue("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Counter: {count}</h2>
      <p>Min: {MIN} | Max: {MAX}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter number"
        />
        <button onClick={handleSetValue} style={{ marginLeft: "10px" }}>
          Set Value
        </button>
      </div>

      <div>
        <button onClick={handleIncrement} disabled={count >= MAX}>
          Increment
        </button>

        <button
          onClick={handleDecrement}
          disabled={count <= MIN}
          style={{ marginLeft: "10px" }}
        >
          Decrement
        </button>

        <button onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Counter;
