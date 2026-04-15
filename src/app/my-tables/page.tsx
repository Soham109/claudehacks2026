"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import VibeIcon from "@/components/VibeIcon";
import { useProfile } from "@/lib/useProfile";
import { DINING_HALLS, VIBES } from "@/lib/dining-halls";
import { Search, ArrowRight, MessageCircle } from "lucide-react";

interface TableData {
  id: string; diningHall: string; vibe: string; date: string; time: string;
  status: string; icebreaker: string | null; maxSize: number;
  members: { user: { name: string; avatarEmoji: string } }[];
}

export default function MyTablesPage() {
  const { userId } = useProfile();
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    if (!userId) return;
    try { const r = await fetch(`/api/tables?userId=${userId}`); setTables(await r.json()); }
    catch { /* */ } finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayTables = tables.filter((t) => t.date === todayStr);
  const pastTables = tables.filter((t) => t.date !== todayStr);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pt-16 pb-24 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900">My Tables</h1>
          <p className="mt-0.5 text-[13px] text-stone-500">Your past and upcoming shared meals.</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-stone-200 border-t-stone-600" />
          </div>
        ) : tables.length === 0 ? (
          <div className="card text-center py-14">
            <Search className="h-8 w-8 mx-auto text-stone-300 mb-3" />
            <h2 className="text-[15px] font-bold text-stone-900">No tables yet</h2>
            <p className="mt-1 text-[13px] text-stone-500 mb-5">Find your first table and make a connection.</p>
            <Link href="/find-table" className="btn-primary">Find a Table <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        ) : (
          <div className="space-y-6">
            {todayTables.length > 0 && (
              <section>
                <p className="section-label mb-2.5">Today</p>
                <div className="grid gap-3 sm:grid-cols-2">{todayTables.map((t) => <TableCard key={t.id} table={t} />)}</div>
              </section>
            )}
            {pastTables.length > 0 && (
              <section>
                <p className="section-label mb-2.5">Past</p>
                <div className="grid gap-3 sm:grid-cols-2">{pastTables.map((t) => <TableCard key={t.id} table={t} />)}</div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function TableCard({ table }: { table: TableData }) {
  const dh = DINING_HALLS.find((h) => h.id === table.diningHall);
  const vibe = VIBES.find((v) => v.id === table.vibe);
  return (
    <Link href={`/table/${table.id}`}>
      <div className="card-interactive">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-stone-900">{dh?.name || table.diningHall}</span>
          <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
            table.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            table.status === "forming" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-stone-100 text-stone-500 border-stone-200"
          }`}>
            {table.status}
          </span>
        </div>
        {vibe && (
          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold mb-2 ${vibe.color}`}>
            <VibeIcon name={vibe.icon} className="h-3 w-3" />{vibe.label}
          </span>
        )}
        <p className="text-[11px] text-stone-400 mb-2">{table.date} · {table.time}</p>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {table.members.map((m, i) => (
              <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-stone-200 text-[10px] font-bold text-stone-600">
                {m.user.name?.[0] || "?"}
              </div>
            ))}
            {table.members.length < table.maxSize && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-stone-300 text-[9px] text-stone-400">
                +{table.maxSize - table.members.length}
              </div>
            )}
          </div>
          {table.icebreaker && <MessageCircle className="h-3.5 w-3.5 text-stone-300" />}
        </div>
      </div>
    </Link>
  );
}
