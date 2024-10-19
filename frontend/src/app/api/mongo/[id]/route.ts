import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const collection = client.db("demo-rabbitmq").collection("alerts");
  
  console.log("********", params.id, "********");

  const data = await collection.findOne({
    _id: new ObjectId(params.id.toString()),
  });
  return NextResponse.json(data);
}
