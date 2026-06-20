"use client";
import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", score: 680, label: "Risiko Sedang" },
  { name: "Mar", score: 700, label: "Risiko Rendah" },
  { name: "Mei", score: 780, label: "Risiko Rendah" },
  { name: "Jul", score: 740, label: "Risiko Rendah" },
  { name: "Sep", score: 810, label: "Risiko Rendah" },
  { name: "Nov", score: 840, label: "Risiko Rendah" },
];

export default function PortfolioTrendChart() {
  const [mounted, setMounted] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; score: number; label: string } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Custom Tooltip component to match design requirements
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white px-3.5 py-2.5 rounded-lg text-xs font-semibold shadow-xl border border-slate-800 animate-fade-in z-50">
          <p className="font-bold text-slate-400">{dataPoint.month || payload[0].name}</p>
          <p className="text-white text-[14px] mt-0.5 font-extrabold">{payload[0].value} Pts</p>
          <p className="text-blue-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">{dataPoint.label}</p>
        </div>
      );
    }
    return null;
  };

  const handleMouseMove = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const activeData = state.activePayload[0].payload;
      setHoveredPoint({
        month: activeData.name === "Jan" ? "Januari" : activeData.name === "Mar" ? "Maret" : activeData.name === "Mei" ? "Mei" : activeData.name === "Jul" ? "Juli" : activeData.name === "Sep" ? "September" : "November",
        score: activeData.score,
        label: activeData.label,
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Tren Risiko Portofolio</h3>
          <p className="text-slate-500 font-[var(--font-inter)] text-[14px] mt-1">Rata-rata tertimbang Skor Risiko dari waktu ke waktu</p>
        </div>
        <div className="bg-blue-50/70 text-blue-600 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shrink-0">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 700" }}>trending_down</span>
          <span>-4.2% Thn ke Thn</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="flex-1 min-h-[220px] relative w-full mt-4">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003ADA" stopOpacity="0.15" />
                  <stop offset="95%" stopColor="#003ADA" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eff2f5" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis hide={true} domain={["dataMin - 100", "dataMax + 100"]} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#003ADA", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#003ADA"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                dot={{
                  stroke: "#003ADA",
                  strokeWidth: 3,
                  r: 4.5,
                  fill: "#ffffff",
                  fillOpacity: 1,
                }}
                activeDot={{
                  stroke: "#003ADA",
                  strokeWidth: 3,
                  r: 6.5,
                  fill: "#003ADA",
                  fillOpacity: 1,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 font-semibold text-sm">
            Memuat grafik...
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      {hoveredPoint ? (
        <div className="mt-6 p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl flex items-center justify-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
          <span className="text-sm font-semibold text-blue-900">
            Rerata Skor {hoveredPoint.month}: <strong className="text-[15px] text-blue-600 font-extrabold">{hoveredPoint.score} Pts</strong> ({hoveredPoint.label})
          </span>
        </div>
      ) : (
        <div className="mt-6 p-3.5 border border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 bg-slate-50/50">
          <span className="material-symbols-outlined text-[18px] text-slate-400">ads_click</span>
          <span className="text-sm text-slate-500">
            Arahkan kursor ke titik garis untuk riwayat skor.
          </span>
        </div>
      )}
    </div>
  );
}
