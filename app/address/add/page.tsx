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
  const [addresses, setAddresses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUserId(session.user.id);
      fetchAddresses(session.user.id);
    } else if (status === "unauthenticated") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User is not authenticated.",
      });
      router.push("/authentication");
    }
  }, [status, session, router]);

  const fetchAddresses = async (userId: string) => {
    try {
      const response = await axios.get(`/api/useraddress?userId=${userId}`);
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) throw new Error("User ID is required");

      const response = editMode
        ? await axios.put(`/api/useraddress`, { ...formData, userId, addressId: editAddressId })
        : await axios.post("/api/useraddress", { ...formData, userId });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: editMode ? "Address updated successfully!" : "Address saved successfully!",
      });
      fetchAddresses(userId);
      resetForm();
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

  const resetForm = () => {
    setFormData({
      doorNumber: "",
      contactInfo: "",
      street: "",
      village: "",
      city: "",
      state: "",
      country: "",
      pinNumber: "",
    });
    setEditMode(false);
    setEditAddressId(null);
  };

  const handleEdit = (address: any) => {
    setFormData(address);
    setEditMode(true);
    setEditAddressId(address._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/useraddress?addressId=${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Address deleted successfully!",
      });
      fetchAddresses(userId as string);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete address. Please try again.",
      });
    }
  };

  return (
    <>
      <CommonNavBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            {editMode ? "Edit Address" : "Add New Address"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="doorNumber"
                placeholder="Door Number"
                value={formData.doorNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="contactInfo"
                placeholder="Contact Info"
                value={formData.contactInfo}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="village"
                placeholder="Village"
                value={formData.village}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                name="pinNumber"
                placeholder="PIN Number"
                value={formData.pinNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 mt-6 text-white font-semibold rounded-md transition-all ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : editMode ? "Update Address" : "Save Address"}
            </button>
          </form>

          <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4">Saved Addresses</h3>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="p-4 bg-gray-100 rounded-md shadow flex justify-between items-center"
              >
                <span>{`${address.doorNumber}, ${address.street}, ${address.city}, ${address.state}, ${address.pinNumber}`}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressFormPage;
