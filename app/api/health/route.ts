import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      revision: process.env.APP_REVISION ?? "development",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
