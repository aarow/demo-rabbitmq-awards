import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const collection = client.db("demo-rabbitmq").collection("alerts");
  const data = await collection.find({}).toArray();
  console.log();
  return NextResponse.json(data);
}
