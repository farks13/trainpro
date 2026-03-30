"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, eachDayOfInterval, subDays } from "date-fns";

interface Workout {
  id: string;
  scheduledDate: Date | string;
  status: string;
}

interface Props {
  data: Workout[];
}

export function RecentWorkoutsChart({ data }: Props) {
  // Build 14-day chart data
  const days = eachDayOfInterval({
    start: subDays(new Date(), 13),
    end: new Date(),
  });

  const chartData = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const count = data.filter(
      (w) => format(new Date(w.scheduledDate), "yyyy-MM-dd") === dayStr
    ).length;
    return {
      day: format(day, "MMM d"),
      workouts: count,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={1}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            fontSize: 12,
          }}
        />
        <Bar
          dataKey="workouts"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
