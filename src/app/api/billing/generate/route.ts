import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  console.log("API billing generate route hit", req.nextUrl.toString());
  const session = await getServerSession(authOptions);
  let authHeader = req.headers.get("authorization");
  if (!authHeader && session?.access_token) {
    authHeader = `Bearer ${session.access_token}`;
  }

  const domainId = req.nextUrl.searchParams.get("domainId");
  const projectId = req.nextUrl.searchParams.get("projectId");
  const downloadFilename = req.nextUrl.searchParams.get("filename");

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
    const baseUrl = process.env.API_URL!;
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    const requestConfig = { headers, responseType: "arraybuffer" as const };

    let response;
    try {
      response = await axios.get(
        `${baseUrl}/billing/generate?${params.toString()}`,
        requestConfig
      );
    } catch (primaryError: any) {
      if (primaryError.response?.status !== 404) {
        throw primaryError;
      }
      response = await axios.get(
        `${baseUrl}/billing/entries/export?${params.toString()}`,
        requestConfig
      );
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/pdf");
    const disposition =
      downloadFilename && downloadFilename.trim().length > 0
        ? `attachment; filename="${downloadFilename}"`
        : response.headers["content-disposition"];
    if (disposition) responseHeaders.set("Content-Disposition", disposition);

    return new NextResponse(response.data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("Error generating billing PDF:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
