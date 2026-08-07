// @ts-nocheck
import { useState } from "react";
import {
  Package, Globe, Shield, DollarSign, MapPin, Truck,
  CheckCircle, ChevronLeft, ChevronRight, ArrowRight,
  Menu, Play, Headphones, Phone, Mail,
} from "lucide-react";
import { C } from "../constants";
import { Stars } from "../components/Helpers";

export default function LandingPage({ onNav, testimonials }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const approved = testimonials.filter((t) => t.approved);

  const media = [
    { type:"image", label:"Expert Packing",           desc:"Fragile items handled with precision",     grad:"from-blue-900 to-blue-700",    icon:<Package size={36}/> },
    { type:"image", label:"Real-time GPS Tracking",   desc:"Know exactly where your package is",       grad:"from-orange-600 to-yellow-400",icon:<MapPin size={36}/> },
    { type:"video", label:"How We Pack Fragile Items",desc:"Watch our experts in action",              grad:"from-gray-900 to-gray-700",    icon:<Play size={36}/> },
    { type:"image", label:"Global Courier Network",   desc:"250+ couriers across 190+ countries",      grad:"from-blue-800 to-indigo-700",  icon:<Globe size={36}/> },
    { type:"video", label:"Customer Success Story",   desc:"How Amara scaled her brand with EasyShip", grad:"from-pink-900 to-red-700",     icon:<Play size={36}/> },
    { type:"image", label:"24/7 Support Team",        desc:"Always here when you need us most",        grad:"from-green-800 to-green-600",  icon:<Headphones size={36}/> },
  ];

  const socials = [
    { label:"WhatsApp",  href:"https://wa.me/2348003297447",    bg:"#25D366", txt:"W" },
    { label:"X",         href:"https://x.com/easyship",         bg:"#000000", txt:"𝕏" },
    { label:"Facebook",  href:"https://facebook.com/easyship",  bg:"#1877F2", txt:"f" },
    { label:"Instagram", href:"https://instagram.com/easyship", txt:"ig",
      style:{ background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" } },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 shadow-sm" style={{ background: C.dark }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-white font-black text-2xl">
            Easy<span style={{ color: C.orange }}>Ship</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-blue-200">
            {[["#features","Features"],["#how-it-works","How it Works"],["#media","Media"],["#testimonials","Testimonials"]].map(([h, l]) => (
              <a key={l} href={h} className="hover:text-white transition">{l}</a>
            ))}
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={() => onNav("login")} className="text-white text-sm px-4 py-2 rounded-lg border border-blue-400 hover:border-white transition">Login</button>
            <button onClick={() => onNav("register")} className="text-white text-sm px-4 py-2 rounded-lg font-bold hover:opacity-90 transition" style={{ background: C.orange }}>Get Started</button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMenuOpen((v) => !v)}><Menu size={22} /></button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 border-t border-blue-800" style={{ background: C.dark }}>
            {["Features","How it Works","Media","Testimonials"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="block text-blue-200 py-1 text-sm" onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => onNav("login")} className="flex-1 text-white text-sm py-2.5 rounded-lg border border-blue-400">Login</button>
              <button onClick={() => onNav("register")} className="flex-1 text-white text-sm py-2.5 rounded-lg font-bold" style={{ background: C.orange }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-24 pb-20 px-4" style={{ background: `linear-gradient(135deg,${C.dark} 0%,${C.blue} 100%)` }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block text-xs px-3 py-1 rounded-full mb-6 font-semibold" style={{ background:"rgba(249,115,22,0.2)", color:"#FDBA74" }}>
            🚀 Nigeria's #1 Smart Shipping Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ship Smarter.<br /><span style={{ color: C.orange }}>Grow Faster.</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">
            From local cross-city drop-offs to international border shipping — fully insured, real-time tracked, always on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={() => onNav("register")} className="text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center justify-center gap-2 hover:opacity-90 transition" style={{ background: C.orange }}>
              Start Shipping Free <ArrowRight size={20} />
            </button>
            <button onClick={() => onNav("login")} className="text-white font-semibold px-8 py-4 rounded-xl text-lg border border-blue-400 hover:border-white transition">
              Login to Dashboard
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[["10K+","Packages Shipped"],["250+","Courier Partners"],["98%","On-Time Rate"]].map(([n, l]) => (
              <div key={l} className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.08)" }}>
                <div className="text-2xl font-black" style={{ color: C.orange }}>{n}</div>
                <div className="text-blue-300 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>Why Choose EasyShip?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Built for business owners tired of broken packages, hidden fees, and zero accountability.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:<Shield size={26}/>,     title:"Damage Protection", desc:"We break it, we pay it. Every package insured up to 50% of goods value." },
              { icon:<MapPin size={26}/>,     title:"Live GPS Tracking",  desc:"Real-time updates at every stage — not a generic 'In Transit' message." },
              { icon:<DollarSign size={26}/>, title:"50% Cheaper",        desc:"Compare 250+ couriers and always get the best rate for your route." },
              { icon:<Globe size={26}/>,      title:"190+ Countries",     desc:"Automated customs handling and documentation for global shipments." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4" style={{ background: C.blue }}>{f.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: C.dark }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>How It Works</h2>
          <p className="text-gray-500 mb-14">Three simple steps to smarter shipping</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon:<Package size={32}/>,      n:"01", title:"Book Online",    desc:"Fill in your order details, choose your route, and confirm your booking in minutes." },
              { icon:<Truck size={32}/>,         n:"02", title:"We Handle It",   desc:"Schedule a pickup at your door or drop off at one of our 50+ partner locations." },
              { icon:<CheckCircle size={32}/>,   n:"03", title:"Track & Receive",desc:"Live tracking at every stage. Your recipient gets notified all the way through." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white" style={{ background: C.dark }}>{s.icon}</div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: C.orange }}>{s.n}</div>
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: C.dark }}>{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Gallery ── */}
      <section id="media" className="py-20 px-4" style={{ background:"#F0F4FF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>EasyShip in Action</h2>
            <p className="text-gray-500">See how we handle every package with care and precision</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {media.map((m, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden cursor-pointer group">
                <div className={`w-full h-56 bg-gradient-to-br ${m.grad} flex flex-col items-center justify-center text-white group-hover:opacity-90 transition`}>
                  {m.type === "video" ? (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition" style={{ background:"rgba(255,255,255,0.2)" }}>
                      <Play size={28} fill="white" color="white" />
                    </div>
                  ) : (
                    <div className="mb-4 opacity-80">{m.icon}</div>
                  )}
                  <div className="font-bold text-center px-6 text-lg">{m.label}</div>
                  <div className="text-sm mt-1 px-6 text-center" style={{ color:"rgba(255,255,255,0.75)" }}>{m.desc}</div>
                </div>
                {m.type === "video" && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">▶ VIDEO</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Carousel ── */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: C.dark }}>What Our Customers Say</h2>
            <p className="text-gray-500">Real results from real business owners</p>
          </div>
          {approved.length > 0 ? (
            <div className="relative px-12">
              <div className="rounded-3xl p-10 text-center shadow-xl" style={{ background:`linear-gradient(135deg,${C.dark},${C.blue})` }}>
                <div className="flex justify-center mb-4"><Stars n={approved[tIdx].rating} /></div>
                <p className="text-white text-lg md:text-xl italic leading-relaxed mb-8">"{approved[tIdx].text}"</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl" style={{ background: C.orange }}>
                    {approved[tIdx].avatar || approved[tIdx].name[0]}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold">{approved[tIdx].name}</div>
                    <div className="text-blue-300 text-sm">{approved[tIdx].role}</div>
                  </div>
                </div>
              </div>
              <button onClick={() => setTIdx((i) => (i - 1 + approved.length) % approved.length)}
                className="absolute left-0 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition"
                style={{ top:"50%", transform:"translateY(-50%)" }}>
                <ChevronLeft size={20} color={C.dark} />
              </button>
              <button onClick={() => setTIdx((i) => (i + 1) % approved.length)}
                className="absolute right-0 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition"
                style={{ top:"50%", transform:"translateY(-50%)" }}>
                <ChevronRight size={20} color={C.dark} />
              </button>
              <div className="flex justify-center gap-2 mt-6">
                {approved.map((_, i) => (
                  <button key={i} onClick={() => setTIdx(i)} className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{ background: i === tIdx ? C.orange : "#CBD5E1", transform: i === tIdx ? "scale(1.4)" : "scale(1)" }} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400">No testimonials yet.</p>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: C.dark }}>
        <h2 className="text-3xl font-black text-white mb-4">Ready to Ship Smarter?</h2>
        <p className="text-blue-300 mb-8 max-w-xl mx-auto">Join thousands of business owners who trust EasyShip to protect their packages and grow their brands.</p>
        <button onClick={() => onNav("register")} className="font-bold px-10 py-4 rounded-xl text-white text-lg hover:opacity-90 transition" style={{ background: C.orange }}>
          Create Free Account
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background:"#0A1F4E" }}>
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="text-white font-black text-2xl mb-3">Easy<span style={{ color: C.orange }}>Ship</span></div>
              <p className="text-blue-300 text-sm mb-5">Ship Smarter. Grow Faster.</p>
              <div className="flex gap-3 flex-wrap">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black hover:opacity-80 transition"
                    style={s.style || { background: s.bg }}>{s.txt}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Company</div>
              {["About Us","Careers","Blog","Press Kit"].map((l) => (
                <div key={l} className="text-blue-300 text-sm mb-2.5 hover:text-white cursor-pointer transition">{l}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Services</div>
              {["Local Shipping","National Delivery","International","Fragile Goods"].map((l) => (
                <div key={l} className="text-blue-300 text-sm mb-2.5 hover:text-white cursor-pointer transition">{l}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Contact</div>
              <div className="space-y-3">
                {[[<Phone size={14}/>,"+234 800 EASYSHIP"],[<Mail size={14}/>,"support@easyship.com"],[<MapPin size={14}/>,"12 Innovation Drive, VI, Lagos"]].map(([icon, txt], i) => (
                  <div key={i} className="flex items-center gap-2 text-blue-300 text-sm">{icon}<span>{txt}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-blue-400 text-sm">© 2026 EasyShip Ltd. All rights reserved.</p>
            <div className="flex gap-5 text-blue-400 text-xs">
              {["Privacy Policy","Terms of Service","Cookie Policy"].map((l) => (
                <span key={l} className="hover:text-white cursor-pointer transition">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
