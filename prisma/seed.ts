import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const USERS = [
  { name: "Alex Chen", email: "achen@wisc.edu", year: "Sophomore", major: "Computer Science", interests: ["Tech & Coding", "Startups", "AI / ML", "Gaming"], hall: "sellery", lat: 43.0688, lng: -89.4052, bio: "Building cool stuff and looking for co-founders" },
  { name: "Priya Sharma", email: "psharma@wisc.edu", year: "Junior", major: "Art", interests: ["Art & Design", "Photography", "Music", "Travel"], hall: "dejope", lat: 43.0767, lng: -89.3995, bio: "Visual artist finding creative friends" },
  { name: "Marcus Johnson", email: "mjohnson@wisc.edu", year: "Freshman", major: "Economics", interests: ["Sports", "Finance & Investing", "Music", "Fitness & Gym"], hall: "witte", lat: 43.0692, lng: -89.4060, bio: "First-year trying to figure it all out" },
  { name: "Yuki Tanaka", email: "ytanaka@wisc.edu", year: "Senior", major: "Biology", interests: ["Research", "Hiking & Nature", "Cooking", "Language Learning"], hall: "leopold", lat: 43.0758, lng: -89.4180, bio: "International student from Tokyo" },
  { name: "Sarah Williams", email: "swilliams@wisc.edu", year: "Sophomore", major: "Psychology", interests: ["Mental Health", "Volunteering", "Reading", "Meditation"], hall: "smith", lat: 43.0718, lng: -89.4120, bio: "Aspiring therapist, always here to listen" },
  { name: "Jordan Rivera", email: "jrivera@wisc.edu", year: "Junior", major: "Engineering", interests: ["Tech & Coding", "Fitness & Gym", "Entrepreneurship", "Board Games"], hall: "ogg", lat: 43.0680, lng: -89.4048, bio: "MechE by day, gym rat by evening" },
  { name: "Emily Zhang", email: "ezhang@wisc.edu", year: "Freshman", major: "Data Science", interests: ["AI / ML", "Startups", "Dance", "Anime & Manga"], hall: "chadbourne", lat: 43.0710, lng: -89.4005, bio: "Just started and already stressed" },
  { name: "Noah Thompson", email: "nthompson@wisc.edu", year: "Senior", major: "Political Science", interests: ["Politics", "Writing", "Podcasts", "Social Media"], hall: "off-campus", lat: 43.0731, lng: -89.4012, bio: "Editor at the Daily Cardinal" },
  { name: "Mia Gonzalez", email: "mgonzalez@wisc.edu", year: "Sophomore", major: "Nursing", interests: ["Volunteering", "Fitness & Gym", "Cooking", "Travel"], hall: "barnard", lat: 43.0730, lng: -89.4100, bio: "Nursing student who stress-bakes at 2am" },
  { name: "Liam O'Brien", email: "lobrien@wisc.edu", year: "Junior", major: "Music", interests: ["Music", "Art & Design", "Film & TV", "Meditation"], hall: "kronshage", lat: 43.0742, lng: -89.4145, bio: "Jazz trumpet player, always down for a jam" },
  { name: "Ava Patel", email: "apatel@wisc.edu", year: "Freshman", major: "Pre-Med", interests: ["Research", "Volunteering", "Fitness & Gym", "Cooking"], hall: "sellery", lat: 43.0688, lng: -89.4052, bio: "Aspiring surgeon, caffeine addict" },
  { name: "Ethan Kim", email: "ekim@wisc.edu", year: "Sophomore", major: "Mathematics", interests: ["Tech & Coding", "Board Games", "Research", "Podcasts"], hall: "witte", lat: 43.0692, lng: -89.4060, bio: "I see patterns everywhere" },
  { name: "Olivia Brown", email: "obrown@wisc.edu", year: "Junior", major: "Communications", interests: ["Social Media", "Photography", "Fashion", "Travel"], hall: "dejope", lat: 43.0767, lng: -89.3995, bio: "Content creator and journalism nerd" },
  { name: "James Wilson", email: "jwilson@wisc.edu", year: "Senior", major: "Finance", interests: ["Finance & Investing", "Startups", "Sports", "Podcasts"], hall: "off-campus", lat: 43.0725, lng: -89.4020, bio: "Interning at a hedge fund next summer" },
  { name: "Sofia Martinez", email: "smartinez@wisc.edu", year: "Freshman", major: "Environmental Science", interests: ["Sustainability", "Hiking & Nature", "Volunteering", "Photography"], hall: "leopold", lat: 43.0758, lng: -89.4180, bio: "Tree hugger and proud of it" },
  { name: "Daniel Lee", email: "dlee@wisc.edu", year: "Sophomore", major: "Computer Science", interests: ["Tech & Coding", "Gaming", "AI / ML", "Anime & Manga"], hall: "ogg", lat: 43.0680, lng: -89.4048, bio: "Full-stack dev, part-time gamer" },
  { name: "Isabella Garcia", email: "igarcia@wisc.edu", year: "Junior", major: "Sociology", interests: ["Mental Health", "Politics", "Writing", "Dance"], hall: "chadbourne", lat: 43.0710, lng: -89.4005, bio: "Studying how people connect" },
  { name: "William Davis", email: "wdavis@wisc.edu", year: "Freshman", major: "Engineering", interests: ["Tech & Coding", "Sports", "Entrepreneurship", "Fitness & Gym"], hall: "sellery", lat: 43.0688, lng: -89.4052, bio: "ECE major who runs too much" },
  { name: "Charlotte Taylor", email: "ctaylor@wisc.edu", year: "Senior", major: "English", interests: ["Reading", "Writing", "Film & TV", "Podcasts"], hall: "barnard", lat: 43.0730, lng: -89.4100, bio: "Writing my thesis on modern American lit" },
  { name: "Benjamin Moore", email: "bmoore@wisc.edu", year: "Sophomore", major: "Business", interests: ["Entrepreneurship", "Finance & Investing", "Startups", "Social Media"], hall: "witte", lat: 43.0692, lng: -89.4060, bio: "Running a campus startup" },
  { name: "Amelia Anderson", email: "aanderson@wisc.edu", year: "Junior", major: "Neuroscience", interests: ["Research", "Mental Health", "Fitness & Gym", "Cooking"], hall: "smith", lat: 43.0718, lng: -89.4120, bio: "The brain is wild" },
  { name: "Lucas Thomas", email: "lthomas@wisc.edu", year: "Freshman", major: "Physics", interests: ["Research", "Tech & Coding", "Hiking & Nature", "Board Games"], hall: "slichter", lat: 43.0725, lng: -89.4115, bio: "Quantum stuff and hiking" },
  { name: "Harper Jackson", email: "hjackson@wisc.edu", year: "Sophomore", major: "Journalism", interests: ["Writing", "Photography", "Politics", "Social Media"], hall: "dejope", lat: 43.0767, lng: -89.3995, bio: "Breaking campus news" },
  { name: "Mason White", email: "mwhite@wisc.edu", year: "Junior", major: "Chemistry", interests: ["Research", "Cooking", "Hiking & Nature", "Music"], hall: "kronshage", lat: 43.0742, lng: -89.4145, bio: "Organic chem TA, happy to help" },
  { name: "Ella Harris", email: "eharris@wisc.edu", year: "Senior", major: "Education", interests: ["Volunteering", "Reading", "Language Learning", "Dance"], hall: "cole", lat: 43.0735, lng: -89.4108, bio: "Future elementary school teacher" },
  { name: "Jack Martin", email: "jmartin@wisc.edu", year: "Freshman", major: "Computer Science", interests: ["Tech & Coding", "Startups", "Gaming", "Music"], hall: "ogg", lat: 43.0680, lng: -89.4048, bio: "Hackathon addict" },
  { name: "Lily Clark", email: "lclark@wisc.edu", year: "Sophomore", major: "Biology", interests: ["Research", "Sustainability", "Hiking & Nature", "Cooking"], hall: "adams", lat: 43.0720, lng: -89.4090, bio: "Pre-vet and animal lover" },
  { name: "Henry Lewis", email: "hlewis@wisc.edu", year: "Junior", major: "History", interests: ["Reading", "Writing", "Politics", "Film & TV"], hall: "tripp", lat: 43.0715, lng: -89.4085, bio: "WWII history buff" },
  { name: "Zoe Walker", email: "zwalker@wisc.edu", year: "Freshman", major: "Marketing", interests: ["Fashion", "Social Media", "Photography", "Entrepreneurship"], hall: "sellery", lat: 43.0688, lng: -89.4052, bio: "Building my personal brand" },
  { name: "Owen Hall", email: "ohall@wisc.edu", year: "Senior", major: "Data Science", interests: ["AI / ML", "Tech & Coding", "Finance & Investing", "Podcasts"], hall: "off-campus", lat: 43.0735, lng: -89.4000, bio: "Data nerd graduating in May" },
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const CLASSES = ["CS 400", "CS 300", "CS 252", "MATH 234", "MATH 340", "ECON 101", "ECON 301", "BIO 152", "BIO 101", "PSYCH 202", "PSYCH 101", "ENG 100", "STAT 324", "CHEM 109", "CHEM 343", "PHYSICS 201", "PHYSICS 202", "COMM 100", "SOC 120", "HIST 201"];
const VIBES = ["quiet", "tech", "freshmen", "international", "bad-day", "study-break", "sports", "creative", "fitness", "music", "food", "random"];
const HALLS = ["gordon", "rhetas", "four-lakes", "lizs", "carsons"];

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
    blocks.push({ day, startTime: "11:00", endTime: "13:30", label: "Free", isFree: true });
    blocks.push({ day, startTime: "17:00", endTime: "20:00", label: "Free", isFree: true });
  }
  return blocks;
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function today() { return new Date().toISOString().split("T")[0]; }

