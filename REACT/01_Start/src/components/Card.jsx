import Button from "./Button.jsx";

function Card({ title, description, imageUrl }) {
  return (
    <div className="card rounded-lg overflow-hidden shadow-lg bg-white pb-4">
      <img src={imageUrl} alt={title} className="card-image h-48 w-full object-cover" />
      <div className="card-content py-4">
        <h2 className="card-title text-xl font-bold text-gray-700">{title}</h2>
        <p className="card-description text-gray-400">{description}</p>
      </div>
     <Button className="my-4 cursor-pointer" btnLabel="Buy Now" />
    </div>
  );
}

export default Card;