"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  year: string;
  major: string;
  interests: string[];
  dietaryPrefs: string[];
  residenceHall: string;
  lat: number | null;
  lng: number | null;
  bio: string;
  isOnboarded: boolean;
}

export function useProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) { setLoading(false); return; }
    try {
      const res = await fetch(`/api/profile?userId=${session.user.id}`);
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      setProfile({
        ...data,
        interests: JSON.parse(data.interests || "[]"),
        dietaryPrefs: JSON.parse(data.dietaryPrefs || "[]"),
      });
    } catch { /* */ }
    finally { setLoading(false); }
  }, [session?.user?.id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return {
    profile,
    session,
    userId: session?.user?.id || null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || loading,
    refetch: fetchProfile,
  };
}
