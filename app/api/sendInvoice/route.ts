import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { itemsByProducer, consumerEmail, consumerName, paymentId, invoiceUrls } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SERVICE_ID,
        pass: process.env.MAIL_SERVICE_PASSWORD,
      },
    });

    for (const producerId in itemsByProducer) {
      const { producerEmail } = itemsByProducer[producerId];

      if (!producerEmail) continue;
      const invoiceUrl = invoiceUrls[`producer_${producerId}_${paymentId}`];

      if (!invoiceUrl) continue;

      await transporter.sendMail({
        from: process.env.MAIL_SERVICE_ID,
        to: producerEmail,
        subject: "Your products have been purchased!",
        text: "Hello, your products have been purchased! Please find the invoice attached.",
        attachments: [{ filename: `producer_invoice_${producerId}_${paymentId}.pdf`, path: invoiceUrl }],
      });
    }

    const consumerInvoiceUrl = invoiceUrls[`consumer_${paymentId}`];

    if (consumerInvoiceUrl) {
      await transporter.sendMail({
        from: process.env.MAIL_SERVICE_ID,
        to: consumerEmail,
        subject: "Thank you for your purchase!",
        text: `Hello ${consumerName}, thank you for your purchase! Your invoice is attached.`,
        attachments: [{ filename: `invoice_${paymentId}.pdf`, path: consumerInvoiceUrl }],
      });
    }

    return NextResponse.json({ message: "Invoices sent successfully" });
  } catch (error) {
    console.error("Error sending invoices:", error);
    return NextResponse.json({ error: "Failed to send invoices" }, { status: 500 });
  }
}
