// app/api/razorpayOrder/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, userId } = await req.json();

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Database connection
    // await connectMongo();

    // // Fetch user's cart items
    // const cartItems = await CartModel.find({ userId, status: "CART" });

    // // Update stock for all items in the cart
    // for (const item of cartItems) {
    //   const { productId, productCount } = item;

    //   // Reduce stock
    //   await ProductStockSchema.findOneAndUpdate(
    //     { productId },
    //     { $inc: { stock: -productCount } }, // Decrease stock by productCount
    //     { new: true }
    //   );
    // }

    // Mark cart items as paid
    // await CartModel.updateMany(
    //   { userId, status: "CART" },
    //   { $set: { status: "PAID" } }
    // );

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
