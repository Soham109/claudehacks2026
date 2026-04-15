import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MemberProfile {
  name: string;
  year: string;
  major: string;
  interests: string[];
  bio: string;
}

export async function generateIcebreaker(
  vibe: string,
  members: MemberProfile[]
): Promise<{ icebreaker: string; tableSpot: string; aiPrompt: string }> {
  const memberDescriptions = members
    .map((m) => `${m.name} (${m.year}, ${m.major}, interests: ${m.interests.join(", ")})`)
    .join("\n");

  const tableSpots = [
    "Table near the window",
    "Corner booth by the plants",
    "Round table in the center",
    "High-top table near the entrance",
    "Quiet table in the back corner",
    "Table with the best natural light",
    "Cozy spot near the coffee station",
  ];
  const spot = tableSpots[Math.floor(Math.random() * tableSpots.length)];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a warm, thoughtful social facilitator for a college dining app called "ConnecTable" at UW-Madison. Your job is to create genuine human connection between students who are about to share a meal together. Be warm but not cheesy. Be specific but not intrusive. The vibe for this table is: "${vibe}".`,
        },
        {
          role: "user",
          content: `These students are about to eat together:\n${memberDescriptions}\n\nGenerate:\n1. A short, natural icebreaker question that feels organic and matches the "${vibe}" vibe. Make it something that invites real conversation, not small talk.\n2. A brief intro prompt that a student could use when they sit down.\n\nRespond in JSON format:\n{"icebreaker": "the question", "prompt": "the intro prompt"}`,
        },
      ],
      temperature: 0.85,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || "";
    const parsed = JSON.parse(content);

    return {
      icebreaker: parsed.icebreaker || "What's something you're adjusting to lately?",
      tableSpot: spot,
      aiPrompt: parsed.prompt || "Hey! I'm here for the ConnecTable — mind if I join?",
    };
  } catch {
    return {
      icebreaker: getDefaultIcebreaker(vibe),
      tableSpot: spot,
      aiPrompt: "Hey! I'm here for the ConnecTable — mind if I join?",
    };
  }
}

function getDefaultIcebreaker(vibe: string): string {
  const defaults: Record<string, string> = {
    quiet: "What's something small that made your day better recently?",
    tech: "What's a project or idea you've been nerding out about?",
    freshmen: "What's something about UW that surprised you?",
    international: "What's a food from home you really miss?",
    "bad-day": "What's something that usually cheers you up?",
    "study-break": "What class is currently living rent-free in your head?",
    sports: "What's your hottest take about Wisconsin sports?",
    creative: "What's something creative you've made recently that you're proud of?",
    fitness: "What's your go-to workout when you're stressed?",
    music: "What song has been on repeat for you this week?",
    food: "What's the most underrated food spot near campus?",
    random: "If you could swap lives with anyone on campus for a day, who would it be?",
  };
  return defaults[vibe] || "What's something you're adjusting to lately?";
}

export async function generateMatchScore(
  user1: MemberProfile,
  user2: MemberProfile,
  vibe: string
): Promise<number> {
  const sharedInterests = user1.interests.filter((i) =>
    user2.interests.some((j) => j.toLowerCase() === i.toLowerCase())
  );

  let score = 30;
  score += sharedInterests.length * 15;

  if (user1.year === user2.year) score += 10;

  if (user1.major === user2.major) score += 10;
  else {
    const stem = ["Computer Science", "Engineering", "Mathematics", "Physics", "Chemistry", "Biology"];
    const humanities = ["English", "History", "Philosophy", "Political Science", "Sociology"];
    const isSameBucket =
      (stem.includes(user1.major) && stem.includes(user2.major)) ||
      (humanities.includes(user1.major) && humanities.includes(user2.major));
    if (isSameBucket) score += 5;
  }

  score += Math.random() * 10;

  return Math.min(100, Math.round(score));
}
