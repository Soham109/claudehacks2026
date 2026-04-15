"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import MapView, { DiningHallCard } from "@/components/MapView";
import { useProfile } from "@/lib/useProfile";
import { DINING_HALLS, type DiningHall } from "@/lib/dining-halls";
import toast from "react-hot-toast";
import { Search, Calendar, Users, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

interface CheckinData { id: string; diningHall: string; user: { name: string } }
interface TableData {
  id: string; diningHall: string; vibe: string; time: string; status: string;
  members: { user: { name: string } }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile, userId, isLoading } = useProfile();
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [checkins, setCheckins] = useState<CheckinData[]>([]);
  const [myTables, setMyTables] = useState<TableData[]>([]);
  const [checkingIn, setCheckingIn] = useState(false);

  const userLocation = profile?.lat && profile?.lng ? { lat: profile.lat, lng: profile.lng } : null;
  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const [cr, tr] = await Promise.all([fetch("/api/checkin"), fetch(`/api/tables?userId=${userId}&date=${today}`)]);
      const cd = await cr.json(); const td = await tr.json();
      if (Array.isArray(cd)) setCheckins(cd);
      if (Array.isArray(td)) setMyTables(td);
    } catch { /* */ }
  }, [userId, today]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!isLoading && profile && !profile.isOnboarded) router.push("/onboarding");
  }, [isLoading, profile, router]);

  async function handleCheckin(hallId: string) {
    if (!userId) return;
    setCheckingIn(true);
    try {
      const res = await fetch("/api/checkin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, diningHall: hallId }) });
      if (!res.ok) throw new Error();
      toast.success(`Checked in at ${DINING_HALLS.find((h) => h.id === hallId)?.name}`);
      fetchData();
    } catch { toast.error("Check-in failed"); } finally { setCheckingIn(false); }
  }

  if (isLoading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-3 border-stone-200 border-t-stone-600" /></div>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-16 pb-24 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900">{greeting}, {profile?.name?.split(" ")[0]}</h1>
          <p className="mt-0.5 text-[13px] text-stone-500">Ready to find your table today?</p>
        </motion.div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { href: "/find-table", icon: Search, label: "Find a Table", desc: "Pick a vibe, get matched", accent: "text-red-600" },
            { href: "/schedule", icon: Calendar, label: "Update Schedule", desc: "Keep classes current", accent: "text-blue-600" },
            { href: "/my-tables", icon: Users, label: "My Tables", desc: myTables.length > 0 ? `${myTables.length} today` : "None yet", accent: "text-emerald-600" },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                className="card-interactive group flex items-start gap-3.5">
                <div className={`mt-0.5 ${item.accent}`}><item.icon className="h-5 w-5" /></div>
                <div className="flex-1"><h3 className="text-[13px] font-bold text-stone-900">{item.label}</h3><p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p></div>
                <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 transition-colors mt-0.5" />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="section-label mb-3">Campus dining halls</p>
            <MapView selectedHall={selectedHall} onSelectHall={(h: DiningHall) => setSelectedHall(h.id)} userLocation={userLocation} className="h-[380px]" />
          </div>
          <div className="lg:col-span-2 space-y-2.5">
            <p className="section-label mb-1">All halls</p>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {DINING_HALLS.map((hall) => {
                const hc = checkins.filter((c) => c.diningHall === hall.id);
                return (
                  <div key={hall.id}>
                    <DiningHallCard hall={hall} selected={selectedHall === hall.id} onClick={() => setSelectedHall(hall.id)} userLocation={userLocation} />
                    {selectedHall === hall.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-1.5 flex items-center gap-2 px-1">
                        <button onClick={() => handleCheckin(hall.id)} disabled={checkingIn} className="btn-primary text-[11px] py-1.5 px-3">
                          <MapPin className="h-3 w-3" />{checkingIn ? "..." : "I'm here"}
                        </button>
                        {hc.length > 0 && <span className="flex items-center gap-1 text-[11px] text-stone-400"><CheckCircle2 className="h-3 w-3" />{hc.length} here now</span>}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {myTables.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
            <p className="section-label mb-3">Your tables today</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {myTables.map((table) => {
                const dh = DINING_HALLS.find((h) => h.id === table.diningHall);
                return (
                  <Link key={table.id} href={`/table/${table.id}`}>
                    <div className="card-interactive">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-stone-900">{dh?.name || table.diningHall}</span>
                        <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${table.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${table.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {table.status === "active" ? "Ready" : "Forming"}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mb-2">{table.vibe} · {table.time}</p>
                      <div className="flex -space-x-1.5">
                        {table.members.map((m, i) => <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-stone-200 text-[10px] font-bold text-stone-600">{m.user.name?.[0]}</div>)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
