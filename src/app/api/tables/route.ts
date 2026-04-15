import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { findMatchesForUser } from "@/lib/matching";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (date) where.date = date;
    if (userId) {
      where.members = { some: { userId } };
    }

    const tables = await prisma.diningTable.findMany({
      where,
      include: {
        members: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Tables fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, vibe, diningHall, time, date } = body;

    if (!userId || !vibe || !time || !date) {
      return NextResponse.json(
        { error: "userId, vibe, time, and date are required" },
        { status: 400 }
      );
    }

    const table = await findMatchesForUser(userId, vibe, diningHall || null, time, date);

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error("Table creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
