import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, diningHall } = body;

    if (!userId || !diningHall) {
      return NextResponse.json({ error: "userId and diningHall required" }, { status: 400 });
    }

    const checkin = await prisma.checkin.create({
      data: { userId, diningHall },
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (error) {
    console.error("Checkin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const diningHall = searchParams.get("diningHall");

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const checkins = await prisma.checkin.findMany({
      where: {
        ...(diningHall ? { diningHall } : {}),
        checkedInAt: { gte: oneHourAgo },
      },
      include: { user: true },
      orderBy: { checkedInAt: "desc" },
    });

    return NextResponse.json(checkins);
  } catch (error) {
    console.error("Checkin fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
