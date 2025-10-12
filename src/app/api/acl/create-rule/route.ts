import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const body = await req.json();

  const {
    aclId,
    ip,
    action,
    startPort,
    endPort,
    trafficType,
    protocol,
    description,
  } = body;

  try {
    const response = await axios.post(
      `${process.env.API_URL!}/vpcs/add-acl-rule/${aclId}`,
      {
        cidrList: [ip],
        action,
        startPort,
        endPort,
        trafficType,
        protocol,
        description,
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
    console.error("Error creating ACL Rule:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
