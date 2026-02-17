import { useState } from "react";

export default function Counter() {
     const [count, setCount] = useState(0);
     const [countText, setCountText] = useState(0);

     return (
          <div className="my-4 p-4 shadow-sm bg-white rounded card">
               <h1 className="text-xl font-bold mb-2">Counter</h1>
               <p className="text-gray-700">Your count is {count}</p>

               <div className="flex justify-center gap-4 mt-4">
                    <button
                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
                         onClick={() => setCount(count + 1)}
                    >
                         Increment
                    </button>
                    <button disabled={count === 0}
                         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                         onClick={() => setCount((count) => Math.max(0, count - 1))}
                    >
                         Decrement
                    </button>
                    <button
                         className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-300"
                         onClick={() => setCount(0)}
                    >
                         Reset
                    </button>
               </div>

               <div className="flex justify-center gap-4 my-4">
                    <input
                         onChange={(e) => setCountText(e.target.value)}
                         type="text"
                         placeholder="Enter your value"
                         value={countText}
                         className="px-4 py-2 border rounded mt-4"
                    />
                    <button
                         onClick={() => {
                              setCount(parseInt(countText) || 0);
                              setCountText(0);
                         }
                         }
                         className="mt-4 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                         Set to {countText}
                    </button>
               </div>

          </div>
     );
}
