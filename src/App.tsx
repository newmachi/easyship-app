import { useState } from "react";
import {
  Package,
  Truck,
  Shield,
  Globe,
  Star,
  LogOut,
  User,
  Plus,
  Trash2,
  Check,
  BarChart3,
  Users,
  Clock,
  DollarSign,
  MapPin,
  Menu,
  Home,
  ArrowRight,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Pencil,
  Eye,
  CreditCard,
  Phone,
  Mail,
  Send,
  Play,
  Headphones,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ── Brand ────────────────────────────────────────────── */
const C = { dark: "#0D2B6B", blue: "#1A4FA0", orange: "#F97316" };

/* ── Stages ───────────────────────────────────────────── */
const STAGES = [
  { label: "Booking Confirmed", icon: "📋" },
  { label: "Package Picked Up", icon: "📦" },
  { label: "In Transit", icon: "✈️" },
  { label: "Customs Clearance", icon: "🛃" },
  { label: "Out for Delivery", icon: "🚚" },
  { label: "Delivered", icon: "✅" },
];

/* ── Seed data ────────────────────────────────────────── */
const SEED_USERS = [
  {
    id: 1,
    name: "Admin",
    email: "admin@easyship.com",
    password: "admin123",
    role: "admin",
    joined: "Jan 2024",
    active: true,
    phone: "",
    company: "",
    promoEmails: false,
  },
  {
    id: 2,
    name: "Amara Johnson",
    email: "user@easyship.com",
    password: "user123",
    role: "user",
    joined: "Mar 2024",
    active: true,
    phone: "+234 801 234 5678",
    company: "GlowUp Skincare",
    promoEmails: true,
  },
  {
    id: 3,
    name: "Emeka Obi",
    email: "emeka@example.com",
    password: "pass123",
    role: "user",
    joined: "Apr 2024",
    active: true,
    phone: "+234 802 345 6789",
    company: "TechParts Ltd",
    promoEmails: false,
  },
  {
    id: 4,
    name: "Fatima Bello",
    email: "fatima@example.com",
    password: "pass123",
    role: "user",
    joined: "May 2024",
    active: false,
    phone: "+234 803 456 7890",
    company: "",
    promoEmails: true,
  },
];

const SEED_TESTIMONIALS = [
  {
    id: 1,
    name: "Amarachi O.",
    role: "Skincare Brand Founder",
    text: "EasyShip transformed my business! My glass bottles arrive intact every time. I used to lose ₦200k monthly to breakage.",
    rating: 5,
    approved: true,
    date: "Jun 2024",
    avatar: "A",
  },
  {
    id: 2,
    name: "Emeka T.",
    role: "Electronics Retailer",
    text: "Shipped gadgets to the UK in 5 days flat. Real-time tracking is a game changer — my customers love the live updates!",
    rating: 5,
    approved: true,
    date: "May 2024",
    avatar: "E",
  },
  {
    id: 3,
    name: "Ngozi A.",
    role: "Family Head",
    text: "Sent local foodstuffs to my daughter in Texas. Arrived safe and completely transparent from start to finish.",
    rating: 4,
    approved: true,
    date: "Apr 2024",
    avatar: "N",
  },
  {
    id: 4,
    name: "Chukwuemeka B.",
    role: "SME Owner",
    text: "50% cheaper than DHL with the same delivery speed. Wish I found EasyShip sooner!",
    rating: 5,
    approved: false,
    date: "Jun 2024",
    avatar: "C",
  },
  {
    id: 5,
    name: "Adaeze M.",
    role: "Fashion Designer",
    text: "My fabrics from Italy arrived perfectly folded and on time. EasyShip is now essential to my business!",
    rating: 5,
    approved: true,
    date: "Jul 2024",
    avatar: "A",
  },
];

const SEED_SHIPMENTS = [
  {
    id: "ESS-001",
    userId: 2,
    origin: "Lagos, NG",
    dest: "London, UK",
    weight: "2.5kg",
    items: "Skincare Products (×24)",
    cost: 45200,
    paid: true,
    adminApproved: true,
    stage: 5,
    date: "Jun 12, 2024",
  },
  {
    id: "ESS-002",
    userId: 2,
    origin: "Lagos, NG",
    dest: "Houston, TX",
    weight: "5.0kg",
    items: "Food Packages (×6)",
    cost: 78500,
    paid: true,
    adminApproved: true,
    stage: 2,
    date: "Jun 20, 2024",
  },
  {
    id: "ESS-003",
    userId: 2,
    origin: "Abuja, NG",
    dest: "Accra, GH",
    weight: "1.2kg",
    items: "Documents (×3)",
    cost: 12000,
    paid: false,
    adminApproved: false,
    stage: 0,
    date: "Jun 25, 2024",
  },
  {
    id: "ESS-004",
    userId: 3,
    origin: "Lagos, NG",
    dest: "Dubai, UAE",
    weight: "8.0kg",
    items: "Electronics (×5)",
    cost: 112000,
    paid: true,
    adminApproved: true,
    stage: 5,
    date: "May 30, 2024",
  },
  {
    id: "ESS-005",
    userId: 3,
    origin: "Lagos, NG",
    dest: "Toronto, CA",
    weight: "3.2kg",
    items: "Tech Parts (×10)",
    cost: 65000,
    paid: true,
    adminApproved: true,
    stage: 3,
    date: "Jun 22, 2024",
  },
];

const SEED_PRICING = [
  { id: 1, from: "Lagos", to: "London, UK", price: 45000, days: "5–7 days" },
  { id: 2, from: "Lagos", to: "Houston, TX", price: 78500, days: "7–10 days" },
  { id: 3, from: "Lagos", to: "Accra, GH", price: 12000, days: "2–3 days" },
  { id: 4, from: "Lagos", to: "Dubai, UAE", price: 55000, days: "4–6 days" },
  { id: 5, from: "Abuja", to: "Toronto, CA", price: 65000, days: "7–10 days" },
  { id: 6, from: "Lagos", to: "New York, US", price: 82000, days: "7–10 days" },
];

const CHART_DATA = [
  { m: "Jan", s: 12 },
  { m: "Feb", s: 18 },
  { m: "Mar", s: 24 },
  { m: "Apr", s: 20 },
  { m: "May", s: 32 },
  { m: "Jun", s: 28 },
];

/* ── Helpers ──────────────────────────────────────────── */
const fmt = (n) => "₦" + Number(n).toLocaleString();
const PILL = [
  "bg-gray-100 text-gray-600",
  "bg-blue-100 text-blue-600",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-green-100 text-green-700",
];

const Pill = ({ stage, approved }) => {
  if (!approved)
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
        Pending Approval
      </span>
    );
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        PILL[stage] || PILL[0]
      }`}
    >
      {STAGES[stage]?.label}
    </span>
  );
};

const Stars = ({ n }) => (
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

const inp =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50";
const inpSm =
  "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50";

/* ══════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════ */
function LandingPage({ onNav, testimonials }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const approved = testimonials.filter((t) => t.approved);

  const media = [
    {
      type: "image",
      label: "Expert Packing",
      desc: "Fragile items handled with precision",
      grad: "from-blue-900 to-blue-700",
      icon: <Package size={36} />,
    },
    {
      type: "image",
      label: "Real-time GPS Tracking",
      desc: "Know exactly where your package is",
      grad: "from-orange-600 to-yellow-400",
      icon: <MapPin size={36} />,
    },
    {
      type: "video",
      label: "How We Pack Fragile Items",
      desc: "Watch our experts in action",
      grad: "from-gray-900 to-gray-700",
      icon: <Play size={36} />,
    },
    {
      type: "image",
      label: "Global Courier Network",
      desc: "250+ couriers across 190+ countries",
      grad: "from-blue-800 to-indigo-700",
      icon: <Globe size={36} />,
    },
    {
      type: "video",
      label: "Customer Story: GlowUp Skincare",
      desc: "How Amara scaled with EasyShip",
      grad: "from-pink-900 to-red-700",
      icon: <Play size={36} />,
    },
    {
      type: "image",
      label: "24/7 Support Team",
      desc: "Always here when you need us most",
      grad: "from-green-800 to-green-600",
      icon: <Headphones size={36} />,
    },
  ];

  const socials = [
    {
      label: "WhatsApp",
      href: "https://wa.me/2348003297447",
      bg: "#25D366",
      txt: "W",
    },
    { label: "X", href: "https://x.com/easyship", bg: "#000000", txt: "𝕏" },
    {
      label: "Facebook",
      href: "https://facebook.com/easyship",
      bg: "#1877F2",
      txt: "f",
    },
    {
      label: "Instagram",
      href: "https://instagram.com/easyship",
      style: {
        background:
          "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      },
      txt: "ig",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className="fixed top-0 w-full z-50 shadow-sm"
        style={{ background: C.dark }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-white font-black text-2xl tracking-tight">
            Easy<span style={{ color: C.orange }}>Ship</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-blue-200">
            {[
              ["#features", "Features"],
              ["#how-it-works", "How it Works"],
              ["#media", "Media"],
              ["#testimonials", "Testimonials"],
            ].map(([h, l]) => (
              <a key={l} href={h} className="hover:text-white transition">
                {l}
              </a>
            ))}
          </div>
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => onNav("login")}
              className="text-white text-sm px-4 py-2 rounded-lg border border-blue-400 hover:border-white transition"
            >
              Login
            </button>
            <button
              onClick={() => onNav("register")}
              className="text-white text-sm px-4 py-2 rounded-lg font-bold hover:opacity-90 transition"
              style={{ background: C.orange }}
            >
              Get Started
            </button>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={22} />
          </button>
        </div>
        {menuOpen && (
          <div
            className="md:hidden px-4 pb-4 space-y-2 border-t border-blue-800"
            style={{ background: C.dark }}
          >
            {["Features", "How it Works", "Media", "Testimonials"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="block text-blue-200 py-1 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {l}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onNav("login")}
                className="flex-1 text-white text-sm py-2.5 rounded-lg border border-blue-400"
              >
                Login
              </button>
              <button
                onClick={() => onNav("register")}
                className="flex-1 text-white text-sm py-2.5 rounded-lg font-bold"
                style={{ background: C.orange }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        className="pt-24 pb-20 px-4"
        style={{
          background: `linear-gradient(135deg,${C.dark} 0%,${C.blue} 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="inline-block text-xs px-3 py-1 rounded-full mb-6 font-semibold"
            style={{ background: "rgba(249,115,22,0.2)", color: "#FDBA74" }}
          >
            🚀 Nigeria's #1 Smart Shipping Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ship Smarter.
            <br />
            <span style={{ color: C.orange }}>Grow Faster.</span>
          </h1>
          <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            From local cross-city drop-offs to international border shipping —
            fully insured, real-time tracked, always on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => onNav("register")}
              className="text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
              style={{ background: C.orange }}
            >
              Start Shipping Free <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNav("login")}
              className="text-white font-semibold px-8 py-4 rounded-xl text-lg border border-blue-400 hover:border-white transition"
            >
              Login to Dashboard
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              ["10K+", "Packages Shipped"],
              ["250+", "Courier Partners"],
              ["98%", "On-Time Rate"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="text-2xl font-black"
                  style={{ color: C.orange }}
                >
                  {n}
                </div>
                <div className="text-blue-300 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>
              Why Choose EasyShip?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Built for business owners tired of broken packages, hidden fees,
              and zero accountability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield size={26} />,
                title: "Damage Protection",
                desc: "We break it, we pay it. Every package insured up to 50% of goods value — automatically.",
              },
              {
                icon: <MapPin size={26} />,
                title: "Live GPS Tracking",
                desc: "Real-time location updates at every stage — not a generic 'In Transit' message.",
              },
              {
                icon: <DollarSign size={26} />,
                title: "50% Cheaper",
                desc: "Compare 250+ couriers instantly and always lock in the best rate for your route.",
              },
              {
                icon: <Globe size={26} />,
                title: "190+ Countries",
                desc: "Automated customs handling and full documentation for every global shipment.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ background: C.blue }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: C.dark }}
                >
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>
            How It Works
          </h2>
          <p className="text-gray-500 mb-14">
            Three simple steps to smarter shipping
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Package size={32} />,
                n: "01",
                title: "Book Online",
                desc: "Enter your package details, compare rates from 250+ couriers, and confirm in minutes.",
              },
              {
                icon: <Truck size={32} />,
                n: "02",
                title: "We Handle It",
                desc: "Schedule a pickup at your door or drop off at one of our 50+ partner locations.",
              },
              {
                icon: <CheckCircle size={32} />,
                n: "03",
                title: "Track & Receive",
                desc: "Live tracking at every stage. Your recipient is notified from pickup to delivery.",
              },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="relative inline-block mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white"
                    style={{ background: C.dark }}
                  >
                    {s.icon}
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ background: C.orange }}
                  >
                    {s.n}
                  </div>
                </div>
                <h3
                  className="font-bold text-xl mb-2"
                  style={{ color: C.dark }}
                >
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section
        id="media"
        className="py-20 px-4"
        style={{ background: "#F0F4FF" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>
              EasyShip in Action
            </h2>
            <p className="text-gray-500">
              See how we handle every package with care and precision
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {media.map((m, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div
                  className={`w-full h-56 bg-gradient-to-br ${m.grad} flex flex-col items-center justify-center text-white group-hover:opacity-90 transition`}
                >
                  {m.type === "video" ? (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                      <Play size={28} fill="white" color="white" />
                    </div>
                  ) : (
                    <div className="mb-4 opacity-80">{m.icon}</div>
                  )}
                  <div className="font-bold text-center px-6 text-lg">
                    {m.label}
                  </div>
                  <div
                    className="text-sm mt-1 px-6 text-center"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    {m.desc}
                  </div>
                </div>
                {m.type === "video" && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    ▶ VIDEO
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>
              What Our Customers Say
            </h2>
            <p className="text-gray-500">
              Real results from real business owners
            </p>
          </div>
          {approved.length > 0 && (
            <div className="relative px-12">
              <div
                className="rounded-3xl p-10 text-center shadow-xl"
                style={{
                  background: `linear-gradient(135deg,${C.dark},${C.blue})`,
                }}
              >
                <div className="flex justify-center mb-4">
                  <Stars n={approved[tIdx].rating} />
                </div>
                <p className="text-white text-lg md:text-xl italic leading-relaxed mb-8">
                  "{approved[tIdx].text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl"
                    style={{ background: C.orange }}
                  >
                    {approved[tIdx].avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold">
                      {approved[tIdx].name}
                    </div>
                    <div className="text-blue-300 text-sm">
                      {approved[tIdx].role}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  setTIdx((i) => (i - 1 + approved.length) % approved.length)
                }
                className="absolute left-0 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <ChevronLeft size={20} color={C.dark} />
              </button>
              <button
                onClick={() => setTIdx((i) => (i + 1) % approved.length)}
                className="absolute right-0 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <ChevronRight size={20} color={C.dark} />
              </button>
              <div className="flex justify-center gap-2 mt-6">
                {approved.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTIdx(i)}
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{
                      background: i === tIdx ? C.orange : "#CBD5E1",
                      transform: i === tIdx ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: C.dark }}
      >
        <h2 className="text-3xl font-black text-white mb-4">
          Ready to Ship Smarter?
        </h2>
        <p className="text-blue-300 mb-8 max-w-xl mx-auto">
          Join thousands of business owners who trust EasyShip to protect their
          packages and grow their brands.
        </p>
        <button
          onClick={() => onNav("register")}
          className="font-bold px-10 py-4 rounded-xl text-white text-lg hover:opacity-90 transition"
          style={{ background: C.orange }}
        >
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0A1F4E" }}>
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="text-white font-black text-2xl mb-3">
                Easy<span style={{ color: C.orange }}>Ship</span>
              </div>
              <p className="text-blue-300 text-sm mb-5">
                Ship Smarter. Grow Faster.
              </p>
              <div className="flex gap-3 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black hover:opacity-80 transition"
                    style={s.style || { background: s.bg }}
                  >
                    {s.txt}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Company</div>
              {["About Us", "Careers", "Blog", "Press Kit"].map((l) => (
                <div
                  key={l}
                  className="text-blue-300 text-sm mb-2.5 hover:text-white cursor-pointer transition"
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Services</div>
              {[
                "Local Shipping",
                "International",
                "Fragile Goods",
                "Express Delivery",
              ].map((l) => (
                <div
                  key={l}
                  className="text-blue-300 text-sm mb-2.5 hover:text-white cursor-pointer transition"
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Contact</div>
              <div className="space-y-3">
                {[
                  [<Phone size={14} />, "+234 800 EASYSHIP"],
                  [<Mail size={14} />, "support@easyship.com"],
                  [<MapPin size={14} />, "12 Innovation Drive, VI, Lagos"],
                ].map(([icon, txt], i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-blue-300 text-sm"
                  >
                    {icon}
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-blue-400 text-sm">
              © 2026 EasyShip Ltd. All rights reserved.
            </p>
            <div className="flex gap-5 text-blue-400 text-xs">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (l) => (
                  <span
                    key={l}
                    className="hover:text-white cursor-pointer transition"
                  >
                    {l}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AUTH PAGE
══════════════════════════════════════════════════════════ */
function AuthPage({ mode, setMode, onLogin, onRegister, onBack }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    promo: false,
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = () => {
    setErr("");
    if (!f.email || !f.password)
      return setErr("Please fill in all required fields.");
    if (mode === "register" && !f.name)
      return setErr("Please enter your full name.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        if (!onLogin(f.email.trim(), f.password))
          setErr("Invalid email or password. Try the demo credentials below.");
      } else {
        if (
          !onRegister({
            name: f.name.trim(),
            email: f.email.trim(),
            password: f.password,
            promoEmails: f.promo,
          })
        )
          setErr("An account with this email already exists.");
      }
    }, 700);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{ background: `linear-gradient(135deg,${C.dark},${C.blue})` }}
    >
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-blue-300 text-sm hover:text-white transition"
      >
        ← Back to Home
      </button>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div
          className="px-8 pt-8 pb-6 text-center"
          style={{ background: `linear-gradient(135deg,${C.dark},${C.blue})` }}
        >
          <div className="text-white font-black text-3xl mb-1">
            Easy<span style={{ color: C.orange }}>Ship</span>
          </div>
          <p className="text-blue-300 text-sm">Ship Smarter. Grow Faster.</p>
        </div>
        <div className="p-8">
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: "#F0F4FF" }}
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setErr("");
                  setF({ name: "", email: "", password: "", promo: false });
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${
                  mode === m ? "text-white shadow" : "text-gray-400"
                }`}
                style={mode === m ? { background: C.blue } : {}}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {mode === "register" && (
              <input
                className={inp}
                placeholder="Full Name *"
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
              />
            )}
            <input
              className={inp}
              placeholder="Email address *"
              type="email"
              value={f.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <input
              className={inp}
              placeholder="Password *"
              type="password"
              value={f.password}
              onChange={(e) => set("password", e.target.value)}
            />
            {mode === "register" && (
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-blue-50 border border-blue-100">
                <input
                  type="checkbox"
                  checked={f.promo}
                  onChange={(e) => set("promo", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded"
                  style={{ accentColor: C.orange }}
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to receive <b>promotional emails</b> about EasyShip
                  offers, updates, and shipping tips.
                </span>
              </label>
            )}
            {err && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                {err}
              </div>
            )}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-black text-sm hover:opacity-90 transition"
              style={{ background: loading ? "#94A3B8" : C.orange }}
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Sign In to Dashboard"
                : "Create My Account"}
            </button>
          </div>
          <div
            className="mt-6 rounded-xl p-4 text-xs"
            style={{ background: "#F8FAFF", border: "1px solid #DBEAFE" }}
          >
            <div className="font-bold mb-2" style={{ color: C.dark }}>
              🔑 Demo Credentials
            </div>
            <div className="text-gray-500 space-y-1">
              <div>
                👤 <b>User:</b> user@easyship.com / user123
              </div>
              <div>
                🔐 <b>Admin:</b> admin@easyship.com / admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CUSTOMER DASHBOARD
══════════════════════════════════════════════════════════ */
function CustomerDashboard({ user, shipments, setShipments, onLogout }) {
  const [sec, setSec] = useState("overview");
  const [sideOpen, setSideOpen] = useState(false);
  const [payId, setPayId] = useState(null);
  const [card, setCard] = useState({ num: "", exp: "", cvv: "" });
  const [payDone, setPayDone] = useState(false);
  const [trackId, setTrackId] = useState(null);
  const [sf, setSf] = useState({
    name: user.name,
    email: user.email,
    subject: "",
    cat: "General Enquiry",
    msg: "",
  });
  const [sDone, setSDone] = useState(false);

  const mine = shipments.filter((s) => s.userId === user.id);
  const delivered = mine.filter((s) => s.stage === 5).length;
  const inTransit = mine.filter((s) => s.stage > 0 && s.stage < 5).length;
  const spent = mine.filter((s) => s.paid).reduce((a, s) => a + s.cost, 0);
  const paying = payId ? mine.find((s) => s.id === payId) : null;
  const tracked = trackId ? mine.find((s) => s.id === trackId) : null;

  const navItems = [
    { id: "overview", icon: <Home size={18} />, label: "Overview" },
    { id: "shipments", icon: <Package size={18} />, label: "My Shipments" },
    { id: "track", icon: <MapPin size={18} />, label: "Track Package" },
    { id: "payment", icon: <CreditCard size={18} />, label: "Payment" },
    { id: "support", icon: <Headphones size={18} />, label: "Support" },
    { id: "profile", icon: <User size={18} />, label: "My Profile" },
  ];

  const SideNav = () => (
    <div className="flex flex-col h-full p-4">
      <div className="text-white font-black text-xl mt-2 mb-8">
        Easy<span style={{ color: C.orange }}>Ship</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              setSec(n.id);
              setSideOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              sec === n.id
                ? "text-white"
                : "text-blue-300 hover:text-white hover:bg-blue-900"
            }`}
            style={sec === n.id ? { background: C.orange } : {}}
          >
            {n.icon} {n.label}
          </button>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-blue-300 hover:text-white text-sm px-4 py-3 rounded-xl hover:bg-blue-900 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  const confirmPay = () => {
    if (!card.num || !card.exp || !card.cvv) return;
    setShipments((p) =>
      p.map((s) => (s.id === payId ? { ...s, paid: true, stage: 1 } : s))
    );
    setPayDone(true);
    setTimeout(() => {
      setPayId(null);
      setPayDone(false);
      setCard({ num: "", exp: "", cvv: "" });
    }, 2500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className="hidden md:flex w-60 flex-col flex-shrink-0"
        style={{ background: C.dark }}
      >
        <SideNav />
      </div>
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background: C.dark }}>
            <SideNav />
          </div>
          <div
            className="flex-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSideOpen(false)}
          />
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSideOpen(true)}>
              <Menu size={22} color="#475569" />
            </button>
            <h1 className="font-bold text-lg" style={{ color: C.dark }}>
              {navItems.find((n) => n.id === sec)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black"
              style={{ background: C.blue }}
            >
              {user.name[0]}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700">
              {user.name}
            </span>
          </div>
        </div>
        <div className="p-6">
          {/* OVERVIEW */}
          {sec === "overview" && (
            <div>
              <p className="text-gray-400 text-sm mb-6">
                Welcome back,{" "}
                <b className="text-gray-700">{user.name.split(" ")[0]}</b> 👋
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Shipments",
                    val: mine.length,
                    icon: <Package size={20} />,
                    color: C.blue,
                  },
                  {
                    label: "Delivered",
                    val: delivered,
                    icon: <CheckCircle size={20} />,
                    color: "#16A34A",
                  },
                  {
                    label: "In Transit",
                    val: inTransit,
                    icon: <Truck size={20} />,
                    color: "#CA8A04",
                  },
                  {
                    label: "Total Spent",
                    val: fmt(spent),
                    icon: <DollarSign size={20} />,
                    color: C.orange,
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="bg-white rounded-2xl p-5 shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
                      style={{ background: c.color }}
                    >
                      {c.icon}
                    </div>
                    <div
                      className="text-2xl font-black"
                      style={{ color: C.dark }}
                    >
                      {c.val}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4" style={{ color: C.dark }}>
                  Recent Shipments
                </h3>
                {mine.length === 0 ? (
                  <div className="text-center py-10 text-gray-300">
                    <Package size={36} className="mx-auto mb-2" />
                    <p className="text-sm">No shipments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mine.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: "#EFF6FF" }}
                          >
                            <Package size={16} style={{ color: C.blue }} />
                          </div>
                          <div>
                            <div
                              className="text-sm font-bold font-mono"
                              style={{ color: C.dark }}
                            >
                              {s.id}
                            </div>
                            <div className="text-xs text-gray-400">
                              {s.origin} → {s.dest}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Pill stage={s.stage} approved={s.adminApproved} />
                          <div className="text-xs text-gray-400 mt-1">
                            {fmt(s.cost)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {mine.length > 0 && (
                  <button
                    onClick={() => setSec("shipments")}
                    className="mt-4 text-sm font-semibold hover:underline"
                    style={{ color: C.blue }}
                  >
                    View all shipments →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SHIPMENTS */}
          {sec === "shipments" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b">
                <h3 className="font-bold" style={{ color: C.dark }}>
                  All My Shipments
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {mine.length} shipment{mine.length !== 1 ? "s" : ""}
                </p>
              </div>
              {mine.length === 0 ? (
                <div className="text-center py-16 text-gray-300">
                  <Package size={48} className="mx-auto mb-3" />
                  <p>No shipments yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: "#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {[
                          "Tracking ID",
                          "Route",
                          "Items",
                          "Date",
                          "Cost",
                          "Status",
                          "",
                        ].map((h) => (
                          <th key={h} className="px-5 py-4 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {mine.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50 transition">
                          <td
                            className="px-5 py-4 font-mono font-bold text-xs"
                            style={{ color: C.blue }}
                          >
                            {s.id}
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-xs font-medium text-gray-700">
                              {s.origin}
                            </div>
                            <div className="text-xs text-gray-400">
                              → {s.dest}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500">
                            {s.items}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-400">
                            {s.date}
                          </td>
                          <td
                            className="px-5 py-4 font-bold text-xs"
                            style={{ color: C.dark }}
                          >
                            {fmt(s.cost)}
                          </td>
                          <td className="px-5 py-4">
                            <Pill stage={s.stage} approved={s.adminApproved} />
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => {
                                setTrackId(s.id);
                                setSec("track");
                              }}
                              className="text-xs px-3 py-1.5 rounded-lg text-white font-semibold hover:opacity-80"
                              style={{ background: C.blue }}
                            >
                              Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TRACK */}
          {sec === "track" && (
            <div className="max-w-xl">
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
                <h3 className="font-bold mb-3" style={{ color: C.dark }}>
                  Select a Shipment to Track
                </h3>
                {mine.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No shipments to track.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {mine.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setTrackId(s.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition"
                        style={{
                          background: trackId === s.id ? C.blue : "#F0F4FF",
                          color: trackId === s.id ? "white" : C.dark,
                        }}
                      >
                        {s.id}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {tracked && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b">
                    <div>
                      <span
                        className="font-mono font-black text-lg"
                        style={{ color: C.blue }}
                      >
                        {tracked.id}
                      </span>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {tracked.origin} → {tracked.dest}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {tracked.items} · {tracked.weight}
                      </p>
                    </div>
                    <Pill
                      stage={tracked.stage}
                      approved={tracked.adminApproved}
                    />
                  </div>
                  {!tracked.adminApproved ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                        <Clock size={24} color={C.orange} />
                      </div>
                      <h4 className="font-bold" style={{ color: C.dark }}>
                        Awaiting Admin Approval
                      </h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Tracking begins once your shipment is approved.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {STAGES.map((stage, i) => {
                        const done = i < tracked.stage,
                          active = i === tracked.stage;
                        return (
                          <div key={stage.label} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0"
                                style={{
                                  background: done
                                    ? "#16A34A"
                                    : active
                                    ? C.orange
                                    : "#F9FAFB",
                                  borderColor: done
                                    ? "#16A34A"
                                    : active
                                    ? C.orange
                                    : "#E5E7EB",
                                  color: done || active ? "white" : "#D1D5DB",
                                }}
                              >
                                {done ? "✓" : stage.icon}
                              </div>
                              {i < STAGES.length - 1 && (
                                <div
                                  className="w-0.5 h-8 my-1 flex-shrink-0"
                                  style={{
                                    background: done ? "#16A34A" : "#E5E7EB",
                                  }}
                                />
                              )}
                            </div>
                            <div className="pt-2 pb-6">
                              <div
                                className="font-semibold text-sm"
                                style={{
                                  color: done
                                    ? "#16A34A"
                                    : active
                                    ? C.orange
                                    : "#D1D5DB",
                                }}
                              >
                                {stage.label}
                              </div>
                              {done && (
                                <div className="text-xs text-gray-400 mt-0.5">
                                  Completed ✓
                                </div>
                              )}
                              {active && (
                                <div
                                  className="text-xs font-medium mt-0.5"
                                  style={{ color: C.orange }}
                                >
                                  ⟵ Current stage
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PAYMENT */}
          {sec === "payment" && (
            <div className="max-w-xl">
              {/* Modal */}
              {payId && !payDone && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h3
                      className="font-black text-xl mb-1"
                      style={{ color: C.dark }}
                    >
                      Complete Payment
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {paying?.id} · {paying?.origin} → {paying?.dest}
                    </p>
                    <div
                      className="rounded-xl px-4 py-3 mb-5 flex justify-between items-center"
                      style={{ background: "#EFF6FF" }}
                    >
                      <span className="text-sm text-gray-600">Amount due</span>
                      <span
                        className="text-2xl font-black"
                        style={{ color: C.dark }}
                      >
                        {fmt(paying?.cost || 0)}
                      </span>
                    </div>
                    <div className="space-y-4 mb-5">
                      <div>
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                          Card Number
                        </label>
                        <input
                          className={inp + " mt-1"}
                          placeholder="1234 5678 9012 3456"
                          value={card.num}
                          onChange={(e) =>
                            setCard((p) => ({ ...p, num: e.target.value }))
                          }
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Expiry
                          </label>
                          <input
                            className={inp + " mt-1"}
                            placeholder="MM/YY"
                            value={card.exp}
                            onChange={(e) =>
                              setCard((p) => ({ ...p, exp: e.target.value }))
                            }
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            CVV
                          </label>
                          <input
                            className={inp + " mt-1"}
                            placeholder="123"
                            type="password"
                            value={card.cvv}
                            onChange={(e) =>
                              setCard((p) => ({ ...p, cvv: e.target.value }))
                            }
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setPayId(null);
                          setCard({ num: "", exp: "", cvv: "" });
                        }}
                        className="flex-1 py-3 border rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmPay}
                        className="flex-1 py-3 rounded-xl text-white font-black text-sm hover:opacity-90 transition"
                        style={{ background: C.orange }}
                      >
                        Pay {fmt(paying?.cost || 0)}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {payDone && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={36} color="#16A34A" />
                    </div>
                    <h3 className="font-black text-2xl text-green-600">
                      Payment Successful!
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">
                      Your shipment is now in progress. Track it live.
                    </p>
                  </div>
                </div>
              )}

              <h3 className="font-bold mb-5" style={{ color: C.dark }}>
                Pending Payments
              </h3>
              {mine.filter((s) => !s.paid && s.adminApproved).length === 0 &&
                mine.filter((s) => !s.paid && !s.adminApproved).length ===
                  0 && (
                  <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
                    <CheckCircle
                      size={40}
                      color="#16A34A"
                      className="mx-auto mb-3"
                    />
                    <p className="font-bold text-gray-700">All paid up!</p>
                    <p className="text-gray-400 text-sm mt-1">
                      No pending payments at this time.
                    </p>
                  </div>
                )}
              {mine
                .filter((s) => !s.paid && s.adminApproved)
                .map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl p-5 shadow-sm mb-4 border-l-4"
                    style={{ borderLeftColor: C.orange }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span
                          className="font-mono font-bold"
                          style={{ color: C.blue }}
                        >
                          {s.id}
                        </span>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {s.origin} → {s.dest}
                        </p>
                        <p className="text-gray-400 text-xs">{s.items}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-2xl font-black"
                          style={{ color: C.dark }}
                        >
                          {fmt(s.cost)}
                        </div>
                        <button
                          onClick={() => setPayId(s.id)}
                          className="mt-2 px-5 py-2 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
                          style={{ background: C.orange }}
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {mine
                .filter((s) => !s.paid && !s.adminApproved)
                .map((s) => (
                  <div
                    key={s.id}
                    className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span
                          className="font-mono font-bold text-sm"
                          style={{ color: C.orange }}
                        >
                          {s.id}
                        </span>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {s.origin} → {s.dest}
                        </p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
                        ⏳ Awaiting Approval
                      </span>
                    </div>
                  </div>
                ))}
              {mine.filter((s) => s.paid).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">
                    Paid Shipments
                  </h4>
                  {mine
                    .filter((s) => s.paid)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-3 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-mono font-bold text-sm text-green-700">
                            {s.id}
                          </span>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {s.origin} → {s.dest}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-700">
                            {fmt(s.cost)}
                          </div>
                          <div className="text-xs text-green-500 mt-0.5">
                            ✓ Paid
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* SUPPORT */}
          {sec === "support" && (
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                  <h3
                    className="font-bold text-xl mb-1"
                    style={{ color: C.dark }}
                  >
                    Contact Support
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    We respond within 2 hours during working hours.
                  </p>
                  {sDone ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={30} color="#16A34A" />
                      </div>
                      <h4 className="font-black text-xl text-green-600">
                        Message Sent!
                      </h4>
                      <p className="text-gray-400 text-sm mt-2 mb-5">
                        Our team will respond within 2 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSDone(false);
                          setSf((p) => ({
                            ...p,
                            subject: "",
                            msg: "",
                            cat: "General Enquiry",
                          }));
                        }}
                        className="text-sm font-semibold underline"
                        style={{ color: C.blue }}
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Your Name
                          </label>
                          <input
                            className={inp + " mt-1"}
                            value={sf.name}
                            onChange={(e) =>
                              setSf((p) => ({ ...p, name: e.target.value }))
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                            Email
                          </label>
                          <input
                            className={inp + " mt-1"}
                            value={sf.email}
                            onChange={(e) =>
                              setSf((p) => ({ ...p, email: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                          Category
                        </label>
                        <select
                          className={inp + " mt-1"}
                          value={sf.cat}
                          onChange={(e) =>
                            setSf((p) => ({ ...p, cat: e.target.value }))
                          }
                        >
                          {[
                            "General Enquiry",
                            "Complaint",
                            "Tracking Issue",
                            "Payment Issue",
                            "Damaged Item",
                            "Other",
                          ].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                          Subject
                        </label>
                        <input
                          className={inp + " mt-1"}
                          placeholder="Brief description of your issue"
                          value={sf.subject}
                          onChange={(e) =>
                            setSf((p) => ({ ...p, subject: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                          Message
                        </label>
                        <textarea
                          className={inp + " mt-1 resize-none"}
                          rows={4}
                          placeholder="Describe your issue in detail…"
                          value={sf.msg}
                          onChange={(e) =>
                            setSf((p) => ({ ...p, msg: e.target.value }))
                          }
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (sf.subject && sf.msg) setSDone(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
                        style={{ background: C.orange }}
                      >
                        <Send size={16} /> Send Message
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Phone size={18} />,
                      title: "Phone",
                      val: "+234 800 EASYSHIP",
                      sub: "Mon–Fri, 8AM–8PM",
                    },
                    {
                      icon: <Mail size={18} />,
                      title: "Email",
                      val: "support@easyship.com",
                      sub: "We reply within 2 hours",
                    },
                    {
                      icon: <MessageSquare size={18} />,
                      title: "WhatsApp",
                      val: "+234 800 329 7447",
                      sub: "Quick chat support",
                    },
                    {
                      icon: <MapPin size={18} />,
                      title: "Office",
                      val: "12 Innovation Drive",
                      sub: "Victoria Island, Lagos",
                    },
                  ].map((c) => (
                    <div
                      key={c.title}
                      className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-start"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: C.blue }}
                      >
                        {c.icon}
                      </div>
                      <div>
                        <div
                          className="font-bold text-sm"
                          style={{ color: C.dark }}
                        >
                          {c.title}
                        </div>
                        <div className="text-gray-700 text-sm">{c.val}</div>
                        <div className="text-gray-400 text-xs">{c.sub}</div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div
                      className="font-bold text-sm mb-3"
                      style={{ color: C.dark }}
                    >
                      Working Hours
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      {[
                        ["Monday – Friday", "8AM – 8PM"],
                        ["Saturday", "9AM – 5PM"],
                        ["Sunday", "Closed"],
                      ].map(([d, h]) => (
                        <div key={d} className="flex justify-between">
                          <span>{d}</span>
                          <span
                            className={`font-semibold ${
                              h === "Closed" ? "text-red-400" : ""
                            }`}
                          >
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {sec === "profile" && (
            <div className="max-w-md">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black"
                    style={{ background: C.blue }}
                  >
                    {user.name[0]}
                  </div>
                  <div>
                    <h3
                      className="font-black text-xl"
                      style={{ color: C.dark }}
                    >
                      {user.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ background: C.blue }}
                      >
                        Customer
                      </span>
                      {user.promoEmails && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">
                          Promo Emails ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ["Full Name", user.name],
                    ["Email Address", user.email],
                    ["Phone", user.phone || "Not provided"],
                    ["Company / Business", user.company || "Individual"],
                    ["Member Since", user.joined],
                    [
                      "Promotional Emails",
                      user.promoEmails ? "Subscribed" : "Not subscribed",
                    ],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                        {l}
                      </label>
                      <div className="mt-1 px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-700 border border-gray-100">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════════════════════ */
function AdminDashboard({
  users,
  setUsers,
  testimonials,
  setTestimonials,
  shipments,
  setShipments,
  pricing,
  setPricing,
  onLogout,
}) {
  const [sec, setSec] = useState("overview");
  const [sideOpen, setSideOpen] = useState(false);
  const [viewUid, setViewUid] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [nu, setNu] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  });
  const [delConfirm, setDelConfirm] = useState(null);
  const [showTForm, setShowTForm] = useState(false);
  const [nt, setNt] = useState({ name: "", role: "", text: "", rating: 5 });
  const [editPrice, setEditPrice] = useState(null);

  const customers = users.filter((u) => u.role === "user");
  const pendingS = shipments.filter((s) => !s.adminApproved).length;
  const pendingT = testimonials.filter((t) => !t.approved).length;
  const viewedCust = viewUid ? users.find((u) => u.id === viewUid) : null;

  const navItems = [
    { id: "overview", icon: <BarChart3 size={18} />, label: "Overview" },
    { id: "customers", icon: <Users size={18} />, label: "Customers" },
    {
      id: "shipments",
      icon: <Package size={18} />,
      label: "Shipments",
      badge: pendingS,
    },
    { id: "pricing", icon: <DollarSign size={18} />, label: "Pricing" },
    {
      id: "testimonials",
      icon: <MessageSquare size={18} />,
      label: "Testimonials",
      badge: pendingT,
    },
  ];

  const doAddUser = () => {
    if (!nu.name || !nu.email || !nu.password) return;
    if (users.find((u) => u.email === nu.email)) return;
    setUsers((p) => [
      ...p,
      {
        ...nu,
        id: Date.now(),
        role: "user",
        joined: "Jul 2024",
        active: true,
        promoEmails: false,
      },
    ]);
    setNu({ name: "", email: "", password: "", phone: "", company: "" });
    setShowAddUser(false);
  };

  const doDelete = (id) => {
    setUsers((p) => p.filter((u) => u.id !== id));
    if (viewUid === id) setViewUid(null);
    setDelConfirm(null);
  };

  const SideNav = () => (
    <div className="flex flex-col h-full p-4">
      <div>
        <div className="text-white font-black text-xl mt-2">
          Easy<span style={{ color: C.orange }}>Ship</span>
        </div>
        <div className="text-xs mt-0.5 mb-6" style={{ color: "#60A5FA" }}>
          Admin Panel
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              setSec(n.id);
              setSideOpen(false);
              setViewUid(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              sec === n.id && !viewUid
                ? "text-white"
                : "text-blue-300 hover:text-white hover:bg-blue-900"
            }`}
            style={sec === n.id && !viewUid ? { background: C.orange } : {}}
          >
            {n.icon} {n.label}
            {n.badge > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-black">
                {n.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-blue-300 hover:text-white text-sm px-4 py-3 rounded-xl hover:bg-blue-900 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className="hidden md:flex w-60 flex-col flex-shrink-0"
        style={{ background: C.dark }}
      >
        <SideNav />
      </div>
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background: C.dark }}>
            <SideNav />
          </div>
          <div
            className="flex-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSideOpen(false)}
          />
        </div>
      )}

      {/* Delete modal */}
      {delConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={22} color="#DC2626" />
            </div>
            <h3 className="font-black text-lg mb-1" style={{ color: C.dark }}>
              Delete Customer?
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              This will permanently remove{" "}
              <b>{users.find((u) => u.id === delConfirm)?.name}</b>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDelConfirm(null)}
                className="flex-1 py-2.5 border rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => doDelete(delConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSideOpen(true)}>
              <Menu size={22} color="#475569" />
            </button>
            {viewedCust ? (
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => setViewUid(null)}
                  className="text-gray-400 hover:text-gray-700 transition"
                >
                  ← Customers
                </button>
                <span className="text-gray-300">/</span>
                <span className="font-bold" style={{ color: C.dark }}>
                  {viewedCust.name}
                </span>
              </div>
            ) : (
              <h1 className="font-bold text-lg" style={{ color: C.dark }}>
                {navItems.find((n) => n.id === sec)?.label}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            {pendingS + pendingT > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-600">
                  {pendingS + pendingT} pending
                </span>
              </div>
            )}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black"
              style={{ background: C.orange }}
            >
              A
            </div>
            <span className="hidden md:block text-sm font-semibold text-gray-700">
              Admin
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {sec === "overview" && !viewUid && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Total Customers",
                    val: customers.length,
                    icon: <Users size={20} />,
                    color: C.blue,
                  },
                  {
                    label: "Total Shipments",
                    val: shipments.length,
                    icon: <Package size={20} />,
                    color: "#16A34A",
                  },
                  {
                    label: "Live Testimonials",
                    val: testimonials.filter((t) => t.approved).length,
                    icon: <MessageSquare size={20} />,
                    color: C.dark,
                  },
                  {
                    label: "Pending Actions",
                    val: pendingS + pendingT,
                    icon: <Clock size={20} />,
                    color: C.orange,
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="bg-white rounded-2xl p-5 shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
                      style={{ background: c.color }}
                    >
                      {c.icon}
                    </div>
                    <div
                      className="text-3xl font-black"
                      style={{ color: C.dark }}
                    >
                      {c.val}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-5" style={{ color: C.dark }}>
                    Monthly Shipments
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FF" />
                      <XAxis
                        dataKey="m"
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Bar
                        dataKey="s"
                        fill={C.blue}
                        radius={[6, 6, 0, 0]}
                        name="Shipments"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-4" style={{ color: C.dark }}>
                    Recent Customers
                  </h3>
                  <div className="space-y-3">
                    {customers.slice(0, 5).map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSec("customers");
                          setViewUid(u.id);
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-blue-50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                            style={{ background: C.blue }}
                          >
                            {u.name[0]}
                          </div>
                          <div>
                            <div
                              className="text-sm font-semibold"
                              style={{ color: C.dark }}
                            >
                              {u.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {u.email}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            u.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS LIST */}
          {sec === "customers" && !viewUid && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-400 text-sm">
                  {customers.length} registered customers
                </p>
                <button
                  onClick={() => setShowAddUser((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
                  style={{ background: C.orange }}
                >
                  <Plus size={16} /> Add Customer
                </button>
              </div>
              {showAddUser && (
                <div
                  className="bg-white rounded-2xl p-6 shadow-sm mb-5 border-2"
                  style={{ borderColor: C.orange }}
                >
                  <h3 className="font-bold mb-4" style={{ color: C.dark }}>
                    New Customer Account
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <input
                      className={inpSm}
                      placeholder="Full Name *"
                      value={nu.name}
                      onChange={(e) =>
                        setNu((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                    <input
                      className={inpSm}
                      placeholder="Email *"
                      type="email"
                      value={nu.email}
                      onChange={(e) =>
                        setNu((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                    <input
                      className={inpSm}
                      placeholder="Password *"
                      type="password"
                      value={nu.password}
                      onChange={(e) =>
                        setNu((p) => ({ ...p, password: e.target.value }))
                      }
                    />
                    <input
                      className={inpSm}
                      placeholder="Phone"
                      value={nu.phone}
                      onChange={(e) =>
                        setNu((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                    <input
                      className={inpSm + " md:col-span-2"}
                      placeholder="Company / Business"
                      value={nu.company}
                      onChange={(e) =>
                        setNu((p) => ({ ...p, company: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddUser(false)}
                      className="px-4 py-2 text-sm border rounded-xl text-gray-500 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={doAddUser}
                      className="px-5 py-2 text-sm text-white rounded-xl font-bold hover:opacity-90 transition"
                      style={{ background: C.blue }}
                    >
                      Add Customer
                    </button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: "#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {[
                          "Customer",
                          "Email",
                          "Company",
                          "Joined",
                          "Shipments",
                          "Promo",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th key={h} className="px-5 py-4 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                                style={{ background: C.blue }}
                              >
                                {u.name[0]}
                              </div>
                              <span
                                className="font-semibold text-sm"
                                style={{ color: C.dark }}
                              >
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-xs">
                            {u.email}
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-xs">
                            {u.company || "—"}
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            {u.joined}
                          </td>
                          <td
                            className="px-5 py-4 font-bold text-center"
                            style={{ color: C.dark }}
                          >
                            {shipments.filter((s) => s.userId === u.id).length}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                u.promoEmails
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {u.promoEmails ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                u.active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {u.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setViewUid(u.id)}
                                title="View Profile"
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                              >
                                <Eye size={14} color={C.blue} />
                              </button>
                              <button
                                onClick={() =>
                                  setUsers((p) =>
                                    p.map((x) =>
                                      x.id === u.id
                                        ? { ...x, active: !x.active }
                                        : x
                                    )
                                  )
                                }
                                title={u.active ? "Deactivate" : "Activate"}
                                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                              >
                                <Check
                                  size={14}
                                  color={u.active ? "#DC2626" : "#16A34A"}
                                />
                              </button>
                              <button
                                onClick={() => setDelConfirm(u.id)}
                                title="Delete"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
                              >
                                <Trash2 size={14} color="#DC2626" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER PROFILE */}
          {sec === "customers" && viewUid && viewedCust && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-center pb-5 mb-5 border-b">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-3"
                    style={{ background: C.blue }}
                  >
                    {viewedCust.name[0]}
                  </div>
                  <h3 className="font-black text-xl" style={{ color: C.dark }}>
                    {viewedCust.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{viewedCust.email}</p>
                  <div className="flex justify-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        viewedCust.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {viewedCust.active ? "Active" : "Inactive"}
                    </span>
                    {viewedCust.promoEmails && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">
                        Promo ✓
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    ["Phone", viewedCust.phone || "—"],
                    ["Company", viewedCust.company || "Individual"],
                    ["Joined", viewedCust.joined],
                    ["Promo Emails", viewedCust.promoEmails ? "Yes" : "No"],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                        {l}
                      </label>
                      <div className="text-sm text-gray-700 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() =>
                      setUsers((p) =>
                        p.map((x) =>
                          x.id === viewedCust.id
                            ? { ...x, active: !x.active }
                            : x
                        )
                      )
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      viewedCust.active
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {viewedCust.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => setDelConfirm(viewedCust.id)}
                    className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    {
                      label: "Total Shipments",
                      val: shipments.filter((s) => s.userId === viewedCust.id)
                        .length,
                    },
                    {
                      label: "Delivered",
                      val: shipments.filter(
                        (s) => s.userId === viewedCust.id && s.stage === 5
                      ).length,
                    },
                    {
                      label: "Total Spent",
                      val: fmt(
                        shipments
                          .filter((s) => s.userId === viewedCust.id && s.paid)
                          .reduce((a, s) => a + s.cost, 0)
                      ),
                    },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="bg-white rounded-2xl p-4 shadow-sm text-center"
                    >
                      <div
                        className="text-2xl font-black"
                        style={{ color: C.dark }}
                      >
                        {c.val}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {c.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold mb-4" style={{ color: C.dark }}>
                    Shipment History
                  </h4>
                  {shipments.filter((s) => s.userId === viewedCust.id)
                    .length === 0 ? (
                    <p className="text-gray-400 text-sm">No shipments yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {shipments
                        .filter((s) => s.userId === viewedCust.id)
                        .map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                          >
                            <div>
                              <span
                                className="font-mono font-bold text-xs"
                                style={{ color: C.blue }}
                              >
                                {s.id}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {s.origin} → {s.dest}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className="font-semibold text-xs"
                                style={{ color: C.dark }}
                              >
                                {fmt(s.cost)}
                              </span>
                              <Pill
                                stage={s.stage}
                                approved={s.adminApproved}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SHIPMENTS (admin) */}
          {sec === "shipments" && !viewUid && (
            <div>
              {pendingS > 0 && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-sm font-semibold text-orange-700">
                    {pendingS} shipment{pendingS > 1 ? "s" : ""} awaiting your
                    approval
                  </span>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: "#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {[
                          "ID",
                          "Customer",
                          "Route",
                          "Cost",
                          "Stage",
                          "Paid",
                          "Status",
                          "Action",
                        ].map((h) => (
                          <th key={h} className="px-4 py-4 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {shipments.map((s) => {
                        const owner = users.find((u) => u.id === s.userId);
                        const isEd = editPrice?.id === s.id;
                        return (
                          <tr
                            key={s.id}
                            className={`hover:bg-gray-50 transition ${
                              !s.adminApproved ? "bg-orange-50" : ""
                            }`}
                          >
                            <td
                              className="px-4 py-3 font-mono font-bold text-xs"
                              style={{ color: C.blue }}
                            >
                              {s.id}
                            </td>
                            <td className="px-4 py-3 text-xs font-medium text-gray-700">
                              {owner?.name || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-gray-700">
                                {s.origin}
                              </div>
                              <div className="text-xs text-gray-400">
                                → {s.dest}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {isEd ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    className="w-24 px-2 py-1 border rounded-lg text-xs"
                                    value={editPrice.val}
                                    onChange={(e) =>
                                      setEditPrice((p) => ({
                                        ...p,
                                        val: e.target.value,
                                      }))
                                    }
                                  />
                                  <button
                                    onClick={() => {
                                      setShipments((p) =>
                                        p.map((x) =>
                                          x.id === s.id
                                            ? {
                                                ...x,
                                                cost:
                                                  parseInt(editPrice.val) ||
                                                  x.cost,
                                              }
                                            : x
                                        )
                                      );
                                      setEditPrice(null);
                                    }}
                                    className="p-1 bg-green-100 rounded-lg"
                                  >
                                    <Check size={11} color="#16A34A" />
                                  </button>
                                  <button
                                    onClick={() => setEditPrice(null)}
                                    className="p-1 bg-gray-100 rounded-lg text-xs text-gray-400"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditPrice({
                                      id: s.id,
                                      val: String(s.cost),
                                    })
                                  }
                                  className="flex items-center gap-1 group"
                                >
                                  <span
                                    className="font-bold text-xs"
                                    style={{ color: C.dark }}
                                  >
                                    {fmt(s.cost)}
                                  </span>
                                  <Pencil
                                    size={10}
                                    color="#94A3B8"
                                    className="opacity-0 group-hover:opacity-100 transition"
                                  />
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                                value={s.stage}
                                onChange={(e) =>
                                  setShipments((p) =>
                                    p.map((x) =>
                                      x.id === s.id
                                        ? {
                                            ...x,
                                            stage: parseInt(e.target.value),
                                          }
                                        : x
                                    )
                                  )
                                }
                              >
                                {STAGES.map((st, i) => (
                                  <option key={i} value={i}>
                                    {st.icon} {st.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  s.paid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {s.paid ? "Paid" : "Unpaid"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                  s.adminApproved
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-600"
                                }`}
                              >
                                {s.adminApproved ? "Approved" : "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {!s.adminApproved && (
                                <button
                                  onClick={() =>
                                    setShipments((p) =>
                                      p.map((x) =>
                                        x.id === s.id
                                          ? { ...x, adminApproved: true }
                                          : x
                                      )
                                    )
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition"
                                >
                                  <Check size={12} /> Approve
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRICING */}
          {sec === "pricing" && !viewUid && (
            <div>
              <p className="text-gray-400 text-sm mb-5">
                {pricing.length} shipping routes · click any price to edit
                inline
              </p>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: "#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {["From", "To", "Price (₦)", "Duration", "Action"].map(
                          (h) => (
                            <th key={h} className="px-6 py-4 font-semibold">
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pricing.map((p) => {
                        const eid = `p${p.id}`;
                        const isEd = editPrice?.id === eid;
                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td
                              className="px-6 py-4 font-semibold"
                              style={{ color: C.dark }}
                            >
                              {p.from}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{p.to}</td>
                            <td className="px-6 py-4">
                              {isEd ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    className="w-32 px-3 py-2 border rounded-lg text-sm"
                                    value={editPrice.val}
                                    onChange={(e) =>
                                      setEditPrice((v) => ({
                                        ...v,
                                        val: e.target.value,
                                      }))
                                    }
                                  />
                                  <button
                                    onClick={() => {
                                      setPricing((prev) =>
                                        prev.map((x) =>
                                          x.id === p.id
                                            ? {
                                                ...x,
                                                price:
                                                  parseInt(editPrice.val) ||
                                                  x.price,
                                              }
                                            : x
                                        )
                                      );
                                      setEditPrice(null);
                                    }}
                                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditPrice(null)}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span
                                  className="font-black text-lg"
                                  style={{ color: C.dark }}
                                >
                                  {fmt(p.price)}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {p.days}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() =>
                                  setEditPrice({
                                    id: eid,
                                    val: String(p.price),
                                  })
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                              >
                                <Pencil size={12} /> Edit Price
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          {sec === "testimonials" && !viewUid && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-400 text-sm">
                  {testimonials.length} total ·{" "}
                  {testimonials.filter((t) => t.approved).length} published ·{" "}
                  {pendingT} pending
                </p>
                <button
                  onClick={() => setShowTForm((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
                  style={{ background: C.orange }}
                >
                  <Plus size={16} /> Add Testimonial
                </button>
              </div>
              {showTForm && (
                <div
                  className="bg-white rounded-2xl p-6 shadow-sm mb-6 border-2"
                  style={{ borderColor: C.orange }}
                >
                  <h3 className="font-bold mb-4" style={{ color: C.dark }}>
                    Add New Testimonial
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      className={inpSm}
                      placeholder="Customer Name"
                      value={nt.name}
                      onChange={(e) =>
                        setNt((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                    <input
                      className={inpSm}
                      placeholder="Role / Company"
                      value={nt.role}
                      onChange={(e) =>
                        setNt((p) => ({ ...p, role: e.target.value }))
                      }
                    />
                  </div>
                  <textarea
                    className={inpSm + " resize-none mb-4"}
                    rows={3}
                    placeholder="Testimonial text…"
                    value={nt.text}
                    onChange={(e) =>
                      setNt((p) => ({ ...p, text: e.target.value }))
                    }
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500 mr-1">
                        Rating:
                      </span>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setNt((p) => ({ ...p, rating: n }))}
                        >
                          <Star
                            size={22}
                            color={n <= nt.rating ? "#F97316" : "#CBD5E1"}
                            fill={n <= nt.rating ? "#F97316" : "none"}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => setShowTForm(false)}
                        className="px-4 py-2 text-sm border rounded-xl text-gray-500 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (nt.name && nt.text) {
                            setTestimonials((p) => [
                              ...p,
                              {
                                ...nt,
                                id: Date.now(),
                                approved: false,
                                date: "Jul 2024",
                                avatar: nt.name[0],
                              },
                            ]);
                            setNt({ name: "", role: "", text: "", rating: 5 });
                            setShowTForm(false);
                          }
                        }}
                        className="px-5 py-2 text-sm text-white rounded-xl font-bold hover:opacity-90 transition"
                        style={{ background: C.blue }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border-l-4"
                    style={{
                      borderLeftColor: t.approved ? "#16A34A" : C.orange,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black"
                          style={{ background: C.blue }}
                        >
                          {t.avatar}
                        </div>
                        <div>
                          <div
                            className="font-bold text-sm"
                            style={{ color: C.dark }}
                          >
                            {t.name}
                          </div>
                          <div className="text-gray-400 text-xs">{t.role}</div>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          t.approved
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {t.approved ? "Published" : "Pending"}
                      </span>
                    </div>
                    <Stars n={t.rating} />
                    <p className="text-gray-600 text-sm italic my-3 leading-relaxed">
                      "{t.text}"
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setTestimonials((p) =>
                            p.map((x) =>
                              x.id === t.id
                                ? { ...x, approved: !x.approved }
                                : x
                            )
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          t.approved
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        <Check size={12} />{" "}
                        {t.approved ? "Unpublish" : "Approve & Publish"}
                      </button>
                      <button
                        onClick={() =>
                          setTestimonials((p) => p.filter((x) => x.id !== t.id))
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(SEED_USERS);
  const [testimonials, setTestimonials] = useState(SEED_TESTIMONIALS);
  const [shipments, setShipments] = useState(SEED_SHIPMENTS);
  const [pricing, setPricing] = useState(SEED_PRICING);

  const goAuth = (mode) => {
    setAuthMode(mode);
    setPage("auth");
  };

  const handleLogin = (email, password) => {
    const u = users.find(
      (x) => x.email === email && x.password === password && x.active !== false
    );
    if (u) {
      setCurrentUser(u);
      setPage(u.role === "admin" ? "admin" : "customer");
      return true;
    }
    return false;
  };

  const handleRegister = ({ name, email, password, promoEmails }) => {
    if (users.find((u) => u.email === email)) return false;
    const u = {
      id: Date.now(),
      name,
      email,
      password,
      role: "user",
      joined: "Jul 2024",
      active: true,
      phone: "",
      company: "",
      promoEmails,
    };
    setUsers((p) => [...p, u]);
    setCurrentUser(u);
    setPage("customer");
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("landing");
  };

  if (page === "landing")
    return <LandingPage onNav={goAuth} testimonials={testimonials} />;
  if (page === "auth")
    return (
      <AuthPage
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onBack={() => setPage("landing")}
      />
    );
  if (page === "customer")
    return (
      <CustomerDashboard
        user={currentUser}
        shipments={shipments}
        setShipments={setShipments}
        onLogout={handleLogout}
      />
    );
  if (page === "admin")
    return (
      <AdminDashboard
        users={users}
        setUsers={setUsers}
        testimonials={testimonials}
        setTestimonials={setTestimonials}
        shipments={shipments}
        setShipments={setShipments}
        pricing={pricing}
        setPricing={setPricing}
        onLogout={handleLogout}
      />
    );
  return null;
}
