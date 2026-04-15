import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const blocks = await prisma.scheduleBlock.findMany({
      where: { userId },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Schedule fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, blocks } = body;

    if (!userId || !blocks) {
      return NextResponse.json({ error: "userId and blocks required" }, { status: 400 });
    }

    await prisma.scheduleBlock.deleteMany({ where: { userId } });

    const created = await prisma.scheduleBlock.createMany({
      data: blocks.map((block: { day: string; startTime: string; endTime: string; label?: string; isFree?: boolean }) => ({
        userId,
        day: block.day,
        startTime: block.startTime,
        endTime: block.endTime,
        label: block.label || "Free",
        isFree: block.isFree !== false,
      })),
    });

    return NextResponse.json({ count: created.count });
  } catch (error) {
    console.error("Schedule save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
