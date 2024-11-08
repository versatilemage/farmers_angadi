"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";
import CommonNavBar from "@/components/Molecules/NavBar";

const AddressFormPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    doorNumber: "",
    contactInfo: "",
    street: "",
    village: "",
    city: "",
    state: "",
    country: "",
    pinNumber: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUserId(session.user.id);
    } else if (status === "unauthenticated") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User is not authenticated.",
      });
      router.push("/authentication");
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) throw new Error("User ID is required");

      const response = await axios.post("/api/useraddress", {
        ...formData,
        userId,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Address saved successfully!",
        });
        router.push("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to save address. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <CommonNavBar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Add New Address</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="doorNumber" className="block text-sm font-medium text-gray-700">Door Number</label>
              <input
                type="text"
                name="doorNumber"
                id="doorNumber"
                placeholder="Enter door number"
                value={formData.doorNumber}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                id="contactInfo"
                placeholder="Enter contact number"
                value={formData.contactInfo}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                name="street"
                id="street"
                placeholder="Enter street"
                value={formData.street}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700">Village</label>
              <input
                type="text"
                name="village"
                id="village"
                placeholder="Enter village"
                value={formData.village}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                id="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="pinNumber" className="block text-sm font-medium text-gray-700">PIN Number</label>
            <input
              type="number"
              name="pinNumber"
              id="pinNumber"
              placeholder="Enter PIN number"
              value={formData.pinNumber}
              onChange={handleInputChange}
              required
              className="mt-1 w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-6 text-white font-semibold rounded-md transition-all duration-300 ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddressFormPage;
