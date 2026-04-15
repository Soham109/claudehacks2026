import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SAMPLE_USERS = [
  { name: "Alex Chen", email: "achen@wisc.edu", year: "Sophomore", major: "Computer Science", interests: ["Tech & Coding", "Startups", "AI / ML", "Gaming"], residenceHall: "sellery", lat: 43.0688, lng: -89.4052, bio: "Building cool stuff and looking for co-founders" },
  { name: "Priya Sharma", email: "psharma@wisc.edu", year: "Junior", major: "Art", interests: ["Art & Design", "Photography", "Music", "Travel"], residenceHall: "dejope", lat: 43.0767, lng: -89.3995, bio: "Visual artist finding creative friends" },
  { name: "Marcus Johnson", email: "mjohnson@wisc.edu", year: "Freshman", major: "Economics", interests: ["Sports", "Finance & Investing", "Music", "Fitness & Gym"], residenceHall: "witte", lat: 43.0692, lng: -89.4060, bio: "First-year trying to figure it all out" },
  { name: "Yuki Tanaka", email: "ytanaka@wisc.edu", year: "Senior", major: "Biology", interests: ["Research", "Hiking & Nature", "Cooking", "Language Learning"], residenceHall: "leopold", lat: 43.0758, lng: -89.4180, bio: "International student from Tokyo" },
  { name: "Sarah Williams", email: "swilliams@wisc.edu", year: "Sophomore", major: "Psychology", interests: ["Mental Health", "Volunteering", "Reading", "Meditation"], residenceHall: "smith", lat: 43.0718, lng: -89.4120, bio: "Aspiring therapist, always here to listen" },
  { name: "Jordan Rivera", email: "jrivera@wisc.edu", year: "Junior", major: "Engineering", interests: ["Tech & Coding", "Fitness & Gym", "Entrepreneurship", "Board Games"], residenceHall: "ogg", lat: 43.0680, lng: -89.4048, bio: "MechE by day, gym rat by evening" },
  { name: "Emily Zhang", email: "ezhang@wisc.edu", year: "Freshman", major: "Data Science", interests: ["AI / ML", "Startups", "Dance", "Anime & Manga"], residenceHall: "chadbourne", lat: 43.0710, lng: -89.4005, bio: "Just started and already stressed" },
  { name: "Noah Thompson", email: "nthompson@wisc.edu", year: "Senior", major: "Political Science", interests: ["Politics", "Writing", "Podcasts", "Social Media"], residenceHall: "off-campus", lat: 43.0731, lng: -89.4012, bio: "Editor at the Daily Cardinal" },
  { name: "Mia Gonzalez", email: "mgonzalez@wisc.edu", year: "Sophomore", major: "Nursing", interests: ["Volunteering", "Fitness & Gym", "Cooking", "Travel"], residenceHall: "barnard", lat: 43.0730, lng: -89.4100, bio: "Nursing student who stress-bakes at 2am" },
  { name: "Liam O'Brien", email: "lobrien@wisc.edu", year: "Junior", major: "Music", interests: ["Music", "Art & Design", "Film & TV", "Meditation"], residenceHall: "kronshage", lat: 43.0742, lng: -89.4145, bio: "Jazz trumpet player, always down for a jam" },
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const CLASSES = ["CS 400", "MATH 234", "ECON 101", "BIO 152", "PSYCH 202", "ENG 100", "STAT 324", "CHEM 109"];

function randomSchedule() {
  const blocks: { day: string; startTime: string; endTime: string; label: string; isFree: boolean }[] = [];
  for (const day of DAYS) {
    const count = Math.floor(Math.random() * 3) + 1;
    const used = new Set<number>();
    for (let c = 0; c < count; c++) {
      let h: number;
      do { h = Math.floor(Math.random() * 8) + 8; } while (used.has(h));
      used.add(h);
      blocks.push({ day, startTime: `${h.toString().padStart(2, "0")}:00`, endTime: `${(h + 1).toString().padStart(2, "0")}:15`, label: CLASSES[Math.floor(Math.random() * CLASSES.length)], isFree: false });
    }
    blocks.push({ day, startTime: "11:30", endTime: "13:00", label: "Free", isFree: true });
    blocks.push({ day, startTime: "17:00", endTime: "19:00", label: "Free", isFree: true });
  }
  return blocks;
}

async function main() {
  console.log("Seeding database...");
  await prisma.tableMember.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.scheduleBlock.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 12);

  for (const u of SAMPLE_USERS) {
    const user = await prisma.user.create({
      data: {
        name: u.name, email: u.email, hashedPassword: password,
        year: u.year, major: u.major,
        interests: JSON.stringify(u.interests), dietaryPrefs: JSON.stringify([]),
        residenceHall: u.residenceHall, lat: u.lat, lng: u.lng,
        bio: u.bio, isOnboarded: true,
      },
    });
    const schedule = randomSchedule();
    await prisma.scheduleBlock.createMany({ data: schedule.map((b) => ({ ...b, userId: user.id })) });
    console.log(`  Created: ${user.name}`);
  }
  console.log(`\nSeeded ${SAMPLE_USERS.length} users. Password for all: password123`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
