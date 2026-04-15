"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LocationPicker from "@/components/LocationPicker";
import toast from "react-hot-toast";
import {
  ArrowLeft, ArrowRight, GraduationCap, Sparkles,
  UtensilsCrossed, MapPin, Check,
} from "lucide-react";

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad Student"];
const MAJORS = [
  "Computer Science", "Data Science", "Engineering", "Mathematics", "Physics",
  "Chemistry", "Biology", "Neuroscience", "Psychology", "Economics",
  "Business", "Finance", "Accounting", "Marketing", "Political Science",
  "Sociology", "History", "English", "Philosophy", "Communications",
  "Journalism", "Art", "Music", "Theater", "Film",
  "Education", "Nursing", "Pre-Med", "Pre-Law", "Environmental Science", "Other",
];
const INTERESTS = [
  "Tech & Coding", "Startups", "AI / ML", "Gaming", "Music",
  "Sports", "Fitness & Gym", "Art & Design", "Photography", "Film & TV",
  "Reading", "Writing", "Cooking", "Travel", "Hiking & Nature",
  "Volunteering", "Politics", "Finance & Investing", "Fashion", "Dance",
  "Anime & Manga", "Board Games", "Mental Health", "Sustainability", "Language Learning",
  "Research", "Entrepreneurship", "Social Media", "Podcasts", "Meditation",
];
const DIETARY = ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free", "No Restrictions", "Other"];

const STEPS = [
  { icon: GraduationCap, label: "Studies" },
  { icon: Sparkles, label: "Interests" },
  { icon: UtensilsCrossed, label: "Dietary" },
  { icon: MapPin, label: "Location" },
];

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);

  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [majorSearch, setMajorSearch] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [residence, setResidence] = useState("");
  const [bio, setBio] = useState("");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [addressLabel, setAddressLabel] = useState("");

  function next() {
    if (step === 0 && (!year || !major)) { toast.error("Select year and major"); return; }
    if (step === 1 && interests.length === 0) { toast.error("Pick at least one interest"); return; }
    setDir(1); setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function prev() { setDir(-1); setStep((s) => Math.max(s - 1, 0)); }
  function toggleInterest(v: string) { setInterests((p) => p.includes(v) ? p.filter((i) => i !== v) : p.length < 8 ? [...p, v] : p); }
  function toggleDietary(v: string) { setDietary((p) => p.includes(v) ? p.filter((i) => i !== v) : [...p, v]); }
  const filteredMajors = majorSearch ? MAJORS.filter((m) => m.toLowerCase().includes(majorSearch.toLowerCase())) : MAJORS;

  async function handleSubmit() {
    if (!userLat || !userLng) { toast.error("Set your location first"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, major, interests, dietaryPrefs: dietary, residenceHall: residence, bio: bio.trim(), lat: userLat, lng: userLng }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      await update({ isOnboarded: true, name: session?.user?.name });
      toast.success("You're all set!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setLoading(false); }
  }

  const pages = [
    <motion.div key="studies" className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Hey {session?.user?.name?.split(" ")[0]}, tell us about your studies</h2>
        <p className="mt-1 text-[13px] text-stone-500">Helps match you with students at a similar stage.</p>
      </div>
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-stone-500">Year</label>
        <div className="flex flex-wrap gap-1.5">
          {YEARS.map((y) => (
            <button key={y} onClick={() => setYear(y)}
              className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${year === y ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>{y}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-stone-500">Major</label>
        <input type="text" value={majorSearch} onChange={(e) => setMajorSearch(e.target.value)} placeholder="Search majors..." className="input-field mb-2 text-[13px]" />
        <div className="max-h-40 overflow-y-auto rounded-xl border border-stone-200 p-2">
          <div className="flex flex-wrap gap-1.5">
            {filteredMajors.map((m) => (
              <button key={m} onClick={() => { setMajor(m); setMajorSearch(""); }}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all duration-150 ${major === m ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>{m}</button>
            ))}
          </div>
        </div>
        {major && <p className="mt-2 text-[12px] text-stone-500">Selected: <span className="font-semibold text-stone-800">{major}</span></p>}
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-semibold text-stone-500">Quick bio <span className="text-stone-400 font-normal">(optional)</span></label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="One sentence about you" className="input-field resize-none text-[13px]" rows={2} maxLength={200} />
      </div>
    </motion.div>,

    <motion.div key="interests" className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">What are you into?</h2>
        <p className="mt-1 text-[13px] text-stone-500">Pick up to 8 — these help find your people.</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {INTERESTS.map((v) => {
          const sel = interests.includes(v);
          return (<button key={v} onClick={() => toggleInterest(v)}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all ${sel ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-300"}`}>{sel && <Check className="h-3 w-3" />}{v}</button>);
        })}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-stone-400">{interests.length}/8</p>
        <div className="h-1.5 w-24 rounded-full bg-stone-100 overflow-hidden"><div className="h-full bg-stone-900 rounded-full transition-all" style={{ width: `${(interests.length / 8) * 100}%` }} /></div>
      </div>
    </motion.div>,

    <motion.div key="dietary" className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Any food preferences?</h2>
        <p className="mt-1 text-[13px] text-stone-500">Helps with dining hall selection.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {DIETARY.map((d) => {
          const sel = dietary.includes(d);
          return (<button key={d} onClick={() => toggleDietary(d)}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-[13px] font-medium transition-all ${sel ? "border-stone-900 bg-stone-50 text-stone-900" : "border-stone-200 text-stone-500 hover:border-stone-300"}`}>{d}{sel && <Check className="h-4 w-4" />}</button>);
        })}
      </div>
    </motion.div>,

    <motion.div key="location" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Where do you live?</h2>
        <p className="mt-1 text-[13px] text-stone-500">Pick a dorm, search your address, or pin on the map.</p>
      </div>
      <LocationPicker
        location={userLat && userLng ? { lat: userLat, lng: userLng } : null}
        onLocationChange={(lat, lng) => { setUserLat(lat); setUserLng(lng); }}
        residenceHall={residence} onResidenceChange={setResidence}
        addressLabel={addressLabel} onAddressChange={setAddressLabel}
      />
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center gap-1">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon;
            const done = i < step, active = i === step;
            return (<button key={i} onClick={() => { if (i < step) { setDir(-1); setStep(i); } }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${active ? "bg-stone-900 text-white" : done ? "bg-stone-200 text-stone-700" : "text-stone-400"}`}>
              <StepIcon className="h-3 w-3" /><span className="hidden sm:inline">{s.label}</span>
            </button>);
          })}
          <div className="ml-auto text-[11px] font-medium text-stone-400">{step + 1}/{STEPS.length}</div>
        </div>
        <div className="mb-5 h-1 w-full rounded-full bg-stone-200 overflow-hidden">
          <motion.div className="h-full rounded-full bg-stone-900" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <div className="card min-h-[400px] overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}>
              {pages[step]}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button onClick={prev} disabled={step === 0} className="btn-ghost disabled:opacity-0"><ArrowLeft className="h-4 w-4" />Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-accent">
              {loading ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />Saving...</span>
                : <>Find My Table <ArrowRight className="h-4 w-4" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
