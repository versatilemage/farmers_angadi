// app/api/sendInvoice/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(req) {
    const { itemsByProducer, consumerEmail, consumerName, paymentId, allProductNames } = await req.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "asolinmaso22@gmail.com", // Your email address
        pass: "fleh qyzm jmqi umfl"
      },
    });
    
    const filePath = path.join(process.cwd(), "invoices", `invoice_${paymentId}.pdf`);
    const attachment = fs.readFileSync(filePath);

    for (const producerId in itemsByProducer) {
        const { producerEmail, items } = itemsByProducer[producerId];
  
        const producerMailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: producerEmail,
          subject: "Your products have been purchased!",
          text: `Congratulations! The following items were purchased by ${consumerName}: ${items.join(", ")}.`,
          attachments: [
            {
              filename: `invoice_${paymentId}.pdf`,
              content: attachment,
            },
          ],
        };
  
        await transporter.sendMail(producerMailOptions);
      }
  
      // Send a single email to the consumer with all products
      const consumerMailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: consumerEmail,
        subject: "Your purchase was successfully placed!",
        text: `Thank you for your purchase, ${consumerName}! Your order includes: ${allProductNames.join(", ")}.`,
        attachments: [
          {
            filename: `invoice_${paymentId}.pdf`,
            content: attachment,
          },
        ],
      };
  
      await transporter.sendMail(consumerMailOptions);
    return NextResponse.json({ message: "Invoice sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
