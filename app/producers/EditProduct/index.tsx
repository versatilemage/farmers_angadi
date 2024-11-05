import { useEffect, useState } from "react";
import Image from "next/image";

const EditProductForm = ({ productId, onClose }: { productId: string; onClose: () => void }) => {
  const [product, setProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product?productId=${productId}`);
        const data = await response.json();
        setProduct(data.data);
        setPreviewImage(data.data.image);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.append("productId", productId);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await fetch("/api/product", {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product updated successfully!");
        onClose();
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error updating product.");
      console.error("Update Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md h-[80vh] overflow-hidden relative transition-transform transform-gpu scale-95 hover:scale-100 duration-200 ease-out">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-lg">
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Edit Product</h2>

        {/* Scrollable Form */}
        <form onSubmit={onSubmit} className="px-6 pb-14 overflow-y-auto h-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Product Name</label>
            <input
              type="text"
              name="name"
              defaultValue={product.name}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Category</label>
            <select
              name="category"
              defaultValue={product.category}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            >
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Price</label>
              <input
                type="number"
                name="cost"
                defaultValue={product.cost}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Discount</label>
              <input
                type="number"
                name="discount"
                defaultValue={product.discount}
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Upload Image</label>
            {previewImage && (
              <div className="mb-4">
                <img src={previewImage} alt="Product Preview" className="w-24 h-24 object-cover rounded-lg shadow-md" />
              </div>
            )}
            <input
              type="file"
              name="image"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Stock</label>
            <input
              type="number"
              name="stock"
              defaultValue={product.stockData?.stock}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Description</label>
            <textarea
              name="about"
              defaultValue={product.about}
              className="border border-gray-300 p-3 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            ></textarea>
          </div>

          {/* Submit Button and Message */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className={`w-full bg-teal-500 text-white font-semibold rounded-lg py-3 transition duration-300 ${
                isSubmitting ? "opacity-50" : "hover:bg-teal-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>

            {message && <p className="text-center text-green-600 font-medium mt-4">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
