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

export async function PUT(request) {
    await connectMongo();
    const { userId, addressId, doorNumber, contactInfo, street, village, city, state, country, pinNumber } = await request.json();
  
    if (!userId || !addressId) {
      return NextResponse.json({ message: "User ID and Address ID are required" }, { status: 400 });
    }
  
    try {
      const updatedAddress = await UserAddressModel.findByIdAndUpdate(
        addressId,
        { userId, doorNumber, contactInfo, street, village, city, state, country, pinNumber },
        { new: true }
      );
  
      if (!updatedAddress) {
        return NextResponse.json({ message: "Address not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedAddress);
    } catch (error) {
      return NextResponse.json({ message: "Error updating address", error }, { status: 500 });
    }
  }
  

  export async function PATCH(request) {
    await connectMongo();
    const { userId, addressId } = await request.json();
  
    if (!userId || !addressId) {
      return NextResponse.json({ message: "User ID and Address ID are required" }, { status: 400 });
    }
  
    try {
      // Set all other addresses for the user to `default: false`
      await UserAddressModel.updateMany({ userId }, { default: false });
  
      // Set the selected address to `default: true`
      const updatedAddress = await UserAddressModel.findByIdAndUpdate(
        addressId,
        { default: true },
        { new: true }
      );
  
      if (!updatedAddress) {
        return NextResponse.json({ message: "Address not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedAddress);
    } catch (error) {
      return NextResponse.json({ message: "Error setting default address", error }, { status: 500 });
    }
  }

  
  // Delete Address
  export async function DELETE(request) {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("addressId");
  
    if (!addressId) {
      return NextResponse.json({ message: "Address ID is required" }, { status: 400 });
    }
  
    try {
      const deletedAddress = await UserAddressModel.findByIdAndDelete(addressId);
  
      if (!deletedAddress) {
        return NextResponse.json({ message: "Address not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Address deleted successfully" });
    } catch (error) {
      return NextResponse.json({ message: "Error deleting address", error }, { status: 500 });
    }
  }