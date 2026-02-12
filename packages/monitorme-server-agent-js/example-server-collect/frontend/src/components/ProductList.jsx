import React, { useState } from "react";

const products = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  image: `https://picsum.photos/200?random=${i}`,
  price: (Math.random() * 100).toFixed(2),
}));

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callService = async (product) => {
    setIsLoading(true);
    setSelectedProduct(product);
    try {
      const res = await fetch("http://localhost:3003/api/hello");
      const { data } = await res.json();
      console.log(JSON.stringify(data));
      setResponse(data.message || "No message found");
    } catch (error) {
      console.error("Error calling the service:", error);
      setResponse("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {response && (
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p className="text-blue-800">
            Response for {selectedProduct?.name}: {response}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="mb-4 w-32 h-32 object-scale-down"
            />
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-gray-500">${product.price}</p>
            <button
              onClick={() => callService(product)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading && selectedProduct?.id === product.id
                ? "Loading..."
                : "Get Info"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
