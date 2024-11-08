// app/api/sendInvoice/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(req) {
  const { producerEmail, consumerEmail, paymentId } = await req.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "asolinmaso22@gmail.com", // Your email address
        pass: "fleh qyzm jmqi umfl"
      },
    });
    console.log(producerEmail,consumerEmail,"kklh");
    
    const filePath = path.join(process.cwd(), "invoices", `invoice_${paymentId}.pdf`);
    const attachment = fs.readFileSync(filePath);

    const producerMailOptions = {
      from: "asolinmaso22@gmail.com",
      to: producerEmail,
      subject: "Your product(s) have been purchased!",
      text: "These Products are sold successfully",
      attachments: [
        {
          filename: `invoice_${paymentId}.pdf`,
          content: attachment,
        },
      ],
    };

    const consumerMailOptions = {
        from: "asolinmaso22@gmail.com",
        to:  consumerEmail,
        subject: "Purchase Invoice",
        text: "Thank you for your purchase. Please find attached the invoice.",
        attachments: [
          {
            filename: `invoice_${paymentId}.pdf`,
            content: attachment,
          },
        ],
      };

      await transporter.sendMail(producerMailOptions);
      await transporter.sendMail(consumerMailOptions);
    return NextResponse.json({ message: "Invoice sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
