"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import MapView, { DiningHallCard } from "@/components/MapView";
import VibeIcon from "@/components/VibeIcon";
import { useProfile } from "@/lib/useProfile";
import { VIBES, DINING_HALLS, type DiningHall } from "@/lib/dining-halls";
import toast from "react-hot-toast";
import { ArrowRight, Bot, Check, Clock, Sparkles, MapPin } from "lucide-react";

const TIME_OPTIONS = [
  { label: "11:00", period: "lunch" }, { label: "11:30", period: "lunch" },
  { label: "12:00", period: "lunch" }, { label: "12:30", period: "lunch" },
  { label: "13:00", period: "lunch" }, { label: "13:30", period: "lunch" },
  { label: "17:00", period: "dinner" }, { label: "17:30", period: "dinner" },
  { label: "18:00", period: "dinner" }, { label: "18:30", period: "dinner" },
  { label: "19:00", period: "dinner" }, { label: "19:30", period: "dinner" },
];

export default function FindTablePage() {
  const router = useRouter();
  const { profile, userId } = useProfile();
  const [step, setStep] = useState(0);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [autoPickHall, setAutoPickHall] = useState(true);
  const [loading, setLoading] = useState(false);

  const userLocation = profile?.lat && profile?.lng ? { lat: profile.lat, lng: profile.lng } : null;
  const today = new Date().toISOString().split("T")[0];

  async function findTable() {
    if (!userId || !selectedVibe || !selectedTime) { toast.error("Please complete all steps"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/tables", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vibe: selectedVibe, diningHall: autoPickHall ? null : selectedHall, time: selectedTime, date: today }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      const table = await res.json();
      toast.success("Your table is ready!");
      router.push(`/table/${table.id}`);
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setLoading(false); }
  }

  const steps = ["Vibe", "Time", "Hall"];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pt-16 pb-24 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-stone-900">Find Your Table</h1>
          <p className="mt-0.5 text-[13px] text-stone-500">Pick your mood, choose a time, and we handle the rest.</p>
        </motion.div>

        {/* Step pills */}
        <div className="mt-5 flex items-center gap-1.5">
          {steps.map((label, i) => (
            <button key={label} onClick={() => i <= step && setStep(i)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${
                step === i ? "bg-stone-900 text-white" : step > i ? "bg-stone-200 text-stone-700" : "text-stone-400"
              }`}
            >
              {step > i ? <Check className="h-3 w-3" /> : <span>{i + 1}.</span>} {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="vibe" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="mt-6">
              <p className="section-label mb-3">What&apos;s your vibe today?</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {VIBES.map((vibe) => (
                  <button key={vibe.id}
                    onClick={() => { setSelectedVibe(vibe.id); setStep(1); }}
                    className={`group relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
                      selectedVibe === vibe.id ? "border-stone-900 bg-stone-50 shadow-sm" : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${vibe.color}`}>
                      <VibeIcon name={vibe.icon} className="h-4 w-4" />
                    </div>
                    <span className="text-[13px] font-medium text-stone-800">{vibe.label}</span>
                    {selectedVibe === vibe.id && <Check className="absolute right-3 top-3 h-4 w-4 text-stone-900" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="time" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="mt-6">
              <p className="section-label mb-4">When are you free?</p>
              {["lunch", "dinner"].map((period) => (
                <div key={period} className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-3.5 w-3.5 text-stone-400" />
                    <span className="text-[12px] font-semibold text-stone-600 capitalize">{period}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.filter((t) => t.period === period).map((t) => (
                      <button key={t.label} onClick={() => { setSelectedTime(t.label); setStep(2); }}
                        className={`rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
                          selectedTime === t.label ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-300"
                        }`}
                      >{t.label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="hall" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="mt-6">
              <p className="section-label mb-4">Where to eat?</p>

              <button onClick={() => setAutoPickHall(!autoPickHall)}
                className={`w-full rounded-xl border p-4 text-left transition-all mb-4 ${
                  autoPickHall ? "border-stone-900 bg-stone-50" : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${autoPickHall ? "border-stone-900 bg-stone-900" : "border-stone-200 bg-stone-100"}`}>
                    <Bot className={`h-5 w-5 ${autoPickHall ? "text-white" : "text-stone-400"}`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[13px] font-bold text-stone-900 block">Let AI pick the best hall</span>
                    <span className="text-[11px] text-stone-500">Minimizes walking time for everyone</span>
                  </div>
                  {autoPickHall && <Check className="h-4 w-4 text-stone-900" />}
                </div>
              </button>

              {!autoPickHall && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    {DINING_HALLS.map((dh) => (
                      <DiningHallCard key={dh.id} hall={dh} selected={selectedHall === dh.id}
                        onClick={() => setSelectedHall(dh.id)} userLocation={userLocation} />
                    ))}
                  </div>
                  <MapView selectedHall={selectedHall} onSelectHall={(h: DiningHall) => setSelectedHall(h.id)}
                    userLocation={userLocation} className="h-[360px] sticky top-20" />
                </div>
              )}

              {/* Summary */}
              <div className="mt-6 card bg-stone-50 border-stone-200">
                <p className="section-label mb-3">Summary</p>
                <div className="grid gap-2 sm:grid-cols-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-stone-400" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-medium">Vibe</p>
                      <p className="text-[12px] font-semibold text-stone-800">{VIBES.find((v) => v.id === selectedVibe)?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-stone-400" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-medium">Time</p>
                      <p className="text-[12px] font-semibold text-stone-800">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-stone-400" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-medium">Hall</p>
                      <p className="text-[12px] font-semibold text-stone-800">
                        {autoPickHall ? "AI picks best" : DINING_HALLS.find((h) => h.id === selectedHall)?.shortName || "—"}
                      </p>
                    </div>
                  </div>
                </div>
                <button onClick={findTable} disabled={loading || !selectedVibe || !selectedTime}
                  className="btn-accent w-full justify-center py-3">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Finding your people...
                    </span>
                  ) : (
                    <>Find My Table <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
