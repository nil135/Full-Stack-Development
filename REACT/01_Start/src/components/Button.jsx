function Button({ btnLabel = "Click me", onClick }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-300"
    >
      {btnLabel}
    </button>
  );
}

export default Button;