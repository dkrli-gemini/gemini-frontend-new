import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const body = await req.json();
  const { projectId } = body;

  try {
    const response = await axios.get(
      `${process.env.API_URL!}/resource-limits/${projectId}`,
      {
        headers: {
          Authorization: authHeader,
        },
      },
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

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const domainId = req.nextUrl.searchParams.get("domainId");

  if (!domainId) {
    return NextResponse.json(
      { error: "domainId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `${process.env.API_URL!}/resource-limits/domain/${domainId}`,
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err: any) {
    console.error("Error fetching domain limits:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const body = await req.json();
  const { limitId, limit } = body as { limitId?: string; limit?: number };

  if (!limitId || typeof limit !== "number") {
    return NextResponse.json(
      { error: "limitId and numeric limit are required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.patch(
      `${process.env.API_URL!}/resource-limits/${limitId}`,
      { limit },
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err: any) {
    console.error("Error updating limit:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
