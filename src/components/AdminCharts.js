"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";

export default function AdminCharts({ eventStats, paymentStats }) {
  // Warna Palette (Amber, Emerald, Rose)
  const PIE_COLORS = ["#fbbf24", "#10b981", "#f43f5e"];

  // Custom Tooltip Component (Modern Style)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 text-xs">
          <p className="font-bold text-slate-800 mb-0.5">
            {label || payload[0].name}
          </p>
          <p className="text-indigo-600 font-bold">{payload[0].value} Data</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Grafik Batang: Peserta per Event */}
      <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 relative">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Peserta per Event
            </h3>
            <p className="text-[10px] text-slate-400">Top event terlaris</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={eventStats}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                interval={0} // Paksa tampil semua label
                dy={10}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f1f5f9", radius: 8 }}
              />
              <Bar
                dataKey="count"
                fill="#6366f1" // Indigo-500
                radius={[6, 6, 0, 0]}
                barSize={32}
                name="Jumlah Peserta"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Grafik Donut: Status Pembayaran */}
      <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 relative">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <PieIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Status Pembayaran
            </h3>
            <p className="text-[10px] text-slate-400">Distribusi transaksi</p>
          </div>
        </div>

        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {paymentStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-slate-600 font-bold text-xs ml-1">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Teks di Tengah Donut (Total Data) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                TOTAL
              </span>
              <span className="text-3xl font-black text-slate-800">
                {paymentStats.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
