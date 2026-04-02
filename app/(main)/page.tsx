export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format, subDays } from "date-fns";
import { Activity, Dumbbell, TrendingUp, Calendar, ChevronRight, Zap, BarChart2, Heart, Play } from "lucide-react";

async function getDashboardData() {
  const [recentSessions, totalSessions, completedSessions, exerciseCount] = await Promise.all([
    prisma.workoutSession.findMany({
      take: 5,
      orderBy: { scheduledDate: "desc" },
      include: {
        workoutTemplate: true,
        setLogs: true,
      },
    }),
    prisma.workoutSession.count(),
    prisma.workoutSession.count({ where: { status: "completed" } }),
    prisma.exercise.count(),
  ]);

  return { recentSessions, totalSessions, completedSessions, exerciseCount };
}

export default async function DashboardPage() {
  const { recentSessions, totalSessions, completedSessions, exerciseCount } = await getDashboardData();

  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1, margin: 0 }}>
          {greeting}, Steve
        </h1>
        <p style={{ color: "#888888", marginTop: 6, fontSize: 15 }}>
          {format(today, "EEEE, MMMM d")}
        </p>
      </div>

      {/* Up Next */}
      <div style={{ backgroundColor: "#E85D20", borderRadius: 20, padding: "24px 28px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Up Next</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 }}>
            {recentSessions.find(s => s.status === "in_progress")
              ? recentSessions.find(s => s.status === "in_progress")?.workoutTemplate?.name ?? "Continue Workout"
              : "Start Today's Workout"}
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 4 }}>
            {completedSessions} of {totalSessions} sessions completed
          </p>
        </div>
        <Link href="/workout" style={{ textDecoration: "none" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ color: "#fff", fontSize: 20 }}>▶</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888888", marginBottom: 12 }}>Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/cardio", icon: "♥", label: "Log Cardio", sub: "Track your run" },
            { href: "/program", icon: "≡", label: "My Program", sub: "View schedule" },
            { href: "/progress", icon: "↗", label: "Progress", sub: "See your gains" },
          ].map((a) => (
            <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
              <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#E85D20", flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#1A1A1A", fontSize: 14, margin: 0 }}>{a.label}</p>
                  <p style={{ color: "#888888", fontSize: 12, margin: 0 }}>{a.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Sessions", value: totalSessions, icon: "📅" },
          { label: "Completed", value: completedSessions, icon: "✓" },
          { label: "Completion Rate", value: `${completionRate}%`, icon: "📈" },
          { label: "Exercises", value: exerciseCount, icon: "💪" },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: "#fff", borderRadius: 16, padding: "20px 22px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#888888", margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 52, fontWeight: 800, color: "#1A1A1A", lineHeight: 1, margin: "8px 0 0" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div style={{ backgroundColor: "#fff", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
          <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1A1A1A", margin: 0 }}>Recent Sessions</h2>
          <Link href="/program" style={{ color: "#E85D20", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            View all →
          </Link>
        </div>
        <div style={{ borderTop: "1px solid #F0F0ED" }}>
          {recentSessions.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "#888888" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>🏋️</p>
              <p style={{ fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px" }}>No sessions yet</p>
              <p style={{ fontSize: 14, margin: 0 }}>Start your first workout to track progress</p>
            </div>
          ) : (
            recentSessions.map((session, i) => (
              <div key={session.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderBottom: i < recentSessions.length - 1 ? "1px solid #F0F0ED" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: session.status === "completed" ? "#F0FDF4" : "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 16 }}>{session.status === "completed" ? "✅" : "🔄"}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: "#1A1A1A", margin: 0, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {session.workoutTemplate?.name ?? "Free Workout"}
                  </p>
                  <p style={{ color: "#888888", fontSize: 12, margin: 0 }}>
                    {format(new Date(session.scheduledDate), "MMM d, yyyy")} · {session.setLogs.length} sets
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: session.status === "completed" ? "#16a34a" : "#E85D20", backgroundColor: session.status === "completed" ? "#F0FDF4" : "#FFF0EA", borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>
                  {session.status === "completed" ? "Done" : "Active"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
