import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactFormType = {
    name: string,
    emailId: string,
    query: string,
}

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

  const mailTemplate = `
  <div style="background: #f1f1f1; padding: 2%">
    <div>
      <span>user's name : ${body.name}</span>
      <br></br>
      <span>emailAddress : ${body.emailId}</span>
      <br></br>
      <span>message : ${body.query}</span>
      <br></br>
    </div>
  </div>`;

  const returnResponseTemplate = `
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farmer's Angadi - Thank You for Contacting Us</title>
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
        <p>Thank You for Contacting Us!</p>
      </div>
      <div class="content">
        <p>Dear ${body.name},</p>
        <p>We have received your message and someone from our team will get back to you shortly. Your inquiry is important to us, and we appreciate your patience.</p>
        <p>In the meantime, feel free to explore our website for more information about our products and services.</p>
      </div>
      <div class="footer">
        <p>Best Regards,<br>Farmer's Angadi</p>
        <a href="https://farmersangadi.com/" class="btn">Visit Our Website</a>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.MAIL_SERVICE_ID,
    to: process.env.MAIL_SERVICE_ID,
    subject: `${body.emailId} has contacted us`,
    html: mailTemplate,
  };

  const returnMailTemplate = {
    from: process.env.MAIL_SERVICE_ID,
    to: body.emailId,
    subject: `Hi from Farmer's Angadi`,
    html: returnResponseTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(returnMailTemplate);

    return NextResponse.json(
      { message: "Email sent successfully" },
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