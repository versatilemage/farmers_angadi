import connectMongo from "@/utils/Database";
import CartModel from "@/models/cart";

export async function POST(req) {
  const { userId, paymentId } = await req.json();

  try {
    await connectMongo();

    // Update cart items' status to "PAID"
    const result = await CartModel.updateMany(
      { userId, status: "CART" },
      { $set: { status: "PAID", paymentId } }
    );

    return new Response(
      JSON.stringify({ success: true, message: "Cart updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
