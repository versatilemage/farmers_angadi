import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { userName, paymentId, cartItems, itemsByProducer } = await req.json();
    console.log("Request Payload:", { userName, paymentId, cartItems, itemsByProducer });

    if (!cartItems || !Array.isArray(cartItems) || !itemsByProducer) {
      throw new Error("Invalid or missing data.");
    }

    console.log("Request Payload:", { userName, paymentId, cartItems, itemsByProducer });

    // Create invoices directory if not exists
    const invoicesDir = path.join(process.cwd(), "invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // Generate consumer invoice
    const consumerInvoicePath = path.join(invoicesDir, `invoice_${paymentId}.pdf`);
    await generatePDF({
      filePath: consumerInvoicePath,
      title: "Farmers Angadi - INVOICE",
      details: {
        userName,
        paymentId,
        cartItems,
        deliveryCharge: 80,
        gstRate: 0.08,
        cgstRate: 0.08,
      },
    });

    // Generate producer-specific invoices
    for (const producerId in itemsByProducer) {
      const producerInvoicePath = path.join(
        invoicesDir,
        `producer_invoice_${producerId}_${paymentId}.pdf`
      );

      await generatePDF({
        filePath: producerInvoicePath,
        title: "Farmers Angadi - PRODUCER INVOICE",
        details: {
          userName: `Producer ID: ${producerId}`,
          paymentId,
          cartItems: itemsByProducer[producerId].items,
          deliveryCharge: 0,
        gstRate: 0.08,
        cgstRate: 0.08,
        },
      });
    }

    console.log(`Invoices created successfully.`);
    return NextResponse.json({ message: "Invoices generated successfully" });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}

// Utility function to generate PDFs
async function generatePDF({ filePath, title, details }) {
  const { userName, paymentId, cartItems, deliveryCharge, gstRate,cgstRate } = details;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 700]);
  const { width, height } = page.getSize();
  const fontSize = 12;

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Header
  page.drawText(title, {
    x: 50,
    y: height - 50,
    size: 20,
    font: fontBold,
    color: rgb(0, 0.2, 0.5),
  });

  page.drawLine({
    start: { x: 50, y: height - 70 },
    end: { x: width - 50, y: height - 70 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Customer/Producer: ${userName}`, {
    x: 50,
    y: height - 100,
    size: fontSize,
    font: fontRegular,
  });
  page.drawText(`Payment ID: ${paymentId}`, {
    x: 50,
    y: height - 120,
    size: fontSize,
    font: fontRegular,
  });

  // Items table
  let tableY = height - 160;
  page.drawText("Item", { x: 50, y: tableY, font: fontBold, size: fontSize });
  page.drawText("Quantity", { x: 280, y: tableY, font: fontBold, size: fontSize });
  page.drawText("Price", { x: 380, y: tableY, font: fontBold, size: fontSize });
  page.drawText("Total", { x: 480, y: tableY, font: fontBold, size: fontSize });

  page.drawLine({
    start: { x: 50, y: tableY - 10 },
    end: { x: width - 50, y: tableY - 10 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  tableY -= 30;

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.productDetails;
    const itemTotal = (product.cost - product.discount) * item.productCount;

    page.drawText(product.name, { x: 50, y: tableY, size: fontSize, font: fontRegular });
    page.drawText(`${item.productCount}`, {
      x: 280,
      y: tableY,
      size: fontSize,
      font: fontRegular,
    });
    page.drawText(`${(product.cost - product.discount).toFixed(2)}`, {
      x: 380,
      y: tableY,
      size: fontSize,
      font: fontRegular,
    });
    page.drawText(`${itemTotal.toFixed(2)}`, {
      x: 480,
      y: tableY,
      size: fontSize,
      font: fontRegular,
    });

    tableY -= 20;
    return acc + itemTotal;
  }, 0);

  if (deliveryCharge > 0) {
    page.drawText(`Delivery Charge: ${deliveryCharge.toFixed(2)}`, {
      x: 400,
      y: tableY,
      size: fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    tableY -= 20;
  }

  if (gstRate > 0) {
    const gstAmount = subtotal * gstRate;
    page.drawText(`GST (${(gstRate * 100).toFixed(0)}%): ${gstAmount.toFixed(2)}`, {
      x: 400,
      y: tableY,
      size: fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    tableY -= 20;
  }

  if (cgstRate > 0) {
    const cgstAmount = subtotal * gstRate;
    page.drawText(`CGST (${(gstRate * 100).toFixed(0)}%): ${cgstAmount.toFixed(2)}`, {
      x: 400,
      y: tableY,
      size: fontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    tableY -= 20;
  }

  page.drawText(`Total Amount: ${(subtotal + deliveryCharge + gstRate*subtotal + cgstRate*subtotal ).toFixed(2)}`, {
    x: 400,
    y: tableY,
    size: fontSize + 2,
    font: fontBold,
    color: rgb(0.2, 0.5, 0.2),
  });

  const pdfBytes = await pdfDoc.save();
  await fs.promises.writeFile(filePath, pdfBytes);

  console.log(`Invoice created at: ${filePath}`);
}
