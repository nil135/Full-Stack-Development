import Button from "./Button.jsx";

function Card({ title, description, imageUrl }) {
     return (
          <div className="card shadow-sm transition-sha duration-300 hover:shadow-lg rounded-lg overflow-hidden shadow-lg bg-white">
               <img src={imageUrl} alt={title} className="card-image h-32 w-full object-cover" />
               <div className="card-content p-4">
                    <h2 className="card-title text-xl font-bold text-gray-700">{title}</h2>
                    <p className="py-4 card-description text-gray-400">{description}</p>
                    <Button className="cursor-pointer" btnLabel="Buy Now" />
               </div>
          </div>
     );
}

export default Card;