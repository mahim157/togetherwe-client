
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    console.log("Step 1: Connecting to MongoDB...");

    const client = await clientPromise;

    console.log("Step 2: MongoDB client connected!");

    const database = client.db("togetherwe");

    await database.command({ ping: 1 });

    console.log("Step 3: Database ping successful!");

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully!",
    });
  } catch (error) {
    console.error("MONGODB REAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
