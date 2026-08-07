// @ts-nocheck
import { useState } from "react";
import { C } from "../constants";
import { inp, Spinner } from "../components/Helpers";

export default function AuthPage({ mode, setMode, onLogin, onRegister, onBack }) {
  const [f, setF] = useState({ name:"", email:"", password:"", phone:"", company:"", promo:false });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setErr("");
    if (!f.email || !f.password) return setErr("Please fill in all required fields.");
    if (mode === "register" && !f.name) return setErr("Please enter your full name.");
    setLoading(true);
    if (mode === "login") {
      const ok = await onLogin(f.email.trim(), f.password);
      if (!ok) { setErr("Invalid email or password. Please try again."); setLoading(false); }
    } else {
      const ok = await onRegister({
        name: f.name.trim(),
        email: f.email.trim(),
        password: f.password,
        phone: f.phone,
        company: f.company,
        promoEmails: f.promo,
      });
      if (!ok) { setErr("Registration failed. Please check your details and try again."); setLoading(false); }
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{ background: `linear-gradient(135deg,${C.dark},${C.blue})` }}
    >
      <button onClick={onBack} className="absolute top-6 left-6 text-blue-300 text-sm hover:text-white transition">
        ← Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Banner */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ background: `linear-gradient(135deg,${C.dark},${C.blue})` }}>
          <div className="text-white font-black text-3xl mb-1">
            Easy<span style={{ color: C.orange }}>Ship</span>
          </div>
          <p className="text-blue-300 text-sm">Ship Smarter. Grow Faster.</p>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background:"#F0F4FF" }}>
            {["login","register"].map((m) => (
              <button key={m}
                onClick={() => { setMode(m); setErr(""); setF({ name:"",email:"",password:"",phone:"",company:"",promo:false }); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${mode === m ? "text-white shadow" : "text-gray-400"}`}
                style={mode === m ? { background: C.blue } : {}}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {mode === "register" && (
              <input className={inp} placeholder="Full Name *" value={f.name} onChange={(e) => set("name", e.target.value)} />
            )}
            <input className={inp} placeholder="Email address *" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
            <input className={inp} placeholder="Password *" type="password" value={f.password} onChange={(e) => set("password", e.target.value)} />

            {mode === "register" && (
              <>
                <input className={inp} placeholder="Phone number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                <input className={inp} placeholder="Company / Business name (optional)" value={f.company} onChange={(e) => set("company", e.target.value)} />
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <input
                    type="checkbox"
                    checked={f.promo}
                    onChange={(e) => set("promo", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded"
                    style={{ accentColor: C.orange }}
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to receive <b>promotional emails</b> about EasyShip offers, updates, and shipping tips.
                  </span>
                </label>
              </>
            )}

            {err && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">{err}</div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-black text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
              style={{ background: loading ? "#94A3B8" : C.orange }}
            >
              {loading ? (
                <><Spinner size={18} /> Please wait…</>
              ) : mode === "login" ? "Sign In to Dashboard" : "Create My Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
