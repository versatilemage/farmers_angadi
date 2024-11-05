"use client";

import { FormEvent, useState, useEffect } from "react";


const StockMeasurementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedMeasurement, setSelectedMeasurement] = useState("");


  useEffect(() => {
    // Fetch product names and IDs to populate the dropdown
    async function fetchProducts() {
      try {
        const response = await fetch("/api/product/"); // Replace with actual endpoint to get product list
        const data = await response.json();
        console.log(data,"lkj");
        
        setProducts(data || []); // Assuming API returns { products: [...] }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/product/stock?categoryId=${selectedProductId}`, {
        method: "PUT",
        body: JSON.stringify({
          stock: formData.get("stock"),
          measurement: formData.get("measurement"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Stock updated successfully!");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error updating stock.");
      console.error("Submission Error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  const measurementOptions = ["Kg", "Liter", "Pieces"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 shadow-md rounded-lg w-full max-w-xl space-y-6"
      >
        <h2 className="text-xl font-bold text-center text-gray-700 mb-4">
          Update Stock Measurement
        </h2>

        <div className="mb-3">
          <label className="block text-sm text-gray-600">Select Product</label>
          <select
            name="categoryId"
            className="input-field"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Select Product --
            </option>
            {products?products?.data?.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            )):null}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Stock</label>
            <input type="number" name="stock" className="input-field" placeholder="Stock" required />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-600">Measurement</label>
            <select
              name="measurement"
              className="input-field"
              value={selectedMeasurement}
              onChange={(e) => setSelectedMeasurement(e.target.value)}
              required
            >
              <option value="" disabled>
                -- Select Measurement --
              </option>
              {measurementOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default StockMeasurementForm;
