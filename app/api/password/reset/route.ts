import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import { verify } from "jsonwebtoken";

type ContactFormType = {
  password: string;
  token: string;
};

export async function POST(req: NextRequest) {
  const body: ContactFormType = await req.json();

  if (!body || !body.token || !body.password) {
    return NextResponse.json({ message: "Body is missing or some required values are missing from body" }, { status: 203 });
  }

  try {
    const userVerifyData = verify(
      body.token,
      process.env.JWT_SECRET
    ) as unknown as { userId: string };
    if (!userVerifyData) {
      return NextResponse.json(
        { message: "The given reset link has been expired" },
        { status: 403 }
      );
    }
    const userData = await User.findOne({ _id: userVerifyData.userId });
    if (!userData) {
      return NextResponse.json(
        { message: "Given user data doesn't exist" },
        { status: 401 }
      );
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    await User.findOneAndUpdate(
      { _id: userVerifyData.userId },
      { password: hashedPassword },
      { upsert: true }
    );
    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("err", err);
    return NextResponse.json(
      { message: "Something went wrong while sending the email" },
      { status: 500 }
    );
  }
}
