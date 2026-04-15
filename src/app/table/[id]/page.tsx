"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MapView from "@/components/MapView";
import VibeIcon from "@/components/VibeIcon";
import { useProfile } from "@/lib/useProfile";
import { DINING_HALLS, VIBES, haversineDistance, walkingTimeMinutes } from "@/lib/dining-halls";
import { MessageCircle, MapPin, Armchair, ArrowRight, Footprints, Sparkles } from "lucide-react";

interface TableMember {
  id: string; role: string;
  user: { id: string; name: string; avatarEmoji: string; year: string; major: string; interests: string; bio: string; };
}
interface TableData {
  id: string; diningHall: string; vibe: string; date: string; time: string; maxSize: number;
  status: string; icebreaker: string | null; aiPrompt: string | null; tableSpot: string | null;
  members: TableMember[];
}

export default function TableDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, userId } = useProfile();
  const userLat = profile?.lat ?? null;
  const userLng = profile?.lng ?? null;
  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const tableId = params.id as string;

  const fetchTable = useCallback(async () => {
    try {
      const res = await fetch(`/api/tables/${tableId}`);
      if (!res.ok) throw new Error();
      setTable(await res.json());
    } catch { router.push("/dashboard"); }
    finally { setLoading(false); }
  }, [tableId, router]);

  useEffect(() => { fetchTable(); }, [fetchTable]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-3 border-stone-200 border-t-stone-600 mb-3" />
          <p className="text-[13px] text-stone-400">Setting the table...</p>
        </div>
      </div>
    );
  }
  if (!table) return null;

  const diningHall = DINING_HALLS.find((h) => h.id === table.diningHall);
  const vibe = VIBES.find((v) => v.id === table.vibe);
  const walkTime = userLat && userLng && diningHall
    ? walkingTimeMinutes(haversineDistance(userLat, userLng, diningHall.lat, diningHall.lng)) : null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 md:pt-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
              table.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              table.status === "forming" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-stone-100 text-stone-500 border-stone-200"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${table.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
              {table.status === "active" ? "Table Ready" : "Forming"}
            </span>
            {vibe && (
              <span className={`flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${vibe.color}`}>
                <VibeIcon name={vibe.icon} className="h-3 w-3" />
                {vibe.label}
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold text-stone-900">{diningHall?.name || table.diningHall}</h1>
          <div className="mt-1 flex items-center gap-3 text-[12px] text-stone-500">
            <span>{table.date} at {table.time}</span>
            {walkTime && (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Footprints className="h-3 w-3" />{walkTime} min walk
              </span>
            )}
          </div>

          {/* Members */}
          <div className="mt-5">
            <p className="section-label mb-2.5">Your table ({table.members.length}/{table.maxSize})</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {table.members.map((member) => {
                const interests: string[] = JSON.parse(member.user.interests || "[]");
                const isYou = member.user.id === userId;
                return (
                  <div key={member.id} className={`rounded-xl border p-3.5 ${isYou ? "border-red-200 bg-red-50/50" : "border-stone-200 bg-white"}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold ${
                        isYou ? "bg-red-100 text-red-700" : "bg-stone-100 text-stone-600"
                      }`}>
                        {member.user.name?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-stone-900 truncate">
                          {member.user.name} {isYou && <span className="text-red-500 text-[11px] font-semibold">(you)</span>}
                        </p>
                        <p className="text-[11px] text-stone-500">{member.user.year} · {member.user.major}</p>
                      </div>
                    </div>
                    {member.user.bio && <p className="mt-2 text-[11px] text-stone-500 italic">&ldquo;{member.user.bio}&rdquo;</p>}
                    {interests.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {interests.slice(0, 3).map((i) => (
                          <span key={i} className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] font-medium text-stone-500">{i}</span>
                        ))}
                        {interests.length > 3 && <span className="text-[9px] text-stone-400">+{interests.length - 3}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
              {Array.from({ length: table.maxSize - table.members.length }).map((_, i) => (
                <div key={`e-${i}`} className="rounded-xl border-2 border-dashed border-stone-200 p-3.5 flex items-center justify-center">
                  <span className="text-[11px] text-stone-300">Waiting for someone...</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reveal */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
          {!revealed ? (
            <button onClick={() => setRevealed(true)}
              className="w-full card border-dashed border-2 border-stone-300 bg-white p-8 text-center group hover:border-stone-400 hover:shadow-md transition-all"
            >
              <Sparkles className="h-6 w-6 mx-auto text-stone-400 group-hover:text-stone-600 transition-colors mb-3" />
              <p className="text-[14px] font-bold text-stone-800">Tap to reveal your table details</p>
              <p className="mt-1 text-[12px] text-stone-400">Where to sit, what to say, how to start</p>
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
              {table.tableSpot && (
                <div className="card bg-amber-50/50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <Armchair className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="section-label text-amber-500 mb-0.5">Where to sit</p>
                      <p className="text-[14px] font-bold text-stone-900">{table.tableSpot}</p>
                    </div>
                  </div>
                </div>
              )}
              {table.aiPrompt && (
                <div className="card bg-blue-50/50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="section-label text-blue-500 mb-0.5">How to introduce yourself</p>
                      <p className="text-[13px] font-medium text-stone-800">{table.aiPrompt}</p>
                    </div>
                  </div>
                </div>
              )}
              {table.icebreaker && (
                <div className="card bg-red-50/50 border-red-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="section-label text-red-500 mb-0.5">Conversation starter</p>
                      <p className="text-[15px] font-bold text-stone-900 leading-snug">&ldquo;{table.icebreaker}&rdquo;</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Map */}
        {diningHall && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
            <p className="section-label mb-2">Find the dining hall</p>
            <MapView
              selectedHall={table.diningHall}
              userLocation={userLat && userLng ? { lat: userLat, lng: userLng } : null}
              className="h-[220px]"
            />
            <p className="mt-1.5 text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" />{diningHall.address}
            </p>
          </motion.div>
        )}

        <div className="mt-6 flex gap-3">
          <Link href="/find-table" className="btn-secondary flex-1 justify-center">Find Another Table</Link>
          <Link href="/dashboard" className="btn-ghost flex-1 justify-center">Dashboard</Link>
        </div>
      </main>
    </div>
  );
}
