"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { IntelligenceScores } from "@/types";

interface ScoresChartProps {
  scores: IntelligenceScores;
}

export function ScoresChart({ scores }: ScoresChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const data = [
    { factor: "Technical", score: scores.technical_potential || 85, fullMark: 100 },
    { factor: "Creativity", score: scores.creativity || 80, fullMark: 100 },
    { factor: "Leadership", score: scores.leadership || 75, fullMark: 100 },
    { factor: "Networking", score: scores.networking || 70, fullMark: 100 },
    { factor: "Innovation", score: scores.innovation || 88, fullMark: 100 },
    { factor: "Campus Engagement", score: scores.campus_engagement || 72, fullMark: 100 },
  ];

  if (!mounted) {
    return (
      <div className="w-full h-72 sm:h-80 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-[#446B8D]/30 flex items-center justify-center text-xs text-[#E4B74A]">
          Loading chart...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-72 sm:h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#444343" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="factor"
            tick={{ fill: "#FEFEFE", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#A8A8A8", fontSize: 9 }}
            stroke="#444343"
          />
          <Radar
            name="UniVibe Score"
            dataKey="score"
            stroke="#446B8D"
            fill="#446B8D"
            fillOpacity={0.45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2C2B2B",
              borderColor: "#E4B74A",
              borderRadius: "12px",
              color: "#FEFEFE",
              fontSize: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
