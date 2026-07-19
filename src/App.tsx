// @ts-nocheck
import { useState, useEffect } from "react";
import {
  Package, Truck, Shield, Globe, Star, LogOut, User, Plus, Trash2,
  Check, BarChart3, Users, Clock, DollarSign, MapPin, Menu, Home,
  ArrowRight, MessageSquare, CheckCircle, ChevronRight, ChevronLeft,
  Pencil, Eye, CreditCard, Phone, Mail, Send, Play, Headphones, RefreshCw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, setDoc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";

/* ── Firebase Config ─────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyCAxnKDJAVAlt4fXGpNMDgDw2z8GUDmJzM",
  authDomain: "easyship-ng.firebaseapp.com",
  projectId: "easyship-ng",
  storageBucket: "easyship-ng.firebasestorage.app",
  messagingSenderId: "598999285681",
  appId: "1:598999285681:web:d914db08f6119816110790"
};
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

/* ── EmailJS & Paystack Keys ─────────────────────── */
const EJS_SVC = "service_wsa7ahk";
const EJS_TPL = "template_j1ticv6";
const EJS_KEY = "vN74FpavFC_oolry3";
const PS_KEY  = "pk_test_b1bbb3c39fb0e7b706dfc1e2aa3ee4fba8778679";

/* ── Brand & Stage Constants ─────────────────────── */
const C = { dark:"#0D2B6B", blue:"#1A4FA0", orange:"#F97316" };

const STAGES = [
  { label:"Booking Confirmed",  icon:"📋" },
  { label:"Package Picked Up",  icon:"📦" },
  { label:"In Transit",         icon:"✈️" },
  { label:"Customs Clearance",  icon:"🛃" },
  { label:"Out for Delivery",   icon:"🚚" },
  { label:"Delivered",          icon:"✅" },
];

const ORDER_TYPES = [
  { id:"local",         label:"Local",         desc:"Same city delivery",    icon:"🏙️",  basePrice:3500  },
  { id:"national",      label:"National",      desc:"Cross-state delivery",  icon:"🗺️",  basePrice:9000  },
  { id:"international", label:"International", desc:"Cross-border shipping", icon:"✈️",  basePrice:45000 },
];

const NG_CITIES = ["Lagos","Abuja","Port Harcourt","Kano","Ibadan","Enugu","Benin City","Kaduna","Jos","Warri","Aba","Onitsha","Uyo","Calabar","Akure"];
const INTL_DEST = ["London, UK","Houston, TX","Dubai, UAE","Toronto, CA","New York, US","Accra, GH","Nairobi, KE","Johannesburg, SA","Paris, FR","Berlin, DE","Amsterdam, NL","Madrid, ES"];

const INIT_PRICING = [
  { id:"1", from:"Lagos",  to:"London, UK",   price:45000,  days:"5–7 days"  },
  { id:"2", from:"Lagos",  to:"Houston, TX",  price:78500,  days:"7–10 days" },
  { id:"3", from:"Lagos",  to:"Accra, GH",    price:12000,  days:"2–3 days"  },
  { id:"4", from:"Lagos",  to:"Dubai, UAE",   price:55000,  days:"4–6 days"  },
  { id:"5", from:"Abuja",  to:"Toronto, CA",  price:65000,  days:"7–10 days" },
  { id:"6", from:"Lagos",  to:"New York, US", price:82000,  days:"7–10 days" },
];

const CHART_DATA = [
  {m:"Jan",s:12},{m:"Feb",s:18},{m:"Mar",s:24},{m:"Apr",s:20},{m:"May",s:32},{m:"Jun",s:28},
];

/* ── Helpers & Micro Components ──────────────────── */
const fmt = n => "₦" + Number(n).toLocaleString();
const PILL_S = ["bg-gray-100 text-gray-600","bg-blue-100 text-blue-600","bg-yellow-100 text-yellow-700","bg-purple-100 text-purple-700","bg-orange-100 text-orange-700","bg-green-100 text-green-700"];

const Pill = ({ stage, approved }) => {
  if (!approved) return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">Pending Approval</span>;
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${PILL_S[stage]||PILL_S[0]}`}>{STAGES[stage]?.label}</span>;
};

const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i=><Star key={i} size={14} color={i<=n?"#F97316":"#CBD5E1"} fill={i<=n?"#F97316":"none"}/>)}
  </div>
);

const inp   = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50";
const inpSm = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50";

const Spinner = ({ size=24, color="white" }) => (
  <div className="inline-block rounded-full border-2 border-t-transparent animate-spin"
    style={{ width:size, height:size, borderColor:`${color} transparent ${color} ${color}` }}/>
);

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background:C.dark }}>
    <div className="text-center">
      <div className="text-white font-black text-4xl mb-6">Easy<span style={{ color:C.orange }}>Ship</span></div>
      <Spinner size={36} color="#F97316"/>
      <p className="text-blue-300 text-sm mt-4">Loading your dashboard...</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════ */
function LandingPage({ onNav, testimonials }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const approved = testimonials.filter(t=>t.approved);

  const media = [
    { type:"image", label:"Expert Packing",          desc:"Fragile items handled with precision",    grad:"from-blue-900 to-blue-700",    icon:<Package size={36}/> },
    { type:"image", label:"Real-time GPS Tracking",  desc:"Know exactly where your package is",      grad:"from-orange-600 to-yellow-400",icon:<MapPin size={36}/> },
    { type:"video", label:"How We Pack Fragile Items",desc:"Watch our experts in action",            grad:"from-gray-900 to-gray-700",    icon:<Play size={36}/> },
    { type:"image", label:"Global Courier Network",  desc:"250+ couriers across 190+ countries",     grad:"from-blue-800 to-indigo-700",  icon:<Globe size={36}/> },
    { type:"video", label:"Customer Success Story",  desc:"How Amara scaled her brand with EasyShip",grad:"from-pink-900 to-red-700",     icon:<Play size={36}/> },
    { type:"image", label:"24/7 Support Team",       desc:"Always here when you need us most",       grad:"from-green-800 to-green-600",  icon:<Headphones size={36}/> },
  ];

  const socials = [
    { label:"WhatsApp", href:"https://wa.me/2348003297447", bg:"#25D366", txt:"W" },
    { label:"X",        href:"https://x.com/easyship",     bg:"#000000", txt:"𝕏" },
    { label:"Facebook", href:"https://facebook.com/easyship", bg:"#1877F2", txt:"f" },
    { label:"Instagram",href:"https://instagram.com/easyship", txt:"ig",
      style:{ background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" } },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 shadow-sm" style={{ background:C.dark }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-white font-black text-2xl">Easy<span style={{ color:C.orange }}>Ship</span></span>
          <div className="hidden md:flex items-center gap-8 text-sm text-blue-200">
            {[["#features","Features"],["#how-it-works","How it Works"],["#media","Media"],["#testimonials","Testimonials"]].map(([h,l])=>(
              <a key={l} href={h} className="hover:text-white transition">{l}</a>
            ))}
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={()=>onNav("login")} className="text-white text-sm px-4 py-2 rounded-lg border border-blue-400 hover:border-white transition">Login</button>
            <button onClick={()=>onNav("register")} className="text-white text-sm px-4 py-2 rounded-lg font-bold hover:opacity-90 transition" style={{ background:C.orange }}>Get Started</button>
          </div>
          <button className="md:hidden text-white" onClick={()=>setMenuOpen(v=>!v)}><Menu size={22}/></button>
        </div>
        {menuOpen&&(
          <div className="md:hidden px-4 pb-4 space-y-2 border-t border-blue-800" style={{ background:C.dark }}>
            {["Features","How it Works","Media","Testimonials"].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="block text-blue-200 py-1 text-sm" onClick={()=>setMenuOpen(false)}>{l}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={()=>onNav("login")} className="flex-1 text-white text-sm py-2.5 rounded-lg border border-blue-400">Login</button>
              <button onClick={()=>onNav("register")} className="flex-1 text-white text-sm py-2.5 rounded-lg font-bold" style={{ background:C.orange }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-4" style={{ background:`linear-gradient(135deg,${C.dark} 0%,${C.blue} 100%)` }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block text-xs px-3 py-1 rounded-full mb-6 font-semibold" style={{ background:"rgba(249,115,22,0.2)", color:"#FDBA74" }}>
            🚀 Nigeria's #1 Smart Shipping Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ship Smarter.<br/><span style={{ color:C.orange }}>Grow Faster.</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">
            From local cross-city drop-offs to international border shipping — fully insured, real-time tracked, always on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={()=>onNav("register")} className="text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center justify-center gap-2 hover:opacity-90 transition" style={{ background:C.orange }}>
              Start Shipping Free <ArrowRight size={20}/>
            </button>
            <button onClick={()=>onNav("login")} className="text-white font-semibold px-8 py-4 rounded-xl text-lg border border-blue-400 hover:border-white transition">
              Login to Dashboard
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[["10K+","Packages Shipped"],["250+","Courier Partners"],["98%","On-Time Rate"]].map(([n,l])=>(
              <div key={l} className="rounded-xl p-4" style={{ background:"rgba(255,255,255,0.08)" }}>
                <div className="text-2xl font-black" style={{ color:C.orange }}>{n}</div>
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
            <h2 className="text-3xl font-black mb-3" style={{ color:C.dark }}>Why Choose EasyShip?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Built for business owners tired of broken packages, hidden fees, and zero accountability.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:<Shield size={26}/>, title:"Damage Protection", desc:"We break it, we pay it. Every package insured up to 50% of goods value." },
              { icon:<MapPin size={26}/>, title:"Live GPS Tracking",  desc:"Real-time updates at every stage — not a generic 'In Transit' message." },
              { icon:<DollarSign size={26}/>, title:"50% Cheaper",   desc:"Compare 250+ couriers and always get the best rate for your route." },
              { icon:<Globe size={26}/>, title:"190+ Countries",      desc:"Automated customs handling and documentation for global shipments." },
            ].map(f=>(
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4" style={{ background:C.blue }}>{f.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color:C.dark }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-3" style={{ color:C.dark }}>How It Works</h2>
          <p className="text-gray-500 mb-14">Three simple steps to smarter shipping</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon:<Package size={32}/>, n:"01", title:"Book Online", desc:"Fill in your order details, choose your route, and confirm your booking in minutes." },
              { icon:<Truck size={32}/>, n:"02", title:"We Handle It", desc:"Schedule a pickup at your door or drop off at one of our 50+ partner locations." },
              { icon:<CheckCircle size={32}/>, n:"03", title:"Track & Receive", desc:"Live tracking at every stage. Your recipient gets notified all the way through." },
            ].map(s=>(
              <div key={s.n} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white" style={{ background:C.dark }}>{s.icon}</div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background:C.orange }}>{s.n}</div>
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color:C.dark }}>{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section id="media" className="py-20 px-4" style={{ background:"#F0F4FF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color:C.dark }}>EasyShip in Action</h2>
            <p className="text-gray-500">See how we handle every package with care and precision</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {media.map((m,i)=>(
              <div key={i} className="relative rounded-2xl overflow-hidden cursor-pointer group">
                <div className={`w-full h-56 bg-gradient-to-br ${m.grad} flex flex-col items-center justify-center text-white group-hover:opacity-90 transition`}>
                  {m.type==="video"?(
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition" style={{ background:"rgba(255,255,255,0.2)" }}>
                      <Play size={28} fill="white" color="white"/>
                    </div>
                  ):<div className="mb-4 opacity-80">{m.icon}</div>}
                  <div className="font-bold text-center px-6 text-lg">{m.label}</div>
                  <div className="text-sm mt-1 px-6 text-center" style={{ color:"rgba(255,255,255,0.75)" }}>{m.desc}</div>
                </div>
                {m.type==="video"&&<div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">▶ VIDEO</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color:C.dark }}>What Our Customers Say</h2>
            <p className="text-gray-500">Real results from real business owners</p>
          </div>
          {approved.length>0?(
            <div className="relative px-12">
              <div className="rounded-3xl p-10 text-center shadow-xl" style={{ background:`linear-gradient(135deg,${C.dark},${C.blue})` }}>
                <div className="flex justify-center mb-4"><Stars n={approved[tIdx].rating}/></div>
                <p className="text-white text-lg md:text-xl italic leading-relaxed mb-8">"{approved[tIdx].text}"</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl" style={{ background:C.orange }}>{approved[tIdx].avatar||approved[tIdx].name[0]}</div>
                  <div className="text-left">
                    <div className="text-white font-bold">{approved[tIdx].name}</div>
                    <div className="text-blue-300 text-sm">{approved[tIdx].role}</div>
                  </div>
                </div>
              </div>
              <button onClick={()=>setTIdx(i=>(i-1+approved.length)%approved.length)}
                className="absolute left-0 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition"
                style={{ top:"50%", transform:"translateY(-50%)" }}>
                <ChevronLeft size={20} color={C.dark}/>
              </button>
              <button onClick={()=>setTIdx(i=>(i+1)%approved.length)}
                className="absolute right-0 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition"
                style={{ top:"50%", transform:"translateY(-50%)" }}>
                <ChevronRight size={20} color={C.dark}/>
              </button>
              <div className="flex justify-center gap-2 mt-6">
                {approved.map((_,i)=>(
                  <button key={i} onClick={()=>setTIdx(i)} className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{ background:i===tIdx?C.orange:"#CBD5E1", transform:i===tIdx?"scale(1.4)":"scale(1)" }}/>
                ))}
              </div>
            </div>
          ):<p className="text-center text-gray-400">No testimonials yet.</p>}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center" style={{ background:C.dark }}>
        <h2 className="text-3xl font-black text-white mb-4">Ready to Ship Smarter?</h2>
        <p className="text-blue-300 mb-8 max-w-xl mx-auto">Join thousands of business owners who trust EasyShip to protect their packages and grow their brands.</p>
        <button onClick={()=>onNav("register")} className="font-bold px-10 py-4 rounded-xl text-white text-lg hover:opacity-90 transition" style={{ background:C.orange }}>
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background:"#0A1F4E" }}>
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="text-white font-black text-2xl mb-3">Easy<span style={{ color:C.orange }}>Ship</span></div>
              <p className="text-blue-300 text-sm mb-5">Ship Smarter. Grow Faster.</p>
              <div className="flex gap-3 flex-wrap">
                {socials.map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black hover:opacity-80 transition"
                    style={s.style||{ background:s.bg }}>{s.txt}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Company</div>
              {["About Us","Careers","Blog","Press Kit"].map(l=>(
                <div key={l} className="text-blue-300 text-sm mb-2.5 hover:text-white cursor-pointer transition">{l}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Services</div>
              {["Local Shipping","National Delivery","International","Fragile Goods"].map(l=>(
                <div key={l} className="text-blue-300 text-sm mb-2.5 hover:text-white cursor-pointer transition">{l}</div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Contact</div>
              <div className="space-y-3">
                {[[<Phone size={14}/>,"+234 800 EASYSHIP"],[<Mail size={14}/>,"support@easyship.com"],[<MapPin size={14}/>,"12 Innovation Drive, VI, Lagos"]].map(([icon,txt],i)=>(
                  <div key={i} className="flex items-center gap-2 text-blue-300 text-sm">{icon}<span>{txt}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-blue-400 text-sm">© 2026 EasyShip Ltd. All rights reserved.</p>
            <div className="flex gap-5 text-blue-400 text-xs">
              {["Privacy Policy","Terms of Service","Cookie Policy"].map(l=>(
                <span key={l} className="hover:text-white cursor-pointer transition">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════════════ */
function AuthPage({ mode, setMode, onLogin, onRegister, onBack }) {
  const [f, setF] = useState({ name:"", email:"", password:"", phone:"", company:"", promo:false });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const submit = async () => {
    setErr("");
    if (!f.email||!f.password) return setErr("Please fill in all required fields.");
    if (mode==="register"&&!f.name) return setErr("Please enter your full name.");
    setLoading(true);
    if (mode==="login") {
      const ok = await onLogin(f.email.trim(), f.password);
      if (!ok) { setErr("Invalid email or password. Please try again."); setLoading(false); }
    } else {
      const ok = await onRegister({ name:f.name.trim(), email:f.email.trim(), password:f.password, phone:f.phone, company:f.company, promoEmails:f.promo });
      if (!ok) { setErr("Account already exists or registration failed."); setLoading(false); }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" style={{ background:`linear-gradient(135deg,${C.dark},${C.blue})` }}>
      <button onClick={onBack} className="absolute top-6 left-6 text-blue-300 text-sm hover:text-white transition">← Back to Home</button>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center" style={{ background:`linear-gradient(135deg,${C.dark},${C.blue})` }}>
          <div className="text-white font-black text-3xl mb-1">Easy<span style={{ color:C.orange }}>Ship</span></div>
          <p className="text-blue-300 text-sm">Ship Smarter. Grow Faster.</p>
        </div>
        <div className="p-8">
          <div className="flex rounded-xl p-1 mb-6" style={{ background:"#F0F4FF" }}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{ setMode(m); setErr(""); setF({ name:"",email:"",password:"",phone:"",company:"",promo:false }); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${mode===m?"text-white shadow":"text-gray-400"}`}
                style={mode===m?{ background:C.blue }:{}}>
                {m==="login"?"Sign In":"Register"}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {mode==="register"&&<input className={inp} placeholder="Full Name *" value={f.name} onChange={e=>set("name",e.target.value)}/>}
            <input className={inp} placeholder="Email address *" type="email" value={f.email} onChange={e=>set("email",e.target.value)}/>
            <input className={inp} placeholder="Password *" type="password" value={f.password} onChange={e=>set("password",e.target.value)}/>
            {mode==="register"&&(
              <>
                <input className={inp} placeholder="Phone number" value={f.phone} onChange={e=>set("phone",e.target.value)}/>
                <input className={inp} placeholder="Company / Business name (optional)" value={f.company} onChange={e=>set("company",e.target.value)}/>
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <input type="checkbox" checked={f.promo} onChange={e=>set("promo",e.target.checked)} className="mt-0.5 w-4 h-4 rounded" style={{ accentColor:C.orange }}/>
                  <span className="text-sm text-gray-600 leading-relaxed">I agree to receive <b>promotional emails</b> about EasyShip offers, updates, and shipping tips.</span>
                </label>
              </>
            )}
            {err&&<div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">{err}</div>}
            <button onClick={submit} disabled={loading}
              className="w-full py-4 rounded-xl text-white font-black text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
              style={{ background:loading?"#94A3B8":C.orange }}>
              {loading?<><Spinner size={18}/> Please wait…</>:mode==="login"?"Sign In to Dashboard":"Create My Account"}
            </button>
          </div>
          <div className="mt-5 rounded-xl p-4 text-xs" style={{ background:"#F8FAFF", border:"1px solid #DBEAFE" }}>
            <div className="font-bold mb-1" style={{ color:C.dark }}>🔑 Test Login</div>
            <div className="text-gray-500">Register a new account to get started, or ask the admin to create one for you.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CUSTOMER DASHBOARD
═══════════════════════════════════════════════════ */
function CustomerDashboard({ firebaseUser, userProfile, onLogout }) {
  const [sec, setSec] = useState("overview");
  const [sideOpen, setSideOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [trackId, setTrackId] = useState(null);
  const [pricing] = useState(INIT_PRICING);

  // Book Order state
  const [orderType, setOrderType] = useState("local");
  const [origin, setOrigin] = useState("Lagos");
  const [destination, setDestination] = useState("");
  const [items, setItems] = useState("");
  const [weight, setWeight] = useState("");
  const [fragile, setFragile] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  // Support state
  const [sf, setSf] = useState({ name:userProfile?.name||"", email:firebaseUser?.email||"", subject:"", cat:"General Enquiry", msg:"" });
  const [sDone, setSDone] = useState(false);
  const [sSending, setSSending] = useState(false);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const q = query(collection(db, "orders"), where("userId","==", firebaseUser.uid));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d=>({ id:d.id, ...d.data() })));
    } catch(e) { console.error(e); }
    setLoadingOrders(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const calcPrice = () => {
    const ot = ORDER_TYPES.find(o=>o.id===orderType);
    if (orderType==="international") {
      const route = pricing.find(p=>p.from.toLowerCase()===origin.toLowerCase()&&p.to.toLowerCase()===destination.toLowerCase());
      return route?route.price:(ot?.basePrice||45000);
    }
    const w = parseFloat(weight)||1;
    return Math.round((ot?.basePrice||3500) * Math.max(1, w * 0.8));
  };

  const handleBookOrder = async () => {
    if (!origin||!destination||!items||!weight) return;
    setBooking(true);
    try {
      const price = calcPrice();
      const dateStr = new Date().toLocaleDateString("en-GB",{ day:"numeric", month:"short", year:"numeric" });
      await addDoc(collection(db,"orders"),{
        userId:       firebaseUser.uid,
        userName:     userProfile.name,
        userEmail:    firebaseUser.email,
        orderType,
        origin,
        destination,
        items,
        weight:       parseFloat(weight),
        fragile,
        notes:        orderNotes,
        cost:         price,
        paid:         false,
        adminApproved:false,
        stage:        0,
        date:         dateStr,
        createdAt:    new Date().toISOString(),
      });
      await emailjs.send(EJS_SVC, EJS_TPL, {
        from_name:  userProfile.name,
        from_email: firebaseUser.email,
        message:    `New ${orderType} order!\nFrom: ${origin}\nTo: ${destination}\nItems: ${items}\nWeight: ${weight}kg\nFragile: ${fragile?"Yes":"No"}\nEstimated Cost: ${fmt(price)}`,
      }, EJS_KEY);
      setBooked(true);
      fetchOrders();
      setItems(""); setWeight(""); setFragile(false); setOrderNotes(""); setDestination("");
      setTimeout(()=>setBooked(false), 4000);
    } catch(e) { console.error("Booking error:", e); }
    setBooking(false);
  };

  const handlePaystack = (order) => {
    if (!window.PaystackPop) { alert("Payment system loading, please try again in a moment."); return; }
    const handler = window.PaystackPop.setup({
      key:      PS_KEY,
      email:    firebaseUser.email,
      amount:   order.cost * 100,
      currency: "NGN",
      ref:      `EASY-${Date.now()}`,
      metadata: { orderId:order.id, customerName:userProfile.name },
      callback: async (response) => {
        try {
          await updateDoc(doc(db,"orders",order.id),{
            paid:true, stage:1, paymentRef:response.reference, paidAt:new Date().toISOString()
          });
          await emailjs.send(EJS_SVC, EJS_TPL,{
            from_name:  userProfile.name,
            from_email: firebaseUser.email,
            message:    `Payment confirmed!\nOrder: ${order.id}\nAmount: ${fmt(order.cost)}\nRef: ${response.reference}`,
          }, EJS_KEY);
          fetchOrders();
          alert("Payment successful! Your shipment is now being processed.");
        } catch(e){ console.error(e); }
      },
      onClose: ()=>{},
    });
    handler.openIframe();
  };

  const handleSupport = async () => {
    if (!sf.subject||!sf.msg) return;
    setSSending(true);
    try {
      await emailjs.send(EJS_SVC, EJS_TPL,{
        from_name:  sf.name,
        from_email: sf.email,
        message:    `SUPPORT REQUEST\nCategory: ${sf.cat}\nSubject: ${sf.subject}\n\n${sf.msg}`,
      }, EJS_KEY);
      setSDone(true);
    } catch(e){ console.error(e); }
    setSSending(false);
  };

  const tracked = trackId?orders.find(o=>o.id===trackId):null;
  const paid = orders.filter(o=>o.paid);
  const unpaidApproved = orders.filter(o=>!o.paid&&o.adminApproved);
  const pendingApproval = orders.filter(o=>!o.paid&&!o.adminApproved);

  const navItems = [
    { id:"overview",  icon:<Home size={18}/>,       label:"Overview" },
    { id:"book",      icon:<Plus size={18}/>,        label:"Book Shipment", badge: true },
    { id:"shipments", icon:<Package size={18}/>,    label:"My Orders" },
    { id:"track",     icon:<MapPin size={18}/>,     label:"Track Package" },
    { id:"payment",   icon:<CreditCard size={18}/>, label:"Payment" },
    { id:"support",   icon:<Headphones size={18}/>, label:"Support" },
    { id:"profile",   icon:<User size={18}/>,       label:"My Profile" },
  ];

  const SideNav = () => (
    <div className="flex flex-col h-full p-4">
      <div className="text-white font-black text-xl mt-2 mb-8">Easy<span style={{ color:C.orange }}>Ship</span></div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{ setSec(n.id); setSideOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${sec===n.id?"text-white":"text-blue-300 hover:text-white hover:bg-blue-900"}`}
            style={sec===n.id?{ background:C.orange }:{}}>
            {n.icon} {n.label}
            {n.badge&&<span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-white font-black" style={{ color:C.orange }}>NEW</span>}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="flex items-center gap-2 text-blue-300 hover:text-white text-sm px-4 py-3 rounded-xl hover:bg-blue-900 transition">
        <LogOut size={18}/> Logout
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex w-64 flex-col flex-shrink-0" style={{ background:C.dark }}><SideNav/></div>
      {sideOpen&&(
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background:C.dark }}><SideNav/></div>
          <div className="flex-1" style={{ background:"rgba(0,0,0,0.5)" }} onClick={()=>setSideOpen(false)}/>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={()=>setSideOpen(true)}><Menu size={22} color="#475569"/></button>
            <h1 className="font-bold text-lg" style={{ color:C.dark }}>{navItems.find(n=>n.id===sec)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ background:C.blue }}>{userProfile?.name?.[0]||"U"}</div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700">{userProfile?.name}</span>
          </div>
        </div>

        <div className="p-6">

          {/* ── OVERVIEW ── */}
          {sec==="overview"&&(
            <div>
              <p className="text-gray-400 text-sm mb-6">Welcome back, <b className="text-gray-700">{userProfile?.name?.split(" ")[0]}</b> 👋</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label:"Total Orders",  val:orders.length,    icon:<Package size={20}/>,    color:C.blue    },
                  { label:"Delivered",     val:orders.filter(o=>o.stage===5).length, icon:<CheckCircle size={20}/>, color:"#16A34A" },
                  { label:"In Transit",    val:orders.filter(o=>o.stage>0&&o.stage<5).length, icon:<Truck size={20}/>, color:"#CA8A04" },
                  { label:"Total Spent",   val:fmt(paid.reduce((a,o)=>a+o.cost,0)), icon:<DollarSign size={20}/>, color:C.orange },
                ].map(c=>(
                  <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background:c.color }}>{c.icon}</div>
                    <div className="text-2xl font-black" style={{ color:C.dark }}>{c.val}</div>
                    <div className="text-gray-400 text-xs mt-1">{c.label}</div>
                  </div>
                ))}
              </div>
              {/* Quick book CTA */}
              <div className="rounded-2xl p-6 mb-6 flex items-center justify-between" style={{ background:`linear-gradient(135deg,${C.dark},${C.blue})` }}>
                <div>
                  <h3 className="text-white font-black text-xl mb-1">Need to ship something?</h3>
                  <p className="text-blue-300 text-sm">Book a new shipment in under 2 minutes</p>
                </div>
                <button onClick={()=>setSec("book")} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white hover:opacity-90 transition" style={{ background:C.orange }}>
                  <Plus size={18}/> Book Now
                </button>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color:C.dark }}>Recent Orders</h3>
                  <button onClick={fetchOrders} className="text-gray-400 hover:text-gray-600"><RefreshCw size={16}/></button>
                </div>
                {loadingOrders?<div className="text-center py-8"><Spinner size={24} color={C.blue}/></div>
                :orders.length===0?<div className="text-center py-10 text-gray-300"><Package size={36} className="mx-auto mb-2"/><p className="text-sm">No orders yet — book your first shipment!</p></div>
                :<div className="space-y-3">
                  {orders.slice(0,3).map(o=>(
                    <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:"#EFF6FF" }}><Package size={16} style={{ color:C.blue }}/></div>
                        <div>
                          <div className="text-sm font-bold" style={{ color:C.dark }}>{o.origin} → {o.destination}</div>
                          <div className="text-xs text-gray-400">{o.orderType} · {o.date}</div>
                        </div>
                      </div>
                      <div className="text-right"><Pill stage={o.stage} approved={o.adminApproved}/><div className="text-xs text-gray-400 mt-1">{fmt(o.cost)}</div></div>
                    </div>
                  ))}
                </div>}
                {orders.length>0&&<button onClick={()=>setSec("shipments")} className="mt-4 text-sm font-semibold hover:underline" style={{ color:C.blue }}>View all orders →</button>}
              </div>
            </div>
          )}

          {/* ── BOOK SHIPMENT ── */}
          {sec==="book"&&(
            <div className="max-w-2xl">
              {booked&&(
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
                  <CheckCircle size={22} color="#16A34A"/>
                  <div>
                    <div className="font-bold text-green-700">Order Booked Successfully!</div>
                    <div className="text-green-600 text-sm">We've sent you a confirmation email. Your order is pending admin approval.</div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-xl mb-1" style={{ color:C.dark }}>Book a Shipment</h3>
                <p className="text-gray-400 text-sm mb-6">Fill in your shipment details and we'll handle the rest.</p>

                {/* Order Type */}
                <div className="mb-5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2 block">Order Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {ORDER_TYPES.map(ot=>(
                      <button key={ot.id} onClick={()=>{ setOrderType(ot.id); setDestination(""); }}
                        className="p-3 rounded-xl border-2 text-center transition"
                        style={{ borderColor:orderType===ot.id?C.orange:"#E5E7EB", background:orderType===ot.id?"#FFF7ED":"white" }}>
                        <div className="text-2xl mb-1">{ot.icon}</div>
                        <div className="text-xs font-bold" style={{ color:orderType===ot.id?C.orange:C.dark }}>{ot.label}</div>
                        <div className="text-xs text-gray-400">{ot.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Origin */}
                <div className="mb-4">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Pickup City (Origin)</label>
                  <select className={inp} value={origin} onChange={e=>setOrigin(e.target.value)}>
                    {NG_CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Destination */}
                <div className="mb-4">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">
                    {orderType==="international"?"International Destination":"Delivery City"}
                  </label>
                  <select className={inp} value={destination} onChange={e=>setDestination(e.target.value)}>
                    <option value="">Select destination...</option>
                    {(orderType==="international"?INTL_DEST:NG_CITIES).map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Items */}
                  <div className="col-span-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Items Description</label>
                    <input className={inp} placeholder="e.g. Skincare products, Electronics, Documents" value={items} onChange={e=>setItems(e.target.value)}/>
                  </div>
                  {/* Weight */}
                  <div>
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Weight (kg)</label>
                    <input className={inp} type="number" placeholder="e.g. 2.5" value={weight} onChange={e=>setWeight(e.target.value)} min="0.1" step="0.1"/>
                  </div>
                  {/* Fragile */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer mt-6">
                      <input type="checkbox" checked={fragile} onChange={e=>setFragile(e.target.checked)} className="w-5 h-5 rounded" style={{ accentColor:C.orange }}/>
                      <div>
                        <div className="text-sm font-semibold" style={{ color:C.dark }}>Fragile Items</div>
                        <div className="text-xs text-gray-400">Extra care packaging</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Special Instructions (optional)</label>
                  <textarea className={inp+" resize-none"} rows={2} placeholder="Any special handling instructions..." value={orderNotes} onChange={e=>setOrderNotes(e.target.value)}/>
                </div>

                {/* Price Preview */}
                {origin&&destination&&weight&&(
                  <div className="rounded-xl p-4 mb-5 flex items-center justify-between" style={{ background:"#F0F4FF" }}>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Estimated Price</div>
                      <div className="text-3xl font-black mt-1" style={{ color:C.dark }}>{fmt(calcPrice())}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{ORDER_TYPES.find(o=>o.id===orderType)?.desc} · {weight}kg</div>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                )}

                <button onClick={handleBookOrder} disabled={booking||!origin||!destination||!items||!weight}
                  className="w-full py-4 rounded-xl text-white font-black text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                  style={{ background:(!origin||!destination||!items||!weight)?"#94A3B8":C.orange }}>
                  {booking?<><Spinner size={18}/> Booking…</>:<><Package size={18}/> Confirm Booking</>}
                </button>
              </div>
            </div>
          )}

          {/* ── MY ORDERS ── */}
          {sec==="shipments"&&(
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b flex items-center justify-between">
                <div><h3 className="font-bold" style={{ color:C.dark }}>All My Orders</h3><p className="text-xs text-gray-400 mt-0.5">{orders.length} order{orders.length!==1?"s":""}</p></div>
                <button onClick={fetchOrders} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50"><RefreshCw size={16}/></button>
              </div>
              {loadingOrders?<div className="text-center py-16"><Spinner size={28} color={C.blue}/></div>
              :orders.length===0?<div className="text-center py-16 text-gray-300"><Package size={48} className="mx-auto mb-3"/><p>No orders yet</p><button onClick={()=>setSec("book")} className="mt-3 text-sm font-semibold px-4 py-2 rounded-xl text-white" style={{ background:C.orange }}>Book your first shipment</button></div>
              :<div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background:"#F8FAFF" }}>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                      {["Route","Type","Items","Date","Cost","Status",""].map(h=><th key={h} className="px-5 py-4 font-semibold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(o=>(
                      <tr key={o.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-4"><div className="text-xs font-medium text-gray-700">{o.origin}</div><div className="text-xs text-gray-400">→ {o.destination}</div></td>
                        <td className="px-5 py-4 text-xs text-gray-500 capitalize">{o.orderType}</td>
                        <td className="px-5 py-4 text-xs text-gray-500 max-w-xs">{o.items}</td>
                        <td className="px-5 py-4 text-xs text-gray-400">{o.date}</td>
                        <td className="px-5 py-4 font-bold text-xs" style={{ color:C.dark }}>{fmt(o.cost)}</td>
                        <td className="px-5 py-4"><Pill stage={o.stage} approved={o.adminApproved}/></td>
                        <td className="px-5 py-4"><button onClick={()=>{ setTrackId(o.id); setSec("track"); }} className="text-xs px-3 py-1.5 rounded-lg text-white font-semibold hover:opacity-80" style={{ background:C.blue }}>Track</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
            </div>
          )}

          {/* ── TRACK ── */}
          {sec==="track"&&(
            <div className="max-w-xl">
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
                <h3 className="font-bold mb-3" style={{ color:C.dark }}>Select an Order to Track</h3>
                {orders.length===0?<p className="text-gray-400 text-sm">No orders to track yet.</p>
                :<div className="flex flex-wrap gap-2">
                  {orders.map(o=>(
                    <button key={o.id} onClick={()=>setTrackId(o.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      style={{ background:trackId===o.id?C.blue:"#F0F4FF", color:trackId===o.id?"white":C.dark }}>
                      {o.origin} → {o.destination}
                    </button>
                  ))}
                </div>}
              </div>
              {tracked&&(
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b">
                    <div>
                      <div className="font-black text-lg" style={{ color:C.blue }}>{tracked.origin} → {tracked.destination}</div>
                      <p className="text-gray-500 text-sm mt-0.5 capitalize">{tracked.orderType} shipment · {tracked.items}</p>
                      <p className="text-gray-400 text-xs">{tracked.weight}kg · {tracked.date}</p>
                    </div>
                    <Pill stage={tracked.stage} approved={tracked.adminApproved}/>
                  </div>
                  {!tracked.adminApproved
                    ?<div className="text-center py-8">
                      <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3"><Clock size={24} color={C.orange}/></div>
                      <h4 className="font-bold" style={{ color:C.dark }}>Awaiting Admin Approval</h4>
                      <p className="text-gray-400 text-sm mt-1">Tracking begins once your order is approved.</p>
                    </div>
                    :<div>
                      {STAGES.map((stage,i)=>{
                        const done=i<tracked.stage, active=i===tracked.stage;
                        return (
                          <div key={stage.label} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0"
                                style={{ background:done?"#16A34A":active?C.orange:"#F9FAFB", borderColor:done?"#16A34A":active?C.orange:"#E5E7EB", color:done||active?"white":"#D1D5DB" }}>
                                {done?"✓":stage.icon}
                              </div>
                              {i<STAGES.length-1&&<div className="w-0.5 h-8 my-1" style={{ background:done?"#16A34A":"#E5E7EB" }}/>}
                            </div>
                            <div className="pt-2 pb-6">
                              <div className="font-semibold text-sm" style={{ color:done?"#16A34A":active?C.orange:"#D1D5DB" }}>{stage.label}</div>
                              {done&&<div className="text-xs text-gray-400 mt-0.5">Completed ✓</div>}
                              {active&&<div className="text-xs font-medium mt-0.5" style={{ color:C.orange }}>⟵ Current stage</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  }
                </div>
              )}
            </div>
          )}

          {/* ── PAYMENT ── */}
          {sec==="payment"&&(
            <div className="max-w-xl">
              <h3 className="font-bold mb-5" style={{ color:C.dark }}>Payments</h3>
              {unpaidApproved.length===0&&pendingApproval.length===0&&paid.length===0&&(
                <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
                  <CheckCircle size={40} color="#16A34A" className="mx-auto mb-3"/>
                  <p className="font-bold text-gray-700">All paid up!</p>
                  <p className="text-gray-400 text-sm mt-1">No pending payments.</p>
                </div>
              )}
              {unpaidApproved.map(o=>(
                <div key={o.id} className="bg-white rounded-2xl p-5 shadow-sm mb-4 border-l-4" style={{ borderLeftColor:C.orange }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm" style={{ color:C.dark }}>{o.origin} → {o.destination}</div>
                      <p className="text-gray-500 text-xs mt-0.5 capitalize">{o.orderType} · {o.items}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">✓ Approved — Ready to Pay</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black" style={{ color:C.dark }}>{fmt(o.cost)}</div>
                      <button onClick={()=>handlePaystack(o)} className="mt-2 px-5 py-2 rounded-xl text-white font-bold text-sm hover:opacity-90 transition" style={{ background:C.orange }}>
                        Pay with Paystack
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingApproval.map(o=>(
                <div key={o.id} className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-3">
                  <div className="flex justify-between items-center">
                    <div><div className="font-bold text-sm" style={{ color:C.orange }}>{o.origin} → {o.destination}</div><p className="text-gray-500 text-xs mt-0.5">{o.items}</p></div>
                    <div className="text-right"><div className="font-bold text-gray-700">{fmt(o.cost)}</div><span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">⏳ Awaiting Approval</span></div>
                  </div>
                </div>
              ))}
              {paid.length>0&&(
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Paid Orders</h4>
                  {paid.map(o=>(
                    <div key={o.id} className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-3 flex justify-between items-center">
                      <div><div className="font-bold text-sm text-green-700">{o.origin} → {o.destination}</div><p className="text-gray-500 text-xs mt-0.5">{o.items}</p></div>
                      <div className="text-right"><div className="font-bold text-green-700">{fmt(o.cost)}</div><div className="text-xs text-green-500 mt-0.5">✓ Paid</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SUPPORT ── */}
          {sec==="support"&&(
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-xl mb-1" style={{ color:C.dark }}>Contact Support</h3>
                  <p className="text-gray-400 text-sm mb-6">We respond within 2 hours during working hours.</p>
                  {sDone
                    ?<div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><CheckCircle size={30} color="#16A34A"/></div>
                      <h4 className="font-black text-xl text-green-600">Message Sent!</h4>
                      <p className="text-gray-400 text-sm mt-2 mb-5">Our team will respond within 2 hours.</p>
                      <button onClick={()=>{ setSDone(false); setSf(p=>({...p,subject:"",msg:"",cat:"General Enquiry"})); }} className="text-sm font-semibold underline" style={{ color:C.blue }}>Send another message</button>
                    </div>
                    :<div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Your Name</label><input className={inp+" mt-1"} value={sf.name} onChange={e=>setSf(p=>({...p,name:e.target.value}))}/></div>
                        <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</label><input className={inp+" mt-1"} value={sf.email} onChange={e=>setSf(p=>({...p,email:e.target.value}))}/></div>
                      </div>
                      <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Category</label>
                        <select className={inp+" mt-1"} value={sf.cat} onChange={e=>setSf(p=>({...p,cat:e.target.value}))}>
                          {["General Enquiry","Complaint","Tracking Issue","Payment Issue","Damaged Item","Other"].map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Subject</label><input className={inp+" mt-1"} placeholder="Brief description of your issue" value={sf.subject} onChange={e=>setSf(p=>({...p,subject:e.target.value}))}/></div>
                      <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Message</label><textarea className={inp+" mt-1 resize-none"} rows={4} placeholder="Describe your issue in detail…" value={sf.msg} onChange={e=>setSf(p=>({...p,msg:e.target.value}))}/></div>
                      <button onClick={handleSupport} disabled={sSending||!sf.subject||!sf.msg}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
                        style={{ background:sSending||!sf.subject||!sf.msg?"#94A3B8":C.orange }}>
                        {sSending?<><Spinner size={16}/> Sending…</>:<><Send size={16}/> Send Message</>}
                      </button>
                    </div>
                  }
                </div>
                <div className="space-y-4">
                  {[
                    { icon:<Phone size={18}/>,         title:"Phone",    val:"+234 800 EASYSHIP",    sub:"Mon–Fri, 8AM–8PM" },
                    { icon:<Mail size={18}/>,          title:"Email",    val:"support@easyship.com", sub:"We reply within 2 hours" },
                    { icon:<MessageSquare size={18}/>, title:"WhatsApp", val:"+234 800 329 7447",    sub:"Quick chat support" },
                    { icon:<MapPin size={18}/>,        title:"Office",   val:"12 Innovation Drive",  sub:"Victoria Island, Lagos" },
                  ].map(c=>(
                    <div key={c.title} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background:C.blue }}>{c.icon}</div>
                      <div><div className="font-bold text-sm" style={{ color:C.dark }}>{c.title}</div><div className="text-gray-700 text-sm">{c.val}</div><div className="text-gray-400 text-xs">{c.sub}</div></div>
                    </div>
                  ))}
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="font-bold text-sm mb-3" style={{ color:C.dark }}>Working Hours</div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      {[["Monday – Friday","8AM – 8PM"],["Saturday","9AM – 5PM"],["Sunday","Closed"]].map(([d,h])=>(
                        <div key={d} className="flex justify-between"><span>{d}</span><span className={`font-semibold ${h==="Closed"?"text-red-400":""}`}>{h}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {sec==="profile"&&(
            <div className="max-w-md">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black" style={{ background:C.blue }}>{userProfile?.name?.[0]||"U"}</div>
                  <div>
                    <h3 className="font-black text-xl" style={{ color:C.dark }}>{userProfile?.name}</h3>
                    <p className="text-gray-400 text-sm">{firebaseUser?.email}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background:C.blue }}>Customer</span>
                      {userProfile?.promoEmails&&<span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">Promo Emails ✓</span>}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ["Full Name", userProfile?.name],
                    ["Email Address", firebaseUser?.email],
                    ["Phone", userProfile?.phone||"Not provided"],
                    ["Company / Business", userProfile?.company||"Individual"],
                    ["Member Since", userProfile?.joined],
                    ["Promotional Emails", userProfile?.promoEmails?"Subscribed":"Not subscribed"],
                  ].map(([l,v])=>(
                    <div key={l}>
                      <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{l}</label>
                      <div className="mt-1 px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-700 border border-gray-100">{v||"—"}</div>
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

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════ */
function AdminDashboard({ onLogout }) {
  const [sec, setSec] = useState("overview");
  const [sideOpen, setSideOpen] = useState(false);
  const [viewUid, setViewUid] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pricing, setPricing] = useState(INIT_PRICING);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showTForm, setShowTForm] = useState(false);
  const [delConfirm, setDelConfirm] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [nu, setNu] = useState({ name:"", email:"", password:"", phone:"", company:"" });
  const [nt, setNt] = useState({ name:"", role:"", text:"", rating:5 });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uSnap, oSnap, tSnap] = await Promise.all([
        getDocs(collection(db,"users")),
        getDocs(collection(db,"orders")),
        getDocs(collection(db,"testimonials")),
      ]);
      setUsers(uSnap.docs.map(d=>({ id:d.id, ...d.data() })));
      setOrders(oSnap.docs.map(d=>({ id:d.id, ...d.data() })));
      setTestimonials(tSnap.docs.map(d=>({ id:d.id, ...d.data() })));
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  useEffect(()=>{ fetchAll(); },[]);

  const customers = users.filter(u=>u.role!=="admin");
  const pendingS = orders.filter(o=>!o.adminApproved).length;
  const pendingT = testimonials.filter(t=>!t.approved).length;
  const viewedCust = viewUid?users.find(u=>u.id===viewUid):null;

  const approveOrder = async (id) => {
    await updateDoc(doc(db,"orders",id),{ adminApproved:true });
    setOrders(p=>p.map(o=>o.id===id?{...o,adminApproved:true}:o));
  };

  const updateOrderStage = async (id, stage) => {
    await updateDoc(doc(db,"orders",id),{ stage:parseInt(stage) });
    setOrders(p=>p.map(o=>o.id===id?{...o,stage:parseInt(stage)}:o));
  };

  const updateOrderCost = async (id, cost) => {
    await updateDoc(doc(db,"orders",id),{ cost:parseInt(cost) });
    setOrders(p=>p.map(o=>o.id===id?{...o,cost:parseInt(cost)}:o));
    setEditPrice(null);
  };

  const doDeleteUser = async (id) => {
    await deleteDoc(doc(db,"users",id));
    setUsers(p=>p.filter(u=>u.id!==id));
    if (viewUid===id) setViewUid(null);
    setDelConfirm(null);
  };

  const toggleUserActive = async (id, current) => {
    await updateDoc(doc(db,"users",id),{ active:!current });
    setUsers(p=>p.map(u=>u.id===id?{...u,active:!current}:u));
  };

  const addTestimonial = async () => {
    if (!nt.name||!nt.text) return;
    const data = { ...nt, approved:false, date:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}), avatar:nt.name[0], createdAt:new Date().toISOString() };
    const ref = await addDoc(collection(db,"testimonials"), data);
    setTestimonials(p=>[...p,{ id:ref.id, ...data }]);
    setNt({ name:"",role:"",text:"",rating:5 }); setShowTForm(false);
  };

  const toggleTestimonial = async (id, current) => {
    await updateDoc(doc(db,"testimonials",id),{ approved:!current });
    setTestimonials(p=>p.map(t=>t.id===id?{...t,approved:!current}:t));
  };

  const deleteTestimonial = async (id) => {
    await deleteDoc(doc(db,"testimonials",id));
    setTestimonials(p=>p.filter(t=>t.id!==id));
  };

  const addUser = async () => {
    if (!nu.name||!nu.email||!nu.password) return;
    try {
      const { createUserWithEmailAndPassword: create } = await import("firebase/auth");
      const cred = await create(auth, nu.email, nu.password);
      const data = { name:nu.name, email:nu.email, phone:nu.phone||"", company:nu.company||"", role:"user", joined:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}), active:true, promoEmails:false };
      await setDoc(doc(db,"users",cred.user.uid), data);
      setUsers(p=>[...p,{ id:cred.user.uid, ...data }]);
      setNu({ name:"",email:"",password:"",phone:"",company:"" }); setShowAddUser(false);
    } catch(e){ console.error(e); alert("Error creating user: "+e.message); }
  };

  const navItems = [
    { id:"overview",     icon:<BarChart3 size={18}/>,     label:"Overview" },
    { id:"customers",    icon:<Users size={18}/>,         label:"Customers" },
    { id:"orders",       icon:<Package size={18}/>,       label:"Orders",        badge:pendingS },
    { id:"pricing",      icon:<DollarSign size={18}/>,    label:"Pricing" },
    { id:"testimonials", icon:<MessageSquare size={18}/>, label:"Testimonials",  badge:pendingT },
  ];

  const SideNav = () => (
    <div className="flex flex-col h-full p-4">
      <div>
        <div className="text-white font-black text-xl mt-2">Easy<span style={{ color:C.orange }}>Ship</span></div>
        <div className="text-xs mt-0.5 mb-6" style={{ color:"#60A5FA" }}>Admin Panel</div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{ setSec(n.id); setSideOpen(false); setViewUid(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${sec===n.id&&!viewUid?"text-white":"text-blue-300 hover:text-white hover:bg-blue-900"}`}
            style={sec===n.id&&!viewUid?{ background:C.orange }:{}}>
            {n.icon} {n.label}
            {n.badge>0&&<span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-black">{n.badge}</span>}
          </button>
        ))}
      </nav>
      <button onClick={fetchAll} className="flex items-center gap-2 text-blue-300 hover:text-white text-xs px-4 py-2 rounded-xl hover:bg-blue-900 transition mb-2">
        <RefreshCw size={14}/> Refresh Data
      </button>
      <button onClick={onLogout} className="flex items-center gap-2 text-blue-300 hover:text-white text-sm px-4 py-3 rounded-xl hover:bg-blue-900 transition">
        <LogOut size={18}/> Logout
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex h-screen" style={{ background:C.dark }}>
      <div className="hidden md:flex w-64 flex-col flex-shrink-0" style={{ background:C.dark }}><SideNav/></div>
      <div className="flex-1 flex items-center justify-center"><Spinner size={36} color={C.orange}/></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex w-64 flex-col flex-shrink-0" style={{ background:C.dark }}><SideNav/></div>
      {sideOpen&&(
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background:C.dark }}><SideNav/></div>
          <div className="flex-1" style={{ background:"rgba(0,0,0,0.5)" }} onClick={()=>setSideOpen(false)}/>
        </div>
      )}

      {/* Delete Modal */}
      {delConfirm&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3"><Trash2 size={22} color="#DC2626"/></div>
            <h3 className="font-black text-lg mb-1" style={{ color:C.dark }}>Delete Customer?</h3>
            <p className="text-gray-400 text-sm mb-5">This will permanently remove <b>{users.find(u=>u.id===delConfirm)?.name}</b>.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDelConfirm(null)} className="flex-1 py-2.5 border rounded-xl text-sm font-semibold text-gray-500">Cancel</button>
              <button onClick={()=>doDeleteUser(delConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={()=>setSideOpen(true)}><Menu size={22} color="#475569"/></button>
            {viewedCust
              ?<div className="flex items-center gap-2 text-sm">
                <button onClick={()=>setViewUid(null)} className="text-gray-400 hover:text-gray-700">← Customers</button>
                <span className="text-gray-300">/</span>
                <span className="font-bold" style={{ color:C.dark }}>{viewedCust.name}</span>
              </div>
              :<h1 className="font-bold text-lg" style={{ color:C.dark }}>{navItems.find(n=>n.id===sec)?.label}</h1>
            }
          </div>
          <div className="flex items-center gap-3">
            {(pendingS+pendingT)>0&&(
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:"#FFF7ED", border:"1px solid #FED7AA" }}>
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"/>
                <span className="text-xs font-bold text-orange-600">{pendingS+pendingT} pending</span>
              </div>
            )}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ background:C.orange }}>A</div>
          </div>
        </div>

        <div className="p-6">

          {/* OVERVIEW */}
          {sec==="overview"&&!viewUid&&(
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label:"Customers",       val:customers.length,                          icon:<Users size={20}/>,        color:C.blue    },
                  { label:"Total Orders",    val:orders.length,                             icon:<Package size={20}/>,      color:"#16A34A" },
                  { label:"Live Reviews",    val:testimonials.filter(t=>t.approved).length, icon:<MessageSquare size={20}/>, color:C.dark   },
                  { label:"Pending Actions", val:pendingS+pendingT,                         icon:<Clock size={20}/>,        color:C.orange  },
                ].map(c=>(
                  <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background:c.color }}>{c.icon}</div>
                    <div className="text-3xl font-black" style={{ color:C.dark }}>{c.val}</div>
                    <div className="text-gray-400 text-sm mt-1">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-5" style={{ color:C.dark }}>Monthly Overview</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FF"/>
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{ borderRadius:12, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}/>
                      <Bar dataKey="s" fill={C.blue} radius={[6,6,0,0]} name="Shipments"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-4" style={{ color:C.dark }}>Recent Orders</h3>
                  {orders.length===0?<p className="text-gray-400 text-sm">No orders yet.</p>
                  :<div className="space-y-3">
                    {orders.slice(0,5).map(o=>(
                      <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div>
                          <div className="text-sm font-semibold" style={{ color:C.dark }}>{o.origin} → {o.destination}</div>
                          <div className="text-xs text-gray-400">{o.userName} · {o.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm" style={{ color:C.dark }}>{fmt(o.cost)}</div>
                          <Pill stage={o.stage} approved={o.adminApproved}/>
                        </div>
                      </div>
                    ))}
                  </div>}
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS LIST */}
          {sec==="customers"&&!viewUid&&(
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-400 text-sm">{customers.length} registered customers</p>
                <button onClick={()=>setShowAddUser(v=>!v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition" style={{ background:C.orange }}>
                  <Plus size={16}/> Add Customer
                </button>
              </div>
              {showAddUser&&(
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-5 border-2" style={{ borderColor:C.orange }}>
                  <h3 className="font-bold mb-4" style={{ color:C.dark }}>New Customer Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <input className={inpSm} placeholder="Full Name *" value={nu.name} onChange={e=>setNu(p=>({...p,name:e.target.value}))}/>
                    <input className={inpSm} placeholder="Email *" type="email" value={nu.email} onChange={e=>setNu(p=>({...p,email:e.target.value}))}/>
                    <input className={inpSm} placeholder="Password *" type="password" value={nu.password} onChange={e=>setNu(p=>({...p,password:e.target.value}))}/>
                    <input className={inpSm} placeholder="Phone" value={nu.phone} onChange={e=>setNu(p=>({...p,phone:e.target.value}))}/>
                    <input className={inpSm+" md:col-span-2"} placeholder="Company / Business" value={nu.company} onChange={e=>setNu(p=>({...p,company:e.target.value}))}/>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={()=>setShowAddUser(false)} className="px-4 py-2 text-sm border rounded-xl text-gray-500">Cancel</button>
                    <button onClick={addUser} className="px-5 py-2 text-sm text-white rounded-xl font-bold" style={{ background:C.blue }}>Create Account</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background:"#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {["Customer","Email","Company","Joined","Orders","Promo","Status","Actions"].map(h=><th key={h} className="px-5 py-4 font-semibold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.map(u=>(
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background:C.blue }}>{u.name?.[0]}</div><span className="font-semibold text-sm" style={{ color:C.dark }}>{u.name}</span></div></td>
                          <td className="px-5 py-4 text-gray-500 text-xs">{u.email}</td>
                          <td className="px-5 py-4 text-gray-500 text-xs">{u.company||"—"}</td>
                          <td className="px-5 py-4 text-gray-400 text-xs">{u.joined}</td>
                          <td className="px-5 py-4 font-bold text-center" style={{ color:C.dark }}>{orders.filter(o=>o.userId===u.id).length}</td>
                          <td className="px-5 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.promoEmails?"bg-orange-100 text-orange-600":"bg-gray-100 text-gray-400"}`}>{u.promoEmails?"Yes":"No"}</span></td>
                          <td className="px-5 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.active!==false?"bg-green-100 text-green-700":"bg-gray-100 text-gray-400"}`}>{u.active!==false?"Active":"Inactive"}</span></td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              <button onClick={()=>setViewUid(u.id)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100"><Eye size={14} color={C.blue}/></button>
                              <button onClick={()=>toggleUserActive(u.id, u.active!==false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"><Check size={14} color={u.active!==false?"#DC2626":"#16A34A"}/></button>
                              <button onClick={()=>setDelConfirm(u.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100"><Trash2 size={14} color="#DC2626"/></button>
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
          {sec==="customers"&&viewUid&&viewedCust&&(
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-center pb-5 mb-5 border-b">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-3" style={{ background:C.blue }}>{viewedCust.name?.[0]}</div>
                  <h3 className="font-black text-xl" style={{ color:C.dark }}>{viewedCust.name}</h3>
                  <p className="text-gray-400 text-sm">{viewedCust.email}</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${viewedCust.active!==false?"bg-green-100 text-green-700":"bg-gray-100 text-gray-400"}`}>{viewedCust.active!==false?"Active":"Inactive"}</span>
                    {viewedCust.promoEmails&&<span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">Promo ✓</span>}
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {[["Phone",viewedCust.phone||"—"],["Company",viewedCust.company||"Individual"],["Joined",viewedCust.joined]].map(([l,v])=>(
                    <div key={l}><label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{l}</label><div className="text-sm text-gray-700 mt-0.5">{v}</div></div>
                  ))}
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={()=>toggleUserActive(viewedCust.id, viewedCust.active!==false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${viewedCust.active!==false?"bg-red-100 text-red-600":"bg-green-100 text-green-700"}`}>
                    {viewedCust.active!==false?"Deactivate":"Activate"}
                  </button>
                  <button onClick={()=>setDelConfirm(viewedCust.id)} className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold">Delete</button>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label:"Total Orders", val:orders.filter(o=>o.userId===viewedCust.id).length },
                    { label:"Delivered",    val:orders.filter(o=>o.userId===viewedCust.id&&o.stage===5).length },
                    { label:"Total Spent",  val:fmt(orders.filter(o=>o.userId===viewedCust.id&&o.paid).reduce((a,o)=>a+o.cost,0)) },
                  ].map(c=>(
                    <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                      <div className="text-2xl font-black" style={{ color:C.dark }}>{c.val}</div>
                      <div className="text-xs text-gray-400 mt-1">{c.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold mb-4" style={{ color:C.dark }}>Order History</h4>
                  {orders.filter(o=>o.userId===viewedCust.id).length===0
                    ?<p className="text-gray-400 text-sm">No orders yet.</p>
                    :<div className="space-y-2.5">
                      {orders.filter(o=>o.userId===viewedCust.id).map(o=>(
                        <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                          <div><div className="text-xs font-bold" style={{ color:C.blue }}>{o.origin} → {o.destination}</div><div className="text-xs text-gray-400">{o.items} · {o.date}</div></div>
                          <div className="flex items-center gap-2"><span className="font-semibold text-xs" style={{ color:C.dark }}>{fmt(o.cost)}</span><Pill stage={o.stage} approved={o.adminApproved}/></div>
                        </div>
                      ))}
                    </div>
                  }
                </div>
              </div>
            </div>
          )}

          {/* ORDERS (admin) */}
          {sec==="orders"&&!viewUid&&(
            <div>
              {pendingS>0&&<div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50"><div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"/><span className="text-sm font-semibold text-orange-700">{pendingS} order{pendingS>1?"s":""} awaiting approval</span></div>}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background:"#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {["Customer","Route","Type","Items","Cost","Stage","Paid","Status","Action"].map(h=><th key={h} className="px-4 py-4 font-semibold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(o=>{
                        const isEd=editPrice?.id===o.id;
                        return (
                          <tr key={o.id} className={`hover:bg-gray-50 transition ${!o.adminApproved?"bg-orange-50":""}`}>
                            <td className="px-4 py-3 text-xs font-medium text-gray-700">{o.userName||"—"}</td>
                            <td className="px-4 py-3"><div className="text-xs text-gray-700">{o.origin}</div><div className="text-xs text-gray-400">→ {o.destination}</div></td>
                            <td className="px-4 py-3 text-xs text-gray-500 capitalize">{o.orderType}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 max-w-24 truncate">{o.items}</td>
                            <td className="px-4 py-3">
                              {isEd
                                ?<div className="flex items-center gap-1">
                                  <input type="number" className="w-24 px-2 py-1 border rounded-lg text-xs" value={editPrice.val} onChange={e=>setEditPrice(p=>({...p,val:e.target.value}))}/>
                                  <button onClick={()=>updateOrderCost(o.id, editPrice.val)} className="p-1 bg-green-100 rounded-lg"><Check size={11} color="#16A34A"/></button>
                                  <button onClick={()=>setEditPrice(null)} className="p-1 bg-gray-100 rounded-lg text-xs text-gray-400">✕</button>
                                </div>
                                :<button onClick={()=>setEditPrice({ id:o.id, val:String(o.cost) })} className="flex items-center gap-1 group">
                                  <span className="font-bold text-xs" style={{ color:C.dark }}>{fmt(o.cost)}</span>
                                  <Pencil size={10} color="#94A3B8" className="opacity-0 group-hover:opacity-100 transition"/>
                                </button>
                              }
                            </td>
                            <td className="px-4 py-3">
                              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white" value={o.stage} onChange={e=>updateOrderStage(o.id, e.target.value)}>
                                {STAGES.map((st,i)=><option key={i} value={i}>{st.icon} {st.label}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.paid?"bg-green-100 text-green-700":"bg-gray-100 text-gray-400"}`}>{o.paid?"Paid":"Unpaid"}</span></td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.adminApproved?"bg-blue-100 text-blue-700":"bg-orange-100 text-orange-600"}`}>{o.adminApproved?"Approved":"Pending"}</span></td>
                            <td className="px-4 py-3">
                              {!o.adminApproved&&<button onClick={()=>approveOrder(o.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200"><Check size={12}/> Approve</button>}
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
          {sec==="pricing"&&!viewUid&&(
            <div>
              <p className="text-gray-400 text-sm mb-5">{pricing.length} international routes · click any price to edit</p>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background:"#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {["From","To","Price (₦)","Duration","Action"].map(h=><th key={h} className="px-6 py-4 font-semibold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pricing.map(p=>{
                        const eid=`p${p.id}`;
                        const isEd=editPrice?.id===eid;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-semibold" style={{ color:C.dark }}>{p.from}</td>
                            <td className="px-6 py-4 text-gray-600">{p.to}</td>
                            <td className="px-6 py-4">
                              {isEd
                                ?<div className="flex items-center gap-2">
                                  <input type="number" className="w-32 px-3 py-2 border rounded-lg text-sm" value={editPrice.val} onChange={e=>setEditPrice(v=>({...v,val:e.target.value}))}/>
                                  <button onClick={()=>{ setPricing(prev=>prev.map(x=>x.id===p.id?{...x,price:parseInt(editPrice.val)||x.price}:x)); setEditPrice(null); }} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Save</button>
                                  <button onClick={()=>setEditPrice(null)} className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs">Cancel</button>
                                </div>
                                :<span className="font-black text-lg" style={{ color:C.dark }}>{fmt(p.price)}</span>
                              }
                            </td>
                            <td className="px-6 py-4 text-gray-500">{p.days}</td>
                            <td className="px-6 py-4">
                              <button onClick={()=>setEditPrice({ id:eid, val:String(p.price) })} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">
                                <Pencil size={12}/> Edit Price
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
          {sec==="testimonials"&&!viewUid&&(
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-400 text-sm">{testimonials.length} total · {testimonials.filter(t=>t.approved).length} published · {pendingT} pending</p>
                <button onClick={()=>setShowTForm(v=>!v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition" style={{ background:C.orange }}>
                  <Plus size={16}/> Add Testimonial
                </button>
              </div>
              {showTForm&&(
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border-2" style={{ borderColor:C.orange }}>
                  <h3 className="font-bold mb-4" style={{ color:C.dark }}>Add New Testimonial</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input className={inpSm} placeholder="Customer Name" value={nt.name} onChange={e=>setNt(p=>({...p,name:e.target.value}))}/>
                    <input className={inpSm} placeholder="Role / Company" value={nt.role} onChange={e=>setNt(p=>({...p,role:e.target.value}))}/>
                  </div>
                  <textarea className={inpSm+" resize-none mb-4"} rows={3} placeholder="Testimonial text…" value={nt.text} onChange={e=>setNt(p=>({...p,text:e.target.value}))}/>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1"><span className="text-sm text-gray-500 mr-1">Rating:</span>
                      {[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>setNt(p=>({...p,rating:n}))}><Star size={22} color={n<=nt.rating?"#F97316":"#CBD5E1"} fill={n<=nt.rating?"#F97316":"none"}/></button>))}
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button onClick={()=>setShowTForm(false)} className="px-4 py-2 text-sm border rounded-xl text-gray-500">Cancel</button>
                      <button onClick={addTestimonial} className="px-5 py-2 text-sm text-white rounded-xl font-bold" style={{ background:C.blue }}>Save</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t=>(
                  <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border-l-4" style={{ borderLeftColor:t.approved?"#16A34A":C.orange }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ background:C.blue }}>{t.avatar||t.name?.[0]}</div>
                        <div><div className="font-bold text-sm" style={{ color:C.dark }}>{t.name}</div><div className="text-gray-400 text-xs">{t.role}</div></div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.approved?"bg-green-100 text-green-700":"bg-orange-100 text-orange-600"}`}>{t.approved?"Published":"Pending"}</span>
                    </div>
                    <Stars n={t.rating}/>
                    <p className="text-gray-600 text-sm italic my-3 leading-relaxed">"{t.text}"</p>
                    <div className="flex gap-2">
                      <button onClick={()=>toggleTestimonial(t.id, t.approved)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${t.approved?"bg-gray-100 text-gray-600":"bg-green-100 text-green-700"}`}>
                        <Check size={12}/> {t.approved?"Unpublish":"Approve & Publish"}
                      </button>
                      <button onClick={()=>deleteTestimonial(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600">
                        <Trash2 size={12}/> Delete
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

/* ═══════════════════════════════════════════════════
   APP — Main Router with Firebase Auth
═══════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("loading");
  const [authMode, setAuthMode] = useState("login");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(()=>{
    // Load testimonials for landing page
    const loadTestimonials = async () => {
      try {
        const snap = await getDocs(collection(db,"testimonials"));
        setTestimonials(snap.docs.map(d=>({ id:d.id, ...d.data() })));
      } catch(e){ console.error(e); }
    };
    loadTestimonials();

    // Firebase auth state listener
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db,"users",user.uid));
          if (userDoc.exists()) {
            const profile = { id:user.uid, ...userDoc.data() };
            setUserProfile(profile);
            setFirebaseUser(user);
            setPage(profile.role==="admin"?"admin":"customer");
          } else {
            setPage("auth");
          }
        } catch(e){
          console.error(e);
          setPage("auth");
        }
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
        setPage("landing");
      }
    });
    return ()=>unsub();
  },[]);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch(e){ console.error(e); return false; }
  };

  const handleRegister = async ({ name, email, password, phone, company, promoEmails }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const role = email==="admin@easyship.com"?"admin":"user";
      const data = {
        name, email, phone:phone||"", company:company||"", role,
        joined: new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}),
        active:true, promoEmails,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db,"users",cred.user.uid), data);
      // Send welcome email
      try {
        await emailjs.send(EJS_SVC, EJS_TPL,{
          from_name: name,
          from_email: email,
          message: `Welcome to EasyShip, ${name}! 🚀\n\nYour account has been created successfully.\n\nYou can now:\n• Book local, national & international shipments\n• Track your packages in real-time\n• Pay securely via Paystack\n\nShip Smarter. Grow Faster.\n— The EasyShip Team`,
        }, EJS_KEY);
      } catch(emailErr){ console.error("Email error:", emailErr); }
      return true;
    } catch(e){ console.error(e); return false; }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setPage("landing");
  };

  const goAuth = mode => { setAuthMode(mode); setPage("auth"); };

  if (page==="loading") return <LoadingScreen/>;
  if (page==="landing") return <LandingPage onNav={goAuth} testimonials={testimonials}/>;
  if (page==="auth")    return <AuthPage mode={authMode} setMode={setAuthMode} onLogin={handleLogin} onRegister={handleRegister} onBack={()=>setPage("landing")}/>;
  if (page==="customer")return <CustomerDashboard firebaseUser={firebaseUser} userProfile={userProfile} onLogout={handleLogout}/>;
  if (page==="admin")   return <AdminDashboard onLogout={handleLogout}/>;
  return null;
}
