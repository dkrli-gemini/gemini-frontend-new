import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const domainId = req.nextUrl.searchParams.get("domainId");
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!domainId && !projectId) {
    return NextResponse.json(
      { message: "domainId ou projectId são obrigatórios." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  if (domainId) params.set("domainId", domainId);
  if (projectId) params.set("projectId", projectId);

  try {
    const response = await axios.get(
      `${process.env.API_URL!}/billing/entries?${params.toString()}`,
      { headers: { Authorization: authHeader } }
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("Error fetching billing entries:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
    