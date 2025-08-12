import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const body = await req.json();
  const { domainId } = body;

  try {
    const response = await axios.get(
      `http://localhost:3003/vpcs/list-acl/${domainId}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err: any) {
    console.error("Error fetching projects:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
