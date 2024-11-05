// pages/admin/components/CartItemsTab.tsx
import { useEffect, useState } from 'react';

export default function CartItemsTab() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllCartItems() {
      const res = await fetch('/api/cart?admin=true');
      const data = await res.json();
      setCartItems(data.items || []);
      setLoading(false);
    }
    fetchAllCartItems();
  }, []);

  if (loading) return <div className="flex justify-center"><div className="loader"></div></div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left p-4 font-medium">Username</th>
            <th className="text-left p-4 font-medium">Email</th>
            <th className="text-left p-4 font-medium">Product</th>
            <th className="text-left p-4 font-medium">Quantity</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Payment Amount</th>
            <th className="text-left p-4 font-medium">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="p-4">{item.userDetails.username}</td>
              <td className="p-4">{item.userDetails.email}</td>
              <td className="p-4">{item.productDetails.name}</td>
              <td className="p-4">{item.productCount}</td>
              <td className="p-4">{item.status}</td>
              <td className="p-4">{item.paymentDetails?.amount || 'N/A'}</td>
              <td className="p-4">{item.paymentDetails?.date || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
