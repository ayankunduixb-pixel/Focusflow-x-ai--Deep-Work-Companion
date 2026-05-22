import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const logFocusSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      mode: z.enum(["focus", "break"]),
      duration_minutes: z.number().int().min(1).max(180),
      xp_earned: z.number().int().min(0).max(500),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("focus_sessions").insert({
      user_id: userId,
      mode: data.mode,
      duration_minutes: data.duration_minutes,
      xp_earned: data.xp_earned,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getUserStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [{ data: profile }, { data: sessions }] = await Promise.all([
      supabase.from("profiles").select("display_name, email, avatar_url").eq("id", userId).maybeSingle(),
      supabase
        .from("focus_sessions")
        .select("mode, duration_minutes, xp_earned, completed_at")
        .eq("user_id", userId)
        .gte("completed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("completed_at", { ascending: false }),
    ]);

    const focusOnly = (sessions ?? []).filter((s) => s.mode === "focus");
    const totalXp = focusOnly.reduce((a, s) => a + (s.xp_earned ?? 0), 0);

    // Today
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();
    const todaySessions = focusOnly.filter((s) => new Date(s.completed_at).getTime() >= todayMs);
    const focusMinutesToday = todaySessions.reduce((a, s) => a + s.duration_minutes, 0);

    // Last 7 days bucket
    const days: { day: string; min: number }[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const min = focusOnly
        .filter((s) => {
          const t = new Date(s.completed_at).getTime();
          return t >= d.getTime() && t < next.getTime();
        })
        .reduce((a, s) => a + s.duration_minutes, 0);
      days.push({ day: dayNames[d.getDay()], min });
    }

    // Streak (consecutive days with at least one focus session up to today)
    let streak = 0;
    const dayHas = new Set(
      focusOnly.map((s) => {
        const d = new Date(s.completed_at); d.setHours(0, 0, 0, 0);
        return d.getTime();
      }),
    );
    const cursor = new Date(); cursor.setHours(0, 0, 0, 0);
    while (dayHas.has(cursor.getTime())) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return {
      profile: profile ?? null,
      focusMinutesToday,
      sessionsToday: todaySessions.length,
      totalSessions: focusOnly.length,
      totalXp,
      streak,
      weekly: days,
    };
  });
