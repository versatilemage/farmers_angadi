// pages/api/product.ts

import { NextResponse } from 'next/server';
import connectMongo from "@/utils/Database";
import mongoose, { Types } from "mongoose"; // Import mongoose for session
import ProductModel from "@/models/product";
import ProductStockModel from "@/models/product/stock";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
// Import necessary modules from NextAuth and Next.js server
import { getServerSession } from "next-auth";

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
async function uploadFileToS3(file: File) {
  const fileExtension = path.extname(file.name);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: Buffer.from(await file.arrayBuffer()), // Convert file to buffer
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
}

export async function POST(req: Request) {
  await connectMongo();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Retrieve session data without `res`
    const typecastedReq = req as any;
    const token = await getToken({ req: typecastedReq, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const creatorId = token.sub;


    // Parse form data from the request
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const cost = parseFloat(formData.get("cost") as string);
    const discount = parseFloat(formData.get("discount") as string) || 0;
    const about = formData.get("about") as string;
    const category = formData.get("category") as string || "Uncategorized";
    const stock = parseInt(formData.get("stock") as string);
    const measurement = formData.get("measurement") as string || "Units";

    // Handle the image file
    const imageFile = formData.get("image") as File;
    if (!imageFile) {
      await session.abortTransaction();
      return NextResponse.json({ message: "No image file uploaded" }, { status: 400 });
    }

    // Upload the image to S3
    const imageUrl = await uploadFileToS3(imageFile);

    // Create a new product with creatorId
    const newProduct = new ProductModel({
      name,
      cost,
      discount,
      image: imageUrl,
      about,
      category,
      creatorId, // Save creatorId from session
    });

    // Save the product in the database
    const savedProduct = await newProduct.save({ session });

    // Create the related stock entry using the productId from the saved product
    const newStock = new ProductStockModel({
      stock,
      measurement,
      productId: savedProduct._id, // Link the stock entry with the product's ID
    });

    // Save the stock data
    await newStock.save({ session });

    // Commit the transaction if both product and stock save successfully
    await session.commitTransaction();

    return NextResponse.json({ message: "Product and stock created successfully!" }, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating product with stock:", error);
    return NextResponse.json({ message: "Error creating product with stock" }, { status: 500 });
  } finally {
    session.endSession();
  }
}

import { NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';


export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const productId = url.searchParams.get("productId");

    // Create the aggregation pipeline with $lookup for stock data
    const aggregationPipeline = [
      // Filter by category if provided, or by productId if provided
      ...(productId ? [{ $match: { _id: new Types.ObjectId(productId) } }] : []),
      ...(category ? [{ $match: { category } }] : []),
      {
        $lookup: {
          from: "productstocks", // The collection for ProductStockModel
          localField: "_id",      // Field from ProductModel
          foreignField: "productId", // Field from ProductStockModel
          as: "stockData",        // Alias for the stock data
        },
      },
      {
        $unwind: {
          path: "$stockData",
          preserveNullAndEmptyArrays: true, // Ensures products with no stock data are still returned
        },
      },
    ];

    // Fetch products with stock data
    const products = await ProductModel.aggregate(aggregationPipeline);

    // Return the product if fetching by productId (return the first item)
    if (productId && products.length > 0) {
      return NextResponse.json({ data: products[0] }, { status: 200 });
    }

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products: ", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  await connectMongo();

  try {
    // Authenticate user
    const typecastedReq = req as any;
    const token = await getToken({ req: typecastedReq, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    // Get product ID and updated data from request
    const formData = await req.formData();
    const productId = formData.get("productId") as string;

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Fetch the current product from the database
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Verify that the current user is the creator of the product
    if (existingProduct.creatorId.toString() !== token.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Prepare the updates object with data from formData
    const updates: any = {
      name: formData.get("name") || existingProduct.name,
      cost: formData.get("cost") ? parseFloat(formData.get("cost") as string) : existingProduct.cost,
      discount: formData.get("discount") ? parseFloat(formData.get("discount") as string) : existingProduct.discount,
      about: formData.get("about") || existingProduct.about,
      category: formData.get("category") || existingProduct.category,
      image: existingProduct.image, // Set the current image by default
    };

    // Check if a new image file is provided
    const imageFile = formData.get("image") as File;

    // Upload new image only if a non-empty file is provided
    if (imageFile && imageFile.size > 0) {
      const imageUrl = await uploadFileToS3(imageFile);
      updates.image = imageUrl; // Update with new image URL if a new image is provided
    }

    // Handle stock data update if provided
    const stock = formData.get("stock") ? parseInt(formData.get("stock") as string) : 0;
    if (stock !== null) {
      await ProductStockModel.findOneAndUpdate(
        { productId },
        { stock },
        { upsert: true } // Create stock entry if it doesn't exist
      );
    }

    // Update the product in the database with either the new or existing image
    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updates, { new: true });

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  await connectMongo();

  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  try {
    // Ensure product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Remove the product
    await ProductModel.findByIdAndDelete(productId);

    // Remove associated stock data
    await ProductStockModel.deleteOne({ productId: new Types.ObjectId(productId) });

    return NextResponse.json({ message: "Product and associated stock deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product and stock data:", error);
    return NextResponse.json({ message: "Error deleting product and stock data" }, { status: 500 });
  }
}