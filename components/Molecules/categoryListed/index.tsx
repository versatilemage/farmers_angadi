"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Assuming next-auth is used for auth
import MiniProductCard from "@/components/Atoms/miniProductCard";
import axios from "axios";

const AllCategoryListed = () => {
  const { data: session } = useSession(); // Get current session data
  const currentUserId = session?.user?.id; // Get user ID from session

  const [productData, setProductData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory && selectedCategory !== "All"
          ? `/api/product?category=${selectedCategory}`
          : "/api/product";
      const response = await axios.get(url);

      if (response.data && response.data.data) {
        setProductData(response.data.data);
      } else {
        setProductData([]);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const categories = ["All", "Fruits", "Vegetables"];

  // Group products by category
  const groupedProducts = productData.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="product-list-container max-w-7xl mx-auto px-4 py-8">
      {/* Category Buttons */}
      <div className="categories-filter flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full py-20">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent border-t-4 rounded-full animate-spin"></div>
        </div>
      ) : productData.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-xl">
          No data available
        </div>
      ) : (
        <div className="space-y-8">
          {selectedCategory === "All" || selectedCategory === "" ? (
            Object.entries(groupedProducts).map(([category, products]) => (
              <div key={category} className="category-section">
                <h2 className="text-2xl font-semibold text-primary mb-4 capitalize">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="flex flex-col gap-6">
                       <MiniProductCard
                    data={product}
                    isCreator={product.creatorId === currentUserId}
                    refreshProducts={fetchProducts} // Pass the function
                  />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productData.map((product) => (
                <div key={product._id} className="flex flex-col gap-6">
                 <MiniProductCard
                    data={product}
                    isCreator={product.creatorId === currentUserId}
                    refreshProducts={fetchProducts} // Pass the function
                  />
          
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllCategoryListed;
