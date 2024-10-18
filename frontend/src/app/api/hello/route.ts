import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = "Hello from the frontend server!";
  const data = {
    message: res,
  };
  return NextResponse.json(data);
}
