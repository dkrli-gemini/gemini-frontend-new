import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const domainId = req.nextUrl.searchParams.get("domainId");

  if (!domainId) {
    return NextResponse.json(
      { message: "domainId é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${process.env.API_URL!}/billing/pricing?domainId=${domainId}`,
      { headers: { Authorization: authHeader } }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("Error fetching billing pricing:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  try {
    const body = await req.json();
    const response = await axios.post(
      `${process.env.API_URL!}/billing/pricing`,
      body,
      { headers: { Authorization: authHeader } }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("Error saving billing pricing:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
