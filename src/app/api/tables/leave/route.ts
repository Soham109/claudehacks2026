import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tableId } = await request.json();
    if (!tableId) {
      return NextResponse.json({ error: "tableId required" }, { status: 400 });
    }

    const membership = await prisma.tableMember.findFirst({
      where: { userId: session.user.id, tableId },
    });

    if (!membership) {
      return NextResponse.json({ error: "You're not at this table" }, { status: 404 });
    }

    await prisma.tableMember.delete({ where: { id: membership.id } });

    const remaining = await prisma.tableMember.count({ where: { tableId } });

    if (remaining === 0) {
      await prisma.diningTable.delete({ where: { id: tableId } });
      return NextResponse.json({ deleted: true });
    }

    if (remaining < 3) {
      await prisma.diningTable.update({
        where: { id: tableId },
        data: { status: "forming" },
      });
    }

    return NextResponse.json({ left: true });
  } catch (error) {
    console.error("Leave table error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
