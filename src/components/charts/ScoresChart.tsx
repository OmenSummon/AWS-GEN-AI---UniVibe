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
  const data = [
    { factor: "Technical", score: scores.technical_potential || 85, fullMark: 100 },
    { factor: "Creativity", score: scores.creativity || 80, fullMark: 100 },
    { factor: "Leadership", score: scores.leadership || 75, fullMark: 100 },
    { factor: "Networking", score: scores.networking || 70, fullMark: 100 },
    { factor: "Innovation", score: scores.innovation || 88, fullMark: 100 },
    { factor: "Campus Engagement", score: scores.campus_engagement || 72, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72 sm:h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#2D2254" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="factor"
            tick={{ fill: "#C4B5FD", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#6B7280", fontSize: 9 }}
            stroke="#2D2254"
          />
          <Radar
            name="UniVibe Score"
            dataKey="score"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#130F26",
              borderColor: "#8B5CF6",
              borderRadius: "12px",
              color: "#FFF",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

