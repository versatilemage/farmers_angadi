// pages/admin/components/ProductsTab.tsx

import { useEffect, useState } from 'react';

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/product');
    const data = await res.json();
    setProducts(data?.data || []);
    setLoading(false);
  };

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const res = await fetch(`/api/product?productId=${productId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts(products.filter((product) => product._id !== productId));
    } else {
      console.error("Failed to delete product");
    }
  };

  if (loading) return <div className="flex justify-center"><div className="loader"></div></div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left p-4 font-medium">Product Name</th>
            <th className="text-left p-4 font-medium">Price</th>
            <th className="text-left p-4 font-medium">Category</th>
            <th className="text-left p-4 font-medium">Stock</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b">
              <td className="p-4">{product.name}</td>
              <td className="p-4">{product.cost}</td>
              <td className="p-4">{product.category}</td>
              <td className="p-4">{product.stockData?.stock || 'N/A'}</td>
              <td className="p-4">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
