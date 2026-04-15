"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import LocationPicker from "@/components/LocationPicker";
import { useProfile } from "@/lib/useProfile";
import { RESIDENCE_HALLS } from "@/lib/dining-halls";
import toast from "react-hot-toast";
import { Pencil, LogOut, Save, X, MapPin, GraduationCap } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, refetch } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ed, setEd] = useState({ bio: "", residenceHall: "", lat: null as number | null, lng: null as number | null, addressLabel: "" });

  const hall = RESIDENCE_HALLS.find((h) => h.id === profile?.residenceHall);

  function startEdit() {
    if (!profile) return;
    setEd({ bio: profile.bio, residenceHall: profile.residenceHall, lat: profile.lat, lng: profile.lng, addressLabel: hall?.name || "" });
    setEditing(true);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const r = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: profile?.year, major: profile?.major, interests: profile?.interests, dietaryPrefs: profile?.dietaryPrefs, residenceHall: ed.residenceHall, bio: ed.bio, lat: ed.lat, lng: ed.lng }),
      });
      if (!r.ok) throw new Error();
      await refetch();
      setEditing(false);
      toast.success("Profile updated");
    } catch { toast.error("Failed to update"); } finally { setSaving(false); }
  }

  if (isLoading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-3 border-stone-200 border-t-stone-600" /></div>;

  if (!profile?.isOnboarded) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="card text-center max-w-sm">
          <GraduationCap className="h-8 w-8 mx-auto text-stone-400 mb-3" />
          <h2 className="text-[15px] font-bold text-stone-900">Complete your profile first</h2>
          <button onClick={() => router.push("/onboarding")} className="btn-primary mt-4 w-full justify-center">Get Started</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 pt-16 pb-24 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl font-bold text-stone-600">
              {profile.name?.[0]?.toUpperCase() || "?"}
            </div>
            <h1 className="text-xl font-bold text-stone-900">{profile.name}</h1>
            <p className="text-[12px] text-stone-500 mt-0.5">{profile.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="chip bg-stone-100 text-stone-700">{profile.year}</span>
              <span className="chip bg-blue-50 text-blue-700">{profile.major}</span>
            </div>
            {editing ? (
              <textarea value={ed.bio} onChange={(e) => setEd({ ...ed, bio: e.target.value })}
                className="input-field mt-3 resize-none text-[13px]" rows={2} placeholder="Bio..." />
            ) : profile.bio ? (
              <p className="mt-3 text-[13px] text-stone-500 italic">&ldquo;{profile.bio}&rdquo;</p>
            ) : null}
          </div>

          <div className="mt-4 card">
            <p className="section-label mb-3">Details</p>
            <div className="space-y-3">
              <div className="py-2 border-b border-stone-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-stone-500 flex items-center gap-1.5"><MapPin className="h-3 w-3" />Location</span>
                  {!editing && <span className="text-[12px] font-semibold text-stone-800">{hall?.name || "Not set"}</span>}
                </div>
                {editing && (
                  <div className="mt-2">
                    <LocationPicker location={ed.lat && ed.lng ? { lat: ed.lat, lng: ed.lng } : null}
                      onLocationChange={(lat, lng) => setEd({ ...ed, lat, lng })}
                      residenceHall={ed.residenceHall} onResidenceChange={(id) => setEd({ ...ed, residenceHall: id })}
                      addressLabel={ed.addressLabel} onAddressChange={(l) => setEd({ ...ed, addressLabel: l })} />
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between py-2 border-b border-stone-100">
                <span className="text-[12px] text-stone-500">Interests</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[220px]">
                  {profile.interests.map((i) => <span key={i} className="chip bg-stone-100 text-stone-600 text-[10px]">{i}</span>)}
                </div>
              </div>
              <div className="flex items-start justify-between py-2">
                <span className="text-[12px] text-stone-500">Dietary</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {profile.dietaryPrefs.length > 0 ? profile.dietaryPrefs.map((d) => <span key={d} className="chip bg-stone-100 text-stone-600 text-[10px]">{d}</span>) : <span className="text-[12px] text-stone-400">None</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {editing ? (
              <>
                <button onClick={saveProfile} disabled={saving} className="btn-primary flex-1 justify-center"><Save className="h-3.5 w-3.5" />{saving ? "Saving..." : "Save"}</button>
                <button onClick={() => setEditing(false)} className="btn-ghost"><X className="h-3.5 w-3.5" />Cancel</button>
              </>
            ) : (
              <>
                <button onClick={startEdit} className="btn-secondary flex-1 justify-center"><Pencil className="h-3.5 w-3.5" />Edit Profile</button>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
