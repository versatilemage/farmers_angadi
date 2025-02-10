import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/user";
import { sign } from "jsonwebtoken";

type ContactFormType = {
  emailId: string;
};

export async function POST(req: NextRequest) {
  const body: ContactFormType = await req.json();

  if (!body) {
    return NextResponse.json({ message: "Body is missing" }, { status: 203 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
      user: process.env.MAIL_SERVICE_ID,
      pass: process.env.MAIL_SERVICE_PASSWORD,
    },
  });

  try {
    const userData = await User.findOne({ email: body.emailId });
    if (!userData) {
      return NextResponse.json(
        { message: "Given user email doesn't exist" },
        { status: 401 }
      );
    }
    const token = sign(
      {
        userId: userData._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    const returnResponseTemplate =  `
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your reset password link</title>
          <style>
          body, html {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
              background-color: #f9f9f9;
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .header h1 {
              color: #333;
          }
          .content {
              margin-bottom: 20px;
          }
          .footer {
              text-align: center;
          }
          .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 4px;
          }
          @media (max-width: 480px) {
              .container {
              padding: 10px;
              }
              .header h1 {
              font-size: 24px;
              }
          }
          </style>
      </head>
      <body>
          <div class="container">
          <div class="header">
              <h1>Farmer's Angadi</h1>
              <p>Your reset password link is given below</p>
          </div>
          <div class="content">
              <p>Dear ${userData.username},</p>
              <p>Your reset password link</p>
              <a href=${link} target="_blank">click here</a>
              <p>The link will be expired in 2 hours</p>
          </div>
          <div class="footer">
              <p>Best Regards,<br>Farmer's Angadi</p>
              <a href="https://farmersangadi.com/" class="btn">Visit Our Website</a>
          </div>
          </div>
      </body>
      </html>
    `;
    const returnMailTemplate = {
      from: process.env.MAIL_SERVICE_ID,
      to: body.emailId,
      subject: `Hi from Farmer's Angadi`,
      html: returnResponseTemplate,
    };
    await transporter.sendMail(returnMailTemplate);

    return NextResponse.json(
      { message: "Reset password link sent successfully" },
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
