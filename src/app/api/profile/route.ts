import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RESIDENCE_HALLS } from "@/lib/dining-halls";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { year, major, interests, dietaryPrefs, residenceHall, bio, lat, lng } = body;

    const hall = RESIDENCE_HALLS.find((h) => h.id === residenceHall);
    const finalLat = typeof lat === "number" ? lat : (hall?.lat || null);
    const finalLng = typeof lng === "number" ? lng : (hall?.lng || null);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        year: year || undefined,
        major: major || undefined,
        interests: interests ? JSON.stringify(interests) : undefined,
        dietaryPrefs: dietaryPrefs ? JSON.stringify(dietaryPrefs) : undefined,
        residenceHall: residenceHall ?? undefined,
        lat: finalLat,
        lng: finalLng,
        bio: bio ?? undefined,
        isOnboarded: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(user);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
