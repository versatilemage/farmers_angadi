import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export async function POST(req) {
  const { itemsByProducer, consumerEmail, consumerName, paymentId } = await req.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "balajikrishna44589@gmail.com", // Your email address
        pass: "ebwd yojq jrdt huaw", // Your email app password
      },
    });

    for (const producerId in itemsByProducer) {
      const { producerEmail } = itemsByProducer[producerId];
      const producerInvoicePath = path.join(process.cwd(), "invoices", `producer_invoice_${producerId}_${paymentId}.pdf`);
      
      // Log producer email and file path for debugging
      console.log(`Preparing to send email to producer: ${producerEmail}`);
      console.log(`Checking invoice path: ${producerInvoicePath}`);

      if (!producerEmail) {
        console.warn(`Producer email not found for producer ID: ${producerId}, skipping.`);
        continue;
      }

      if (!fs.existsSync(producerInvoicePath)) {
        console.warn(`Producer invoice not found at ${producerInvoicePath} for producer ID: ${producerId}, skipping.`);
        continue;
      }

      const producerMailOptions = {
        from: "noreply@gmail.com",
        to: producerEmail,
        subject: "Your products have been purchased!",
        text: `Hello, your products have been purchased! Please find the invoice attached.`,
        attachments: [
          {
            filename: `producer_invoice_${producerId}_${paymentId}.pdf`,
            path: producerInvoicePath,
          },
        ],
      };

      // Send email and log success or failure
      try {
        await transporter.sendMail(producerMailOptions);
        console.log(`Email successfully sent to producer: ${producerEmail}`);
      } catch (mailError) {
        console.error(`Failed to send email to producer: ${producerEmail}`, mailError);
      }
    }

    const consumerInvoicePath = path.join(process.cwd(), "invoices", `invoice_${paymentId}.pdf`);
    console.log(`Consumer invoice path: ${consumerInvoicePath}`);

    if (!fs.existsSync(consumerInvoicePath)) {
      console.warn(`Consumer invoice not found at ${consumerInvoicePath} for payment ID: ${paymentId}, skipping.`);
    } else {
      const consumerMailOptions = {
        from: "noreply@gmail.com",
        to: consumerEmail,
        subject: "Thank you for your purchase!",
        text: `Hello ${consumerName}, thank you for your purchase! Your invoice is attached.`,
        attachments: [
          {
            filename: `invoice_${paymentId}.pdf`,
            path: consumerInvoicePath,
          },
        ],
      };

      try {
        await transporter.sendMail(consumerMailOptions);
        console.log(`Email successfully sent to consumer: ${consumerEmail}`);
      } catch (consumerMailError) {
        console.error(`Failed to send email to consumer: ${consumerEmail}`, consumerMailError);
      }
    }

    console.log(itemsByProducer, "producerEmail");

    return NextResponse.json({ message: "Invoices sent successfully" });
  } catch (error) {
    console.error("Error sending invoices:", error);
    return NextResponse.json({ error: "Failed to send invoices" }, { status: 500 });
  }
}
