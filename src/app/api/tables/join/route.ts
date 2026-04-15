import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tableId } = body;

    if (!userId || !tableId) {
      return NextResponse.json({ error: "userId and tableId required" }, { status: 400 });
    }

    const table = await prisma.diningTable.findUnique({
      where: { id: tableId },
      include: { members: true },
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    if (table.members.length >= table.maxSize) {
      return NextResponse.json({ error: "Table is full" }, { status: 400 });
    }

    const alreadyMember = table.members.some((m) => m.userId === userId);
    if (alreadyMember) {
      return NextResponse.json({ error: "Already at this table" }, { status: 400 });
    }

    await prisma.tableMember.create({
      data: { userId, tableId },
    });

    if (table.members.length + 1 >= table.maxSize) {
      await prisma.diningTable.update({
        where: { id: tableId },
        data: { status: "active" },
      });
    }

    const updated = await prisma.diningTable.findUnique({
      where: { id: tableId },
      include: { members: { include: { user: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Join table error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
