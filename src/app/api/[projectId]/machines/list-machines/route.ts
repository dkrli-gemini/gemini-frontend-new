import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;
  const authHeader = req.headers.get("authorization") || "";

  try {
    const response = await axios.get(
      `http://localhost:3003/projects/list-machines/${projectId}`,
      { headers: { Authorization: authHeader } }
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err: any) {
    console.error("Error fetching machines:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
