import { NextRequest, NextResponse } from "next/server";

const TRACKING_SERVICE_URL = process.env.TRACKING_SERVICE_URL || "http://localhost:4000";
const TRACKING_API_KEY = process.env.TRACKING_API_KEY || "";

async function toNextResponse(upstream: Response): Promise<NextResponse> {
  const contentType = upstream.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: contentType ? { "Content-Type": contentType } : undefined,
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!TRACKING_API_KEY) {
      return NextResponse.json({ message: "Tracking API key is not configured" }, { status: 500 });
    }

    const rawBody = await request.text();
    const upstream = await fetch(`${TRACKING_SERVICE_URL}/api/auth-logs`, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("content-type") || "application/json",
        "x-api-key": TRACKING_API_KEY,
      },
      body: rawBody || undefined,
      cache: "no-store",
    });

    return toNextResponse(upstream);
  } catch {
    return NextResponse.json({ message: "Failed to proxy auth logs" }, { status: 502 });
  }
}
