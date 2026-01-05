import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const resource = req.nextUrl.searchParams.get("resource");

  try {
    const endpoint =
      resource === "templates"
        ? `${process.env.API_URL!}/templates/list-templates`
        : `${process.env.API_URL!}/instances/list-offers`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: authHeader,
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err: any) {
    console.error("Error fetching machine offers:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
