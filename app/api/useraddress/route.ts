import UserAddressModel from "@/models/useraddress";
import connectMongo from "@/utils/Database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        const address = await UserAddressModel.find({ userId });
        return NextResponse.json(address || {});
    } catch (error) {
        return NextResponse.json({ message: "Error fetching address", error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectMongo();
    const { userId, doorNumber, contactInfo, street, village, city, state, country, pinNumber } = await request.json();

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        const newAddress = await UserAddressModel.create({
            userId,
            doorNumber,
            contactInfo,
            street,
            village,
            city,
            state,
            country,
            pinNumber,
        });
        return NextResponse.json(newAddress);
    } catch (error) {
        return NextResponse.json({ message: "Error saving address", error }, { status: 500 });
    }
}