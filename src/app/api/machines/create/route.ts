import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const body = await req.json();

  const { name, projectId, offerId, templateId, networkId } = body;

  try {
    const response = await axios.post(
      `${process.env.API_URL!}/projects/add-virtual-machine/${projectId}`,
      {
        name: name,
        instanceId: offerId,
        templateId: templateId,
        networkId: networkId,
      },
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
    console.error("Error creating machine:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
