import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { machineId } = await req.json();
  const authHeader = req.headers.get("authorization");

  try {
    const response = await axios.get(
      `http://localhost:3003/machines/console/${machineId}`,
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
    console.error("Error starting machine:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
