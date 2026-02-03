import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const body = await req.json();

  const { name, projectId, gateway, netmask, aclId, offerId, zoneId } = body;

  try {
    const response = await axios.post(
      `${process.env.API_URL!}/network/add-network/${projectId}`,
      {
        name: name,
        gateway,
        netmask,
        cloudstackAclId: aclId,
        cloudstackOfferId: offerId,
        zoneId,
      },
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    console.log(response);

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (err: any) {
    console.error("Error creating network:", err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(data, { status });
  }
}
