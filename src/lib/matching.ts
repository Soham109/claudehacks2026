import { prisma } from "./db";
import { findOptimalDiningHall, haversineDistance, DINING_HALLS } from "./dining-halls";
import { generateIcebreaker } from "./openai";

interface MatchCandidate {
  userId: string;
  name: string;
  year: string;
  major: string;
  interests: string[];
  bio: string;
  lat: number | null;
  lng: number | null;
  score: number;
}

export async function findMatchesForUser(
  userId: string,
  vibe: string,
  preferredDiningHall: string | null,
  preferredTime: string,
  preferredDate: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { scheduleBlocks: true },
  });

  if (!user) throw new Error("User not found");

  const dayOfWeek = new Date(preferredDate).toLocaleDateString("en-US", { weekday: "lowercase" as never });
  const dayMap: Record<number, string> = {
    0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday",
    4: "thursday", 5: "friday", 6: "saturday",
  };
  const day = dayMap[new Date(preferredDate).getDay()] || "monday";

  const existingTable = await prisma.diningTable.findFirst({
    where: {
      vibe,
      date: preferredDate,
      time: preferredTime,
      status: "forming",
      ...(preferredDiningHall ? { diningHall: preferredDiningHall } : {}),
    },
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  if (existingTable && existingTable.members.length < existingTable.maxSize) {
    const alreadyMember = existingTable.members.some((m) => m.userId === userId);
    if (!alreadyMember) {
      await prisma.tableMember.create({
        data: { userId, tableId: existingTable.id },
      });
    }
    return existingTable;
  }

  const allUsers = await prisma.user.findMany({
    where: {
      id: { not: userId },
      scheduleBlocks: {
        some: {
          day,
          isFree: true,
        },
      },
    },
    include: { scheduleBlocks: true },
  });

  const userInterests: string[] = JSON.parse(user.interests || "[]");

  const candidates: MatchCandidate[] = allUsers.map((u) => {
    const theirInterests: string[] = JSON.parse(u.interests || "[]");
    const sharedInterests = userInterests.filter((i) =>
      theirInterests.some((j) => j.toLowerCase() === i.toLowerCase())
    );

    let score = 30;
    score += sharedInterests.length * 15;
    if (u.year === user.year) score += 10;
    if (u.major === user.major) score += 15;

    if (user.lat && user.lng && u.lat && u.lng) {
      const dist = haversineDistance(user.lat, user.lng, u.lat, u.lng);
      if (dist < 0.2) score += 10;
      else if (dist < 0.5) score += 5;
    }

    const freeBlocks = u.scheduleBlocks.filter(
      (b) => b.day === day && b.isFree
    );
    const timeOverlap = freeBlocks.some((b) => {
      return b.startTime <= preferredTime && b.endTime >= preferredTime;
    });
    if (timeOverlap) score += 20;

    score += Math.random() * 10;

    return {
      userId: u.id,
      name: u.name,
      year: u.year,
      major: u.major,
      interests: theirInterests,
      bio: u.bio,
      lat: u.lat,
      lng: u.lng,
      score: Math.min(100, Math.round(score)),
    };
  });

  candidates.sort((a, b) => b.score - a.score);
  const topMatches = candidates.slice(0, 3);

  const memberLocations = [
    { lat: user.lat || 43.0731, lng: user.lng || -89.4012 },
    ...topMatches
      .filter((m) => m.lat && m.lng)
      .map((m) => ({ lat: m.lat!, lng: m.lng! })),
  ];

  const optimalHall = preferredDiningHall
    ? DINING_HALLS.find((h) => h.id === preferredDiningHall) || findOptimalDiningHall(memberLocations)
    : findOptimalDiningHall(memberLocations);

  const memberProfiles = [
    { name: user.name, year: user.year, major: user.major, interests: userInterests, bio: user.bio },
    ...topMatches.map((m) => ({ name: m.name, year: m.year, major: m.major, interests: m.interests, bio: m.bio })),
  ];

  const { icebreaker, tableSpot, aiPrompt } = await generateIcebreaker(vibe, memberProfiles);

  const table = await prisma.diningTable.create({
    data: {
      diningHall: optimalHall.id,
      vibe,
      date: preferredDate,
      time: preferredTime,
      maxSize: 4,
      status: "forming",
      icebreaker,
      tableSpot,
      aiPrompt,
      members: {
        create: [
          { userId, role: "creator" },
          ...topMatches.map((m) => ({ userId: m.userId, role: "member" as const })),
        ],
      },
    },
    include: {
      members: { include: { user: true } },
    },
  });

  return table;
}
