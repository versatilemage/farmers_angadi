import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { put } from "@vercel/blob";
import CartModel from "@/models/cart";
import ProductStockSchema from "@/models/product/stock";

export async function POST(req: Request) {
  try {
    const { userId, userName, paymentId, cartItems, itemsByProducer } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || !itemsByProducer) {
      throw new Error("Invalid or missing data.");
    }

    // Mark cart items as PAID
    await CartModel.updateMany({ userId, status: "CART" }, { $set: { status: "PAID" } });

    // Generate and upload consumer invoice
    const consumerInvoiceUrl = await generateAndUploadPDF({
      title: "Farmers Angadi - INVOICE",
      details: {
        userName,
        paymentId,
        cartItems,
        deliveryCharge: 60,
        gstRate: 0,
      },
      fileName: `invoice_${paymentId}.pdf`,
    });

    // Generate and upload producer-specific invoices
    const producerInvoiceUrls: Record<string, string> = {};
    for (const producerId in itemsByProducer) {
      producerInvoiceUrls[producerId] = await generateAndUploadPDF({
        title: "Farmers Angadi - PRODUCER INVOICE",
        details: {
          userName: `Producer ID: ${producerId}`,
          paymentId,
          cartItems: itemsByProducer[producerId].items,
          deliveryCharge: 0,
          gstRate: 0,
        },
        fileName: `producer_invoice_${producerId}_${paymentId}.pdf`,
      });
    }

    // Update product stock
    for (const item of cartItems) {
      const { productId, productCount } = item;
      await ProductStockSchema.findOneAndUpdate(
        { productId },
        { $inc: { stock: -productCount } },
        { new: true }
      );
    }

    return NextResponse.json({
      message: "Invoices generated successfully",
      consumerInvoiceUrl,
      producerInvoiceUrls,
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}

// ✅ Utility function to generate and upload PDFs to Vercel Blob
async function generateAndUploadPDF({ title, details, fileName }: { title: string, details: any, fileName: string }) {
  const { userName, paymentId, cartItems, deliveryCharge, gstRate } = details;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 700]);
  const { width, height } = page.getSize();
  const fontSize = 12;

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Header
  page.drawText(title, { x: 50, y: height - 50, size: 20, font: fontBold, color: rgb(0, 0.2, 0.5) });

  page.drawLine({ start: { x: 50, y: height - 70 }, end: { x: width - 50, y: height - 70 }, thickness: 1, color: rgb(0, 0, 0) });

  page.drawText(`Customer/Producer: ${userName}`, { x: 50, y: height - 100, size: fontSize, font: fontRegular });
  page.drawText(`Payment ID: ${paymentId}`, { x: 50, y: height - 120, size: fontSize, font: fontRegular });

  // Table headers
  let tableY = height - 160;
  page.drawText("Item", { x: 50, y: tableY, font: fontBold, size: fontSize });
  page.drawText("Quantity", { x: 280, y: tableY, font: fontBold, size: fontSize });
  page.drawText("Price", { x: 380, y: tableY, font: fontBold, size: fontSize });
  page.drawText("Total", { x: 480, y: tableY, font: fontBold, size: fontSize });

  page.drawLine({ start: { x: 50, y: tableY - 10 }, end: { x: width - 50, y: tableY - 10 }, thickness: 0.5, color: rgb(0, 0, 0) });

  tableY -= 30;

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.productDetails;
    const itemTotal = (product.cost - product.discount) * item.productCount;

    page.drawText(product.name, { x: 50, y: tableY, size: fontSize, font: fontRegular });
    page.drawText(`${item.productCount}`, { x: 280, y: tableY, size: fontSize, font: fontRegular });
    page.drawText(`${(product.cost - product.discount).toFixed(2)}`, { x: 380, y: tableY, size: fontSize, font: fontRegular });
    page.drawText(`${itemTotal.toFixed(2)}`, { x: 480, y: tableY, size: fontSize, font: fontRegular });

    tableY -= 20;
    return acc + itemTotal;
  }, 0);

  // Delivery charge and GST
  if (deliveryCharge > 0) {
    page.drawText(`Delivery Charge: ${deliveryCharge.toFixed(2)}`, { x: 400, y: tableY, size: fontSize, font: fontBold, color: rgb(0, 0, 0) });
    tableY -= 20;
  }

  if (gstRate > 0) {
    const gstAmount = subtotal * gstRate;
    page.drawText(`GST (${(gstRate * 100).toFixed(0)}%): ${gstAmount.toFixed(2)}`, { x: 400, y: tableY, size: fontSize, font: fontBold, color: rgb(0, 0, 0) });
    tableY -= 20;
  }

  page.drawText(`Total Amount: ${(subtotal + deliveryCharge + gstRate * subtotal).toFixed(2)}`, { x: 400, y: tableY, size: fontSize + 2, font: fontBold, color: rgb(0.2, 0.5, 0.2) });

  // Convert to Buffer & Upload to Vercel Blob
  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);

  const blob = await put(fileName, buffer, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url; // Public URL of uploaded invoice
}
