// app/api/generateInvoice/route.ts
import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function POST(req) {
  const { userName, paymentId, cartItems, totalAmount } = await req.json();

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Load fonts
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Header
    page.drawText("Farmers Angadi - INVOICE", {
      x: 50,
      y: height - 50,
      size: 20,
      font: fontBold,
      color: rgb(0, 0.2, 0.5),
    });

    // Divider
    page.drawLine({
      start: { x: 50, y: height - 70 },
      end: { x: width - 50, y: height - 70 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Customer Information
    page.drawText(`Customer: ${userName}`, { x: 50, y: height - 100, size: fontSize, font: fontRegular });
    page.drawText(`Payment ID: ${paymentId}`, { x: 50, y: height - 120, size: fontSize, font: fontRegular });

    // Table Headers
    let tableY = height - 160;
    page.drawText("Item", { x: 50, y: tableY, font: fontBold, size: fontSize });
    page.drawText("Quantity", { x: 280, y: tableY, font: fontBold, size: fontSize });
    page.drawText("Price", { x: 380, y: tableY, font: fontBold, size: fontSize });
    page.drawText("Total", { x: 480, y: tableY, font: fontBold, size: fontSize });

    // Divider below headers
    page.drawLine({
      start: { x: 50, y: tableY - 10 },
      end: { x: width - 50, y: tableY - 10 },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });

    // List of Items
    tableY -= 30;
    cartItems.forEach((item) => {
      const product = item.productDetails;
      const quantity = item.productCount;
      const pricePerItem = product.cost - product.discount;
      const totalPrice = pricePerItem * quantity;

      page.drawText(product.name, { x: 50, y: tableY, size: fontSize, font: fontRegular });
      page.drawText(`${quantity}`, { x: 280, y: tableY, size: fontSize, font: fontRegular });
      page.drawText(`${pricePerItem.toFixed(2)}`, { x: 380, y: tableY, size: fontSize, font: fontRegular });
      page.drawText(`${totalPrice.toFixed(2)}`, { x: 480, y: tableY, size: fontSize, font: fontRegular });

      tableY -= 20;
    });

    // Divider above total amount
    page.drawLine({
      start: { x: 50, y: tableY - 10 },
      end: { x: width - 50, y: tableY - 10 },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });

    // Total Amount
    page.drawText(`Total Amount: ${totalAmount.toFixed(2)}`, {
      x: 400,
      y: tableY - 30,
      size: fontSize + 2,
      font: fontBold,
      color: rgb(0.2, 0.5, 0.2),
    });

    // Footer
    page.drawText("Thank you for shopping with Farmers Angadi!", {
      x: 50,
      y: 50,
      font: fontRegular,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    // Define the directory and file path
    const invoicesDir = path.join(process.cwd(), "invoices");
    const filePath = path.join(invoicesDir, `invoice_${paymentId}.pdf`);
    
    // Check if the directory exists, if not, create it
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    // Write PDF file to the server
    fs.writeFileSync(filePath, pdfBytes);

    return NextResponse.json({ filePath });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
