"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Brain,
  Lock,
  MessageCircle,
  Users,
  Utensils,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const vibeExamples = [
  "Quiet lunch, light conversation",
  "Startup / tech talk",
  "First-years finding their people",
  "International students",
  "Just had a bad day",
  "Study break needed",
  "Game day talk",
  "Surprise me",
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

const tableMembers = [
  { initial: "A", name: "Alex", detail: "CS · Sophomore", bg: "bg-blue-100 text-blue-700" },
  { initial: "P", name: "Priya", detail: "Art · Junior", bg: "bg-purple-100 text-purple-700" },
  { initial: "M", name: "Marcus", detail: "Econ · Freshman", bg: "bg-amber-100 text-amber-700" },
  { initial: "Y", name: "Yuki", detail: "Bio · Senior", bg: "bg-emerald-100 text-emerald-700" },
];

export default function LandingPage() {
  const [vibeIndex, setVibeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVibeIndex((i) => (i + 1) % vibeExamples.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen hero-gradient">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full glass border-b border-stone-200/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900">
              <Utensils className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-stone-900">
              ConnecTable
            </span>
          </Link>
          <Link href="/signup" className="btn-primary text-[13px]">
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center justify-center px-6 pt-20 text-center">
        <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
          <motion.div
            custom={0}
            variants={fade}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-[12px] font-semibold text-red-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-dot" />
            Built for UW-Madison
          </motion.div>

          <motion.h1
            custom={1}
            variants={fade}
            className="text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-stone-900"
          >
            Never eat{" "}
            <span className="gradient-text">alone</span>{" "}
            again.
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            className="mt-5 max-w-md text-balance text-[15px] leading-relaxed text-stone-500"
          >
            Join a small table of 3–4 students around a shared vibe.
            AI finds your people, picks the optimal dining hall, and gives you
            something real to talk about.
          </motion.p>

          {/* Vibe ticker */}
          <motion.div
            custom={3}
            variants={fade}
            className="mt-7 flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-5 py-3 shadow-sm"
          >
            <span className="section-label">Today&apos;s vibe</span>
            <div className="h-4 w-px bg-stone-200" />
            <div className="relative h-5 overflow-hidden">
              <motion.span
                key={vibeIndex}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="block text-[13px] font-semibold text-stone-800"
              >
                {vibeExamples[vibeIndex]}
              </motion.span>
            </div>
          </motion.div>

          <motion.div custom={4} variants={fade} className="mt-8 flex items-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-sm">
              Find Your Table
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="btn-ghost text-sm">
              See how it works
            </a>
          </motion.div>
        </motion.div>

        {/* Demo card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-14 w-full max-w-md"
        >
          <div className="card p-5 shadow-md border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-label mb-1">Your table is ready</p>
                <h3 className="text-[15px] font-bold text-stone-900">
                  Gordon Avenue Market
                </h3>
              </div>
              <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                12:30 PM
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {tableMembers.map((m, i) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm ${m.bg}`}
                  >
                    {m.initial}
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-stone-700">
                  {tableMembers.map((m) => m.name).join(", ")}
                </p>
                <p className="text-[11px] text-stone-400">Startup / tech talk</p>
              </div>
            </div>
            <div className="rounded-xl bg-stone-50 border border-stone-100 p-3.5">
              <div className="flex items-start gap-2.5">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                <div>
                  <p className="text-[11px] font-medium text-stone-400 mb-0.5">Conversation starter</p>
                  <p className="text-[13px] font-medium text-stone-700 leading-snug">
                    &ldquo;What&apos;s a project or idea you&apos;ve been nerding out about?&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <motion.p custom={0} variants={fade} className="section-label mb-3">
            How it works
          </motion.p>
          <motion.h2
            custom={1}
            variants={fade}
            className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl"
          >
            Three steps to your next great meal
          </motion.h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              step: "01",
              title: "Pick your vibe",
              desc: "Choose a mood that matches your moment — from quiet lunch to tech talk, study break to game day.",
              accent: "bg-violet-50 text-violet-600 border-violet-200",
            },
            {
              icon: Brain,
              step: "02",
              title: "AI forms your group",
              desc: "Matched with 2-3 students based on interests, schedule overlap, and walking distance to minimize everyone's commute.",
              accent: "bg-blue-50 text-blue-600 border-blue-200",
            },
            {
              icon: Users,
              step: "03",
              title: "Show up & connect",
              desc: "Get a table spot, an intro prompt, and a custom ice-breaker. No awkward intros — just real conversation.",
              accent: "bg-emerald-50 text-emerald-600 border-emerald-200",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              custom={i + 1}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.accent}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-stone-300 group-hover:text-stone-400 transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-stone-900 mb-1.5">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-stone-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: MapPin,
              title: "Smart Location Matching",
              desc: "Pin your exact location or pick your dorm. We find the dining hall that minimizes everyone's walk time.",
              accent: "text-red-600",
            },
            {
              icon: Calendar,
              title: "Schedule-Aware",
              desc: "Add your classes and we'll only match you when you're free. Update anytime — life happens.",
              accent: "text-blue-600",
            },
            {
              icon: Lock,
              title: "Privacy First",
              desc: "No public profiles. No followers. No swiping. Your info is only used for matching — nothing else.",
              accent: "text-stone-600",
            },
            {
              icon: MessageCircle,
              title: "AI Conversation Starters",
              desc: "Every table gets a custom ice-breaker crafted from who's there. Genuine conversation, zero awkwardness.",
              accent: "text-amber-600",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fade}
              className="card flex gap-4"
            >
              <div className="shrink-0">
                <item.icon className={`h-5 w-5 mt-0.5 ${item.accent}`} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-stone-900 mb-1">{item.title}</h3>
                <p className="text-[13px] leading-relaxed text-stone-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-stone-900 px-8 py-14 text-center sm:px-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent" />
          <motion.h2 custom={0} variants={fade} className="relative text-2xl font-bold text-white sm:text-3xl">
            Your table is waiting.
          </motion.h2>
          <motion.p custom={1} variants={fade} className="relative mt-3 text-[15px] text-stone-400">
            Takes 2 minutes to set up. One meal can change everything.
          </motion.p>
          <motion.div custom={2} variants={fade} className="relative mt-7">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[13px] font-semibold text-stone-900 shadow-lg transition-all hover:bg-stone-50 hover:shadow-xl active:scale-[0.98]"
            >
              Join ConnecTable
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-[13px] text-stone-400">
            <Utensils className="h-3.5 w-3.5" />
            <span>ConnecTable</span>
          </div>
          <p className="text-[11px] text-stone-300">
            Built for Badgers who eat alone sometimes.
          </p>
        </div>
      </footer>
    </div>
  );
}
