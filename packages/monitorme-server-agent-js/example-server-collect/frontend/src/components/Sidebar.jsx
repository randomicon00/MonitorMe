import React, { useState } from "react";

const Sidebar = () => {
  const [filterError, setFilterError] = useState("");

  const handleCategoryChange = async (event) => {
    try {
      const response = await fetch("http://localhost:3003/api/hello");
      if (!response.ok) {
        throw new Error(`Failed to update filters: ${response.statusText}`);
      }
      setFilterError("");
    } catch (error) {
      console.error("Error updating filters:", error);
      setFilterError("Unable to apply filters. Please try again.");
    }
  };

  const handlePriceChange = async () => {
    try {
      const res = await fetch("http://localhost:3003/api/invalid-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ example: "data" }),
      });

      if (!res.ok) {
        throw new Error(
          `HTTP error! status: ${res.status}, statusText: ${res.statusText}`,
        );
      }

      const data = await res.json();
      console.log(JSON.stringify(data));
    } catch (error) {
      console.error("Error calling the invalid POST service:", error);
    }
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">Filters</h2>

      {filterError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {filterError}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-2">Category</label>
        <select
          className="border border-gray-300 rounded-md w-full p-2"
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Price</label>
        <input
          type="range"
          min="0"
          max="1000"
          className="w-full"
          onChange={handlePriceChange}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
