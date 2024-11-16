"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";
import IndividualCartProductCard from "@/components/Molecules/CartCard";
import { CartItemInterface } from "@/utils/interface";
import { useAuth } from "@/components/Wrapper/universalState";
import { useRouter } from "next/navigation";

const CartOrganelles = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Use session to get user info
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [cgst, setCgst] = useState(0);

  const [deliveryCharge, setDeliveryCharge] = useState(80); // Fixed delivery charge
  const [totalCartAmount, setTotalCartAmount] = useState(0); 
  const [editCard, setEditCard] = useState(false);
  const { selectedAddress } = useAuth();
  const [deleteInitiated, setDeleteInitiated] = useState(false);
  const [changesRequestedcards, setChangesRequestCards] = useState<
    CartItemInterface[]
  >([]);
  console.log(totalCartAmount,typeof(totalCartAmount),"kj");

  useEffect(() => {
    // Recalculate totals when cart items or their quantities change
    const calculatedSubtotal = cartItems.reduce((acc, item) => {
      const product = item.productDetails;
      const itemTotal = (product.cost - product.discount) * item.productCount;
      return acc + itemTotal;
    }, 0);

    const calculatedGst = calculatedSubtotal * 0.08; // 8% GST
    const calculatedCGst = calculatedSubtotal * 0.08; // 8% GST
    const calculatedTotal = calculatedSubtotal + deliveryCharge + calculatedGst + calculatedCGst;

    setSubtotal(calculatedSubtotal);
    setGst(calculatedGst);
    setCgst(calculatedCGst);

    setTotalCartAmount(calculatedTotal);
  }, [cartItems]);

  // Fetch cart items for the current user
  const fetchData = async () => {
    if (!session?.user?.id) return;

    try {
      setCartLoading(true);

      const fetchCartData = await axios.get(
        `/api/cart?userId=${session.user.id}`
      );

      if (fetchCartData.data?.items?.length) {
        // Filter out items with "PAID" status
        const activeCartItems = fetchCartData.data.items.filter(
          (item) => item.status === "CART"
        );
        setCartItems(activeCartItems);
        setEditCard(false);
      } else {
        setCartItems([]);
      }

      setCartLoading(false);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id && (!cartItems.length || deleteInitiated)) {
      fetchData();
      setDeleteInitiated(false);
    }
  }, [session, deleteInitiated]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onCheckout = async () => {
    if (!cartItems.length) {
      Swal.fire({ icon: "error", text: "Your cart is empty.", timer: 3000 });
      return;
    }
    if (!selectedAddress) {
      Swal.fire({
        icon: "warning",
        title: "No Delivery Address Selected",
        html: `
          <p>Please select a delivery address before proceeding.</p>
          <button id="add-location-btn" class="swal2-confirm swal2-styled">
            Add New Location
          </button>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          const addLocationButton = document.getElementById("add-location-btn");
          if (addLocationButton) {
            addLocationButton.addEventListener("click", () => {
              Swal.close();
              router.push("/address/add");
            });
          }
        },
      });
      return;
    }
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        Swal.fire({ icon: "error", text: "Razorpay SDK failed to load.", timer: 3000 });
        return;
      }
      const totalAmountInPaise = Math.round(totalCartAmount * 100);

      const response = await axios.post("/api/razorpayOrder", {
        amount: Number(totalAmountInPaise),
        userId: session.user.id,
      });

      const { orderId } = response.data;
      if (!orderId) {
        Swal.fire({ icon: "error", text: "Failed to create order.", timer: 3000 });
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalCartAmount * 100,
        currency: "INR",
        name: "Farmers Angadi",
        description: "Purchase from Angadi Shop",
        order_id: orderId,
        handler: async function (paymentResponse) {
          try {
            // Update cart items and status
            await axios.post("/api/cart/updateCartStatus", {
              userId: session.user.id,
              paymentId: paymentResponse.razorpay_payment_id,
            });

            // Call /api/generateInvoice to create the invoices
            const itemsByProducer = cartItems.reduce((acc, item) => {
              const producerId = item.productDetails.creatorDetails._id;
              const producerEmail = item.productDetails.creatorDetails.email;
            
              if (!acc[producerId]) {
                acc[producerId] = {
                  producerEmail,
                  items: [],
                };
              }
            
              acc[producerId].items.push(item);
              return acc;
            }, {});
            
            const invoiceResponse = await axios.post("/api/generateInvoice", {
              userName: session.user.username,
              paymentId: paymentResponse.razorpay_payment_id,
              cartItems,
              itemsByProducer, // Include the constructed itemsByProducer
              totalAmount: totalCartAmount,
            });

            // Call /api/sendInvoice to send the invoices
            await axios.post("/api/sendInvoice", {
              itemsByProducer: cartItems.reduce((acc, item) => {
                const producerId = item.productDetails.creatorDetails._id;
                if (!acc[producerId]) {
                  acc[producerId] = {
                    producerEmail: item.productDetails.creatorDetails.email,
                    items: [],
                  };
                }
                acc[producerId].items.push(item);
                return acc;
              }, {}),
              consumerEmail: session.user.email,
              consumerName: session.user.username,
              paymentId: paymentResponse.razorpay_payment_id,
            });

            Swal.fire({
              icon: "success",
              text: `Payment and invoice generation successful!`,
              timer: 3000,
            });

            fetchData(); // Refresh cart data
          } catch (error) {
            console.error("Error after payment:", error);
            Swal.fire({
              icon: "error",
              text: "Payment was successful, but something went wrong afterward.",
              timer: 3000,
            });
          }
        },
        prefill: {
          name: session?.user?.username || "Your Name",
          email: session?.user?.email || "email@example.com",
          contact: "8220158319",
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      Swal.fire({
        icon: "error",
        text: "Something went wrong during checkout.",
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex items-center flex-col max-w-[1280px] w-full h-full p-6 gap-10">
        <h1 className="text-xl font-semibold text-[#333333] h-max max-w-[1024px] w-full uppercase">
          Cart
        </h1>

        {/* Cart Items Section */}
        <div className="flex flex-col items-center justify-start h-full w-full relative overflow-y-scroll min-h-[50vh]">
          {cartLoading && (
            <div className="absolute w-full h-full flex flex-col items-center justify-center bg-white/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="animate-spin"
              >
                <g fill="green">
                  <path
                    fillRule="evenodd"
                    d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                    clipRule="evenodd"
                    opacity="0.2"
                  />
                  <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                </g>
              </svg>
            </div>
          )}

          {!cartItems.length && !cartLoading ? (
            <div className="m-auto h-full w-full min-h-[50vh] text-center flex items-center justify-center">
              <p>No items available in the cart</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <IndividualCartProductCard
                key={item._id}
                items={item}
                changeIfEditted={setEditCard}
                changedData={changesRequestedcards}
                setChangedData={setChangesRequestCards}
                toDelete={setDeleteInitiated}
                onItemCountChange={(updatedItem) => {
                  // Update the cartItems state with the new item count
                  setCartItems((prevItems) =>
                    prevItems.map((item) =>
                      item._id === updatedItem._id ? { ...item, productCount: updatedItem.productCount } : item
                    )
                  );
                }}
              />
            ))
          )}
        </div>

        {/* Total Cart Amount */}
        {cartItems.length > 0 && (
          <div className="w-full max-w-[1024px] flex flex-col gap-2">
            <p className="text-lg font-semibold">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p className="text-lg font-semibold">GST (8%): ₹{gst.toFixed(2)}</p>
            <p className="text-lg font-semibold">CGST (8%): ₹{cgst.toFixed(2)}</p>
            <p className="text-lg font-semibold">Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
            <p className="text-2xl font-bold">Total: ₹{totalCartAmount.toFixed(2)}</p>
          </div>
        )}
        {/* Action Buttons */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <button
              className="bg-blue-500 text-white px-5 py-3 rounded-sm min-w-[150px]"
              onClick={onCheckout}
            >
              Checkout
            </button>
          </div>
          <p className="text-sm text-[#333333]">(or)</p>
          <Link href={`/products`}>Keep Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default CartOrganelles;
