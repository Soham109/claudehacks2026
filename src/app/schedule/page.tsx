"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useProfile } from "@/lib/useProfile";
import toast from "react-hot-toast";
import { Plus, Wand2, Save, X, Clock, Info } from "lucide-react";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
  friday: "Fri", saturday: "Sat", sunday: "Sun",
};
const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const h = Math.floor(i / 2) + 7;
  return `${h.toString().padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`;
});

interface Block { id?: string; day: string; startTime: string; endTime: string; label: string; isFree: boolean }

const BLOCK_COLORS = [
  "bg-blue-100 border-blue-200 text-blue-800",
  "bg-violet-100 border-violet-200 text-violet-800",
  "bg-amber-100 border-amber-200 text-amber-800",
  "bg-pink-100 border-pink-200 text-pink-800",
  "bg-teal-100 border-teal-200 text-teal-800",
  "bg-red-100 border-red-200 text-red-800",
  "bg-indigo-100 border-indigo-200 text-indigo-800",
];

function blockColor(label: string, isFree: boolean) {
  if (isFree) return "bg-emerald-50 border-emerald-200 text-emerald-700";
  let h = 0;
  for (let i = 0; i < label.length; i++) h = label.charCodeAt(i) + ((h << 5) - h);
  return BLOCK_COLORS[Math.abs(h) % BLOCK_COLORS.length];
}

export default function SchedulePage() {
  const { userId } = useProfile();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [nb, setNb] = useState<Block>({ day: "monday", startTime: "09:00", endTime: "10:00", label: "", isFree: false });

  const fetch_ = useCallback(async () => {
    if (!userId) return;
    try { const r = await fetch(`/api/schedule?userId=${userId}`); setBlocks(await r.json()); }
    catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  function addBlock() {
    if (!nb.label.trim()) { toast.error("Name your block (e.g. CS 400)"); return; }
    setBlocks((p) => [...p, { ...nb }]); setAdding(false);
    setNb({ day: "monday", startTime: "09:00", endTime: "10:00", label: "", isFree: false });
  }

  function autoFill() {
    const free: Block[] = [];
    for (const day of DAYS) {
      const busy = blocks.filter((b) => b.day === day && !b.isFree).sort((a, b) => a.startTime.localeCompare(b.startTime));
      let cursor = "08:00";
      for (const b of busy) {
        if (b.startTime > cursor) free.push({ day, startTime: cursor, endTime: b.startTime, label: "Free", isFree: true });
        if (b.endTime > cursor) cursor = b.endTime;
      }
      if (cursor < "21:00") free.push({ day, startTime: cursor, endTime: "21:00", label: "Free", isFree: true });
    }
    setBlocks((p) => [...p.filter((b) => !b.isFree), ...free]);
    toast.success("Free time filled in");
  }

  async function save() {
    if (!userId) return;
    setSaving(true);
    try {
      const r = await fetch("/api/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, blocks }) });
      if (!r.ok) throw new Error();
      toast.success("Schedule saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-16 pb-24 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <h1 className="text-2xl font-bold text-stone-900">Your Schedule</h1>
          <p className="mt-0.5 text-[13px] text-stone-500">Add classes so we only match you when you&apos;re free.</p>
        </motion.div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={() => setAdding(true)} className="btn-primary text-[12px]"><Plus className="h-3.5 w-3.5" />Add Block</button>
          <button onClick={autoFill} className="btn-secondary text-[12px]"><Wand2 className="h-3.5 w-3.5" />Auto-Fill Free Time</button>
          <button onClick={save} disabled={saving} className="btn-primary bg-emerald-700 hover:bg-emerald-800 text-[12px] ml-auto">
            <Save className="h-3.5 w-3.5" />{saving ? "Saving..." : "Save"}
          </button>
        </div>

        {adding && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-bold text-stone-900">New block</p>
              <button onClick={() => setAdding(false)} className="text-stone-400 hover:text-stone-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-stone-500">Day</label>
                <select value={nb.day} onChange={(e) => setNb({ ...nb, day: e.target.value })} className="input-field text-[12px]">
                  {DAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-stone-500">Start</label>
                <select value={nb.startTime} onChange={(e) => setNb({ ...nb, startTime: e.target.value })} className="input-field text-[12px]">
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-stone-500">End</label>
                <select value={nb.endTime} onChange={(e) => setNb({ ...nb, endTime: e.target.value })} className="input-field text-[12px]">
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-stone-500">Label</label>
                <input type="text" value={nb.label} onChange={(e) => setNb({ ...nb, label: e.target.value })}
                  placeholder="CS 400" className="input-field text-[12px]" />
              </div>
              <div className="flex items-end"><button onClick={addBlock} className="btn-primary w-full text-[12px]">Add</button></div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-stone-200 border-t-stone-600" />
          </div>
        ) : (
          <div className="card overflow-x-auto p-3">
            <div className="grid min-w-[640px]" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
              <div />
              {DAYS.map((d) => (
                <div key={d} className="px-1 py-2 text-center text-[10px] font-bold text-stone-400 uppercase">{DAY_LABELS[d]}</div>
              ))}
              {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time) => (
                <div key={time} className="contents">
                  <div className="flex items-start justify-end pr-1.5 pt-0.5 text-[9px] text-stone-400 tabular-nums">{time}</div>
                  {DAYS.map((day) => {
                    const b = blocks.find((bl) => bl.day === day && bl.startTime <= time && bl.endTime > time);
                    const isStart = b?.startTime === time;
                    if (b && isStart) {
                      const si = TIME_SLOTS.indexOf(b.startTime), ei = TIME_SLOTS.indexOf(b.endTime);
                      const span = Math.max(1, Math.floor((ei - si) / 2));
                      return (
                        <div key={`${day}-${time}`}
                          className={`relative mx-0.5 rounded-lg border px-1.5 py-0.5 text-[10px] font-medium ${blockColor(b.label, b.isFree)}`}
                          style={{ gridRow: `span ${span}` }}
                        >
                          <div className="truncate font-semibold">{b.label}</div>
                          <div className="text-[8px] opacity-70 flex items-center gap-0.5"><Clock className="h-2 w-2" />{b.startTime}–{b.endTime}</div>
                          {!b.isFree && (
                            <button onClick={() => setBlocks((p) => p.filter((_, j) => j !== blocks.indexOf(b)))}
                              className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <X className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>
                      );
                    }
                    if (b) return <div key={`${day}-${time}`} />;
                    return <div key={`${day}-${time}`} className="mx-0.5 border-b border-stone-50 min-h-[24px]" />;
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 card bg-stone-50 border-stone-200 flex items-start gap-2.5 p-3.5">
          <Info className="h-4 w-4 text-stone-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-stone-500">
            Add your classes first, then hit <strong>Auto-Fill Free Time</strong> to mark when you&apos;re available. Update anytime.
          </p>
        </div>
      </main>
    </div>
  );
}