async function main() {
  console.log("Seeding database...\n");

  await prisma.tableMember.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.scheduleBlock.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("password123", 12);
  const createdUsers: { id: string; name: string }[] = [];

  for (const u of USERS) {
    const user = await prisma.user.create({
      data: {
        name: u.name, email: u.email, hashedPassword: pw,
        year: u.year, major: u.major,
        interests: JSON.stringify(u.interests), dietaryPrefs: JSON.stringify([]),
        residenceHall: u.hall, lat: u.lat, lng: u.lng,
        bio: u.bio, isOnboarded: true,
      },
    });
    const schedule = randomSchedule();
    await prisma.scheduleBlock.createMany({ data: schedule.map((b) => ({ ...b, userId: user.id })) });
    createdUsers.push({ id: user.id, name: user.name });
    console.log(`  User: ${user.name}`);
  }

  // Create tables
  const times = ["11:30", "12:00", "12:30", "17:30", "18:00", "18:30"];
  const d = today();
  console.log("\n  Creating tables...");

  for (let i = 0; i < 8; i++) {
    const vibe = pick(VIBES);
    const time = pick(times);
    const hall = pick(HALLS);
    const shuffled = [...createdUsers].sort(() => Math.random() - 0.5);
    const members = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);

    const icebreakers = [
      "What's something you're adjusting to lately?",
      "What's the most underrated spot on campus?",
      "What's a project or idea you've been obsessing over?",
      "What class has surprised you the most this semester?",
      "If you could eat one meal for the rest of college, what would it be?",
      "What's something small that made your day better recently?",
      "What's your go-to study spot and why?",
      "What's a skill you want to learn before you graduate?",
    ];
    const spots = [
      "Table near the window",
      "Corner booth by the plants",
      "Round table in the center",
      "High-top near the entrance",
      "Quiet table in the back",
      "Table with the best natural light",
      "Cozy spot near the coffee station",
    ];

    const table = await prisma.diningTable.create({
      data: {
        diningHall: hall, vibe, date: d, time,
        maxSize: 4,
        status: i < 4 ? "active" : "forming",
        icebreaker: pick(icebreakers),
        tableSpot: pick(spots),
        aiPrompt: "Hey! I'm here for ConnecTable — mind if I join?",
        members: {
          create: members.map((m, j) => ({
            userId: m.id,
            role: j === 0 ? "creator" : "member",
          })),
        },
      },
    });
    console.log(`  Table: ${hall} @ ${time} (${vibe}) — ${members.length} members [${table.status}]`);
  }

  // Create checkins
  console.log("\n  Creating checkins...");
  for (let i = 0; i < 12; i++) {
    const user = pick(createdUsers);
    const hall = pick(HALLS);
    await prisma.checkin.create({
      data: { userId: user.id, diningHall: hall },
    });
    console.log(`  Checkin: ${user.name} @ ${hall}`);
  }

  console.log(`\n✓ Seeded ${USERS.length} users, 8 tables, 12 checkins`);
  console.log(`  All passwords: password123`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
