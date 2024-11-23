// pages/product/add.tsx

"use client";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";
import Image from "next/image";
import AddProductBGImage from "@/public/assets/AddProductBGImage.jpg";
import BG from "@/public/assets/BG.jpg";

const AddProductForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Individual state for each input field
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("cost", cost);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("about", description);
    formData.append("measurement", measurement);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Show success toast
        Swal.fire({
          icon: "success",
          title: "Product Created Successfully!",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Redirect to home page
        router.push("/");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error submitting product.");
      console.error("Submission Error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${BG.src})` }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl flex overflow-hidden">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 space-y-8">
          <h2 className="text-4xl font-bold text-gray-800 text-center lg:text-left">
            Add Product
          </h2>

          <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-6">
            <div>
              <label className="block text-gray-600 font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Category</label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              >
                <option value="">Select Category</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Value Added Products">Value Added Products</option>

              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 font-medium">Price</label>
                <input
                  type="number"
                  name="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Enter discount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 font-medium">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="Enter stock quantity"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Description</label>
              <textarea
                name="about"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-3 rounded-xl w-full h-28 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Describe the product"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Measurement</label>
              <select
                name="measurement"
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              >
                <option value="">Select Measurement</option>
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Pieces">Pieces</option>
              </select>
            </div>

            <button
              type="submit"
              className={`w-full bg-teal-500 text-white font-semibold rounded-xl py-3 mt-4 transition duration-300 ${isSubmitting ? "opacity-50" : "hover:bg-teal-600"
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Product"}
            </button>

            {message && (
              <p className="text-center text-lg font-semibold text-green-600 mt-4">
                {message}
              </p>
            )}
          </form>
        </div>

        {/* Right Side - Decorative Image/Information */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-400 to-blue-500 items-center justify-center p-12">

          <div className="text-center text-white space-y-6 bg-black bg-opacity-50 p-6 rounded-xl">
            <h2 className="text-4xl font-bold">Product Details</h2>
            <p className="text-lg font-medium">
              Upload your product details accurately to make them stand out!
            </p>
            <div className="flex justify-center h-auto">
              <Image
                src={AddProductBGImage}
                alt="no image"
                width={100}
                height={100}
                className="object-cover h-28 xl:rounded-l-lg"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
