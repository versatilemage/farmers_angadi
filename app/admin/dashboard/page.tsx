"use client";

import CartItemsTab from '@/components/Organelles/Admin/Cart';
import ProductsTab from '@/components/Organelles/Admin/Products';
import UsersTab from '@/components/Organelles/Admin/Users';
import { useState } from 'react';

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your store</p>
        </div>
        <div className="flex flex-col mt-4">
          <button
            className={`py-3 px-6 text-left transition-colors ${
              selectedTab === 'products' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedTab("products")}
          >
            Products
          </button>
          <button
            className={`py-3 px-6 text-left transition-colors ${
              selectedTab === 'cart' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedTab("cart")}
          >
            Cart Items
          </button>
          <button
            className={`py-3 px-6 text-left transition-colors ${
              selectedTab === 'users' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedTab("users")}
          >
            Users
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-gray-600">View and manage all aspects of your store here.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {selectedTab === "products" && <ProductsTab />}
          {selectedTab === "cart" && <CartItemsTab />}
          {selectedTab === "users" && <UsersTab />}
        </div>
      </main>
    </div>
  );
}
