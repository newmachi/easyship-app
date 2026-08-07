// @ts-nocheck
import { Star } from "lucide-react";
import { C, STAGES } from "../constants";

/* ── Number Formatter ─────────────────────────────── */
export const fmt = (n) => "₦" + Number(n).toLocaleString();

/* ── Input Class Strings ──────────────────────────── */
export const inp   = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50";
export const inpSm = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50";

/* ── Pill Badge ───────────────────────────────────── */
const PILL_S = [
  "bg-gray-100 text-gray-600",
  "bg-blue-100 text-blue-600",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-green-100 text-green-700",
];

export const Pill = ({ stage, approved }) => {
  if (!approved)
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
        Pending Approval
      </span>
    );
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${PILL_S[stage] || PILL_S[0]}`}>
      {STAGES[stage]?.label}
    </span>
  );
};

/* ── Star Rating ──────────────────────────────────── */
export const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={14}
        color={i <= n ? "#F97316" : "#CBD5E1"}
        fill={i <= n ? "#F97316" : "none"}
      />
    ))}
  </div>
);

/* ── Spinner ──────────────────────────────────────── */
export const Spinner = ({ size = 24, color = "white" }) => (
  <div
    className="inline-block rounded-full border-2 border-t-transparent animate-spin"
    style={{
      width: size,
      height: size,
      borderColor: `${color} transparent ${color} ${color}`,
    }}
  />
);

/* ── Loading Screen ───────────────────────────────── */
export const LoadingScreen = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: C.dark }}
  >
    <div className="text-center">
      <div className="text-white font-black text-4xl mb-6">
        Easy<span style={{ color: C.orange }}>Ship</span>
      </div>
      <Spinner size={36} color="#F97316" />
      <p className="text-blue-300 text-sm mt-4">Loading your dashboard...</p>
    </div>
  </div>
);
