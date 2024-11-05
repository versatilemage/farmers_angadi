// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/Database";
import User from "@/models/user"; // Adjust path to your user model if necessary

export async function GET(req: NextRequest) {
  await connectMongo();

  try {
    const users = await User.find({}, { username: 1, email: 1, role: 1 }).lean();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
