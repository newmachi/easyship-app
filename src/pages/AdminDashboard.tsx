// @ts-nocheck
import { useState, useEffect } from "react";
import {
  BarChart3, Users, Package, DollarSign, MessageSquare, Clock,
  Menu, LogOut, Plus, Trash2, Check, Eye, Pencil, Star, RefreshCw,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  collection, addDoc, getDocs, doc, updateDoc, getDoc, setDoc, deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase";
import { C, STAGES, INIT_PRICING, CHART_DATA } from "../constants";
import { fmt, inp, inpSm, Pill, Stars, Spinner } from "../components/Helpers";

export default function AdminDashboard({ onLogout }) {
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
        getDocs(collection(db, "users")),
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "testimonials")),
      ]);
      setUsers(uSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setOrders(oSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTestimonials(tSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const customers = users.filter((u) => u.role !== "admin");
  const pendingS = orders.filter((o) => !o.adminApproved).length;
  const pendingT = testimonials.filter((t) => !t.approved).length;
  const viewedCust = viewUid ? users.find((u) => u.id === viewUid) : null;

  const approveOrder = async (id) => {
    await updateDoc(doc(db, "orders", id), { adminApproved: true });
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, adminApproved: true } : o)));
  };

  const updateOrderStage = async (id, stage) => {
    await updateDoc(doc(db, "orders", id), { stage: parseInt(stage) });
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, stage: parseInt(stage) } : o)));
  };

  const updateOrderCost = async (id, cost) => {
    await updateDoc(doc(db, "orders", id), { cost: parseInt(cost) });
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, cost: parseInt(cost) } : o)));
    setEditPrice(null);
  };

  const doDeleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setUsers((p) => p.filter((u) => u.id !== id));
    if (viewUid === id) setViewUid(null);
    setDelConfirm(null);
  };

  const toggleUserActive = async (id, current) => {
    await updateDoc(doc(db, "users", id), { active: !current });
    setUsers((p) => p.map((u) => (u.id === id ? { ...u, active: !current } : u)));
  };

  const addTestimonial = async () => {
    if (!nt.name || !nt.text) return;
    const data = { ...nt, approved:false, date:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}), avatar:nt.name[0], createdAt:new Date().toISOString() };
    const ref = await addDoc(collection(db, "testimonials"), data);
    setTestimonials((p) => [...p, { id: ref.id, ...data }]);
    setNt({ name:"", role:"", text:"", rating:5 });
    setShowTForm(false);
  };

  const toggleTestimonial = async (id, current) => {
    await updateDoc(doc(db, "testimonials", id), { approved: !current });
    setTestimonials((p) => p.map((t) => (t.id === id ? { ...t, approved: !current } : t)));
  };

  const deleteTestimonial = async (id) => {
    await deleteDoc(doc(db, "testimonials", id));
    setTestimonials((p) => p.filter((t) => t.id !== id));
  };

  const addUser = async () => {
    if (!nu.name || !nu.email || !nu.password) return;
    try {
      const cred = await createUserWithEmailAndPassword(auth, nu.email, nu.password);
      const data = { name:nu.name, email:nu.email, phone:nu.phone||"", company:nu.company||"", role:"user", joined:new Date().toLocaleDateString("en-US",{month:"short",year:"numeric"}), active:true, promoEmails:false };
      await setDoc(doc(db, "users", cred.user.uid), data);
      setUsers((p) => [...p, { id: cred.user.uid, ...data }]);
      setNu({ name:"", email:"", password:"", phone:"", company:"" });
      setShowAddUser(false);
    } catch (e) { console.error(e); alert("Error creating user: " + e.message); }
  };

  const navItems = [
    { id:"overview",     icon:<BarChart3 size={18}/>,     label:"Overview" },
    { id:"customers",    icon:<Users size={18}/>,         label:"Customers" },
    { id:"orders",       icon:<Package size={18}/>,       label:"Orders",       badge:pendingS },
    { id:"pricing",      icon:<DollarSign size={18}/>,    label:"Pricing" },
    { id:"testimonials", icon:<MessageSquare size={18}/>, label:"Testimonials", badge:pendingT },
  ];

  const SideNav = () => (
    <div className="flex flex-col h-full p-4">
      <div>
        <div className="text-white font-black text-xl mt-2">Easy<span style={{ color: C.orange }}>Ship</span></div>
        <div className="text-xs mt-0.5 mb-6" style={{ color:"#60A5FA" }}>Admin Panel</div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((n) => (
          <button key={n.id} onClick={() => { setSec(n.id); setSideOpen(false); setViewUid(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${sec === n.id && !viewUid ? "text-white" : "text-blue-300 hover:text-white hover:bg-blue-900"}`}
            style={sec === n.id && !viewUid ? { background: C.orange } : {}}>
            {n.icon} {n.label}
            {n.badge > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-black">{n.badge}</span>}
          </button>
        ))}
      </nav>
      <button onClick={fetchAll} className="flex items-center gap-2 text-blue-300 hover:text-white text-xs px-4 py-2 rounded-xl hover:bg-blue-900 transition mb-2">
        <RefreshCw size={14} /> Refresh Data
      </button>
      <button onClick={onLogout} className="flex items-center gap-2 text-blue-300 hover:text-white text-sm px-4 py-3 rounded-xl hover:bg-blue-900 transition">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex h-screen" style={{ background: C.dark }}>
      <div className="hidden md:flex w-64 flex-col flex-shrink-0" style={{ background: C.dark }}><SideNav /></div>
      <div className="flex-1 flex items-center justify-center"><Spinner size={36} color={C.orange} /></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex w-64 flex-col flex-shrink-0" style={{ background: C.dark }}><SideNav /></div>
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background: C.dark }}><SideNav /></div>
          <div className="flex-1" style={{ background:"rgba(0,0,0,0.5)" }} onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Delete Modal */}
      {delConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3"><Trash2 size={22} color="#DC2626" /></div>
            <h3 className="font-black text-lg mb-1" style={{ color: C.dark }}>Delete Customer?</h3>
            <p className="text-gray-400 text-sm mb-5">This will permanently remove <b>{users.find((u) => u.id === delConfirm)?.name}</b>.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelConfirm(null)} className="flex-1 py-2.5 border rounded-xl text-sm font-semibold text-gray-500">Cancel</button>
              <button onClick={() => doDeleteUser(delConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSideOpen(true)}><Menu size={22} color="#475569" /></button>
            {viewedCust
              ? <div className="flex items-center gap-2 text-sm">
                  <button onClick={() => setViewUid(null)} className="text-gray-400 hover:text-gray-700">← Customers</button>
                  <span className="text-gray-300">/</span>
                  <span className="font-bold" style={{ color: C.dark }}>{viewedCust.name}</span>
                </div>
              : <h1 className="font-bold text-lg" style={{ color: C.dark }}>{navItems.find((n) => n.id === sec)?.label}</h1>
            }
          </div>
          <div className="flex items-center gap-3">
            {(pendingS + pendingT) > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:"#FFF7ED", border:"1px solid #FED7AA" }}>
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-bold text-orange-600">{pendingS + pendingT} pending</span>
              </div>
            )}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ background: C.orange }}>A</div>
          </div>
        </div>

        <div className="p-6">

          {/* OVERVIEW */}
          {sec === "overview" && !viewUid && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label:"Customers",       val:customers.length,                            icon:<Users size={20}/>,        color:C.blue    },
                  { label:"Total Orders",    val:orders.length,                               icon:<Package size={20}/>,      color:"#16A34A" },
                  { label:"Live Reviews",    val:testimonials.filter((t) => t.approved).length, icon:<MessageSquare size={20}/>, color:C.dark   },
                  { label:"Pending Actions", val:pendingS + pendingT,                         icon:<Clock size={20}/>,        color:C.orange  },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: c.color }}>{c.icon}</div>
                    <div className="text-3xl font-black" style={{ color: C.dark }}>{c.val}</div>
                    <div className="text-gray-400 text-sm mt-1">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-5" style={{ color: C.dark }}>Monthly Overview</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FF" />
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:12, border:"none", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }} />
                      <Bar dataKey="s" fill={C.blue} radius={[6, 6, 0, 0]} name="Shipments" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-4" style={{ color: C.dark }}>Recent Orders</h3>
                  {orders.length === 0
                    ? <p className="text-gray-400 text-sm">No orders yet.</p>
                    : <div className="space-y-3">
                        {orders.slice(0, 5).map((o) => (
                          <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <div>
                              <div className="text-sm font-semibold" style={{ color: C.dark }}>{o.origin} → {o.destination}</div>
                              <div className="text-xs text-gray-400">{o.userName} · {o.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm" style={{ color: C.dark }}>{fmt(o.cost)}</div>
                              <Pill stage={o.stage} approved={o.adminApproved} />
                            </div>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS LIST */}
          {sec === "customers" && !viewUid && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-400 text-sm">{customers.length} registered customers</p>
                <button onClick={() => setShowAddUser((v) => !v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition" style={{ background: C.orange }}>
                  <Plus size={16} /> Add Customer
                </button>
              </div>
              {showAddUser && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-5 border-2" style={{ borderColor: C.orange }}>
                  <h3 className="font-bold mb-4" style={{ color: C.dark }}>New Customer Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <input className={inpSm} placeholder="Full Name *" value={nu.name} onChange={(e) => setNu((p) => ({ ...p, name: e.target.value }))} />
                    <input className={inpSm} placeholder="Email *" type="email" value={nu.email} onChange={(e) => setNu((p) => ({ ...p, email: e.target.value }))} />
                    <input className={inpSm} placeholder="Password *" type="password" value={nu.password} onChange={(e) => setNu((p) => ({ ...p, password: e.target.value }))} />
                    <input className={inpSm} placeholder="Phone" value={nu.phone} onChange={(e) => setNu((p) => ({ ...p, phone: e.target.value }))} />
                    <input className={inpSm + " md:col-span-2"} placeholder="Company / Business" value={nu.company} onChange={(e) => setNu((p) => ({ ...p, company: e.target.value }))} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowAddUser(false)} className="px-4 py-2 text-sm border rounded-xl text-gray-500">Cancel</button>
                    <button onClick={addUser} className="px-5 py-2 text-sm text-white rounded-xl font-bold" style={{ background: C.blue }}>Create Account</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background:"#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {["Customer","Email","Company","Joined","Orders","Promo","Status","Actions"].map((h) => <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: C.blue }}>{u.name?.[0]}</div><span className="font-semibold text-sm" style={{ color: C.dark }}>{u.name}</span></div></td>
                          <td className="px-5 py-4 text-gray-500 text-xs">{u.email}</td>
                          <td className="px-5 py-4 text-gray-500 text-xs">{u.company || "—"}</td>
                          <td className="px-5 py-4 text-gray-400 text-xs">{u.joined}</td>
                          <td className="px-5 py-4 font-bold text-center" style={{ color: C.dark }}>{orders.filter((o) => o.userId === u.id).length}</td>
                          <td className="px-5 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.promoEmails ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}>{u.promoEmails ? "Yes" : "No"}</span></td>
                          <td className="px-5 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.active !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{u.active !== false ? "Active" : "Inactive"}</span></td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              <button onClick={() => setViewUid(u.id)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100"><Eye size={14} color={C.blue} /></button>
                              <button onClick={() => toggleUserActive(u.id, u.active !== false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"><Check size={14} color={u.active !== false ? "#DC2626" : "#16A34A"} /></button>
                              <button onClick={() => setDelConfirm(u.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100"><Trash2 size={14} color="#DC2626" /></button>
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
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-3" style={{ background: C.blue }}>{viewedCust.name?.[0]}</div>
                  <h3 className="font-black text-xl" style={{ color: C.dark }}>{viewedCust.name}</h3>
                  <p className="text-gray-400 text-sm">{viewedCust.email}</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${viewedCust.active !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{viewedCust.active !== false ? "Active" : "Inactive"}</span>
                    {viewedCust.promoEmails && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">Promo ✓</span>}
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  {[["Phone", viewedCust.phone || "—"], ["Company", viewedCust.company || "Individual"], ["Joined", viewedCust.joined]].map(([l, v]) => (
                    <div key={l}><label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{l}</label><div className="text-sm text-gray-700 mt-0.5">{v}</div></div>
                  ))}
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={() => toggleUserActive(viewedCust.id, viewedCust.active !== false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${viewedCust.active !== false ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                    {viewedCust.active !== false ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => setDelConfirm(viewedCust.id)} className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold">Delete</button>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label:"Total Orders", val:orders.filter((o) => o.userId === viewedCust.id).length },
                    { label:"Delivered",    val:orders.filter((o) => o.userId === viewedCust.id && o.stage === 5).length },
                    { label:"Total Spent",  val:fmt(orders.filter((o) => o.userId === viewedCust.id && o.paid).reduce((a, o) => a + o.cost, 0)) },
                  ].map((c) => (
                    <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                      <div className="text-2xl font-black" style={{ color: C.dark }}>{c.val}</div>
                      <div className="text-xs text-gray-400 mt-1">{c.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold mb-4" style={{ color: C.dark }}>Order History</h4>
                  {orders.filter((o) => o.userId === viewedCust.id).length === 0
                    ? <p className="text-gray-400 text-sm">No orders yet.</p>
                    : <div className="space-y-2.5">
                        {orders.filter((o) => o.userId === viewedCust.id).map((o) => (
                          <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <div><div className="text-xs font-bold" style={{ color: C.blue }}>{o.origin} → {o.destination}</div><div className="text-xs text-gray-400">{o.items} · {o.date}</div></div>
                            <div className="flex items-center gap-2"><span className="font-semibold text-xs" style={{ color: C.dark }}>{fmt(o.cost)}</span><Pill stage={o.stage} approved={o.adminApproved} /></div>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              </div>
            </div>
          )}

          {/* ORDERS (admin) */}
          {sec === "orders" && !viewUid && (
            <div>
              {pendingS > 0 && <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50"><div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /><span className="text-sm font-semibold text-orange-700">{pendingS} order{pendingS > 1 ? "s" : ""} awaiting approval</span></div>}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background:"#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {["Customer","Route","Type","Items","Cost","Stage","Paid","Status","Action"].map((h) => <th key={h} className="px-4 py-4 font-semibold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((o) => {
                        const isEd = editPrice?.id === o.id;
                        return (
                          <tr key={o.id} className={`hover:bg-gray-50 transition ${!o.adminApproved ? "bg-orange-50" : ""}`}>
                            <td className="px-4 py-3 text-xs font-medium text-gray-700">{o.userName || "—"}</td>
                            <td className="px-4 py-3"><div className="text-xs text-gray-700">{o.origin}</div><div className="text-xs text-gray-400">→ {o.destination}</div></td>
                            <td className="px-4 py-3 text-xs text-gray-500 capitalize">{o.orderType}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 max-w-24 truncate">{o.items}</td>
                            <td className="px-4 py-3">
                              {isEd
                                ? <div className="flex items-center gap-1">
                                    <input type="number" className="w-24 px-2 py-1 border rounded-lg text-xs" value={editPrice.val} onChange={(e) => setEditPrice((p) => ({ ...p, val: e.target.value }))} />
                                    <button onClick={() => updateOrderCost(o.id, editPrice.val)} className="p-1 bg-green-100 rounded-lg"><Check size={11} color="#16A34A" /></button>
                                    <button onClick={() => setEditPrice(null)} className="p-1 bg-gray-100 rounded-lg text-xs text-gray-400">✕</button>
                                  </div>
                                : <button onClick={() => setEditPrice({ id: o.id, val: String(o.cost) })} className="flex items-center gap-1 group">
                                    <span className="font-bold text-xs" style={{ color: C.dark }}>{fmt(o.cost)}</span>
                                    <Pencil size={10} color="#94A3B8" className="opacity-0 group-hover:opacity-100 transition" />
                                  </button>
                              }
                            </td>
                            <td className="px-4 py-3">
                              <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white" value={o.stage} onChange={(e) => updateOrderStage(o.id, e.target.value)}>
                                {STAGES.map((st, i) => <option key={i} value={i}>{st.icon} {st.label}</option>)}
                              </select>
                            </td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.paid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{o.paid ? "Paid" : "Unpaid"}</span></td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.adminApproved ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-600"}`}>{o.adminApproved ? "Approved" : "Pending"}</span></td>
                            <td className="px-4 py-3">
                              {!o.adminApproved && <button onClick={() => approveOrder(o.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200"><Check size={12} /> Approve</button>}
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
              <p className="text-gray-400 text-sm mb-5">{pricing.length} international routes · click any price to edit</p>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background:"#F8FAFF" }}>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                        {["From","To","Price (₦)","Duration","Action"].map((h) => <th key={h} className="px-6 py-4 font-semibold">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pricing.map((p) => {
                        const eid = `p${p.id}`;
                        const isEd = editPrice?.id === eid;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-semibold" style={{ color: C.dark }}>{p.from}</td>
                            <td className="px-6 py-4 text-gray-600">{p.to}</td>
                            <td className="px-6 py-4">
                              {isEd
                                ? <div className="flex items-center gap-2">
                                    <input type="number" className="w-32 px-3 py-2 border rounded-lg text-sm" value={editPrice.val} onChange={(e) => setEditPrice((v) => ({ ...v, val: e.target.value }))} />
                                    <button onClick={() => { setPricing((prev) => prev.map((x) => (x.id === p.id ? { ...x, price: parseInt(editPrice.val) || x.price } : x))); setEditPrice(null); }} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Save</button>
                                    <button onClick={() => setEditPrice(null)} className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs">Cancel</button>
                                  </div>
                                : <span className="font-black text-lg" style={{ color: C.dark }}>{fmt(p.price)}</span>
                              }
                            </td>
                            <td className="px-6 py-4 text-gray-500">{p.days}</td>
                            <td className="px-6 py-4">
                              <button onClick={() => setEditPrice({ id: eid, val: String(p.price) })} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">
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
                <p className="text-gray-400 text-sm">{testimonials.length} total · {testimonials.filter((t) => t.approved).length} published · {pendingT} pending</p>
                <button onClick={() => setShowTForm((v) => !v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition" style={{ background: C.orange }}>
                  <Plus size={16} /> Add Testimonial
                </button>
              </div>
              {showTForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border-2" style={{ borderColor: C.orange }}>
                  <h3 className="font-bold mb-4" style={{ color: C.dark }}>Add New Testimonial</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input className={inpSm} placeholder="Customer Name" value={nt.name} onChange={(e) => setNt((p) => ({ ...p, name: e.target.value }))} />
                    <input className={inpSm} placeholder="Role / Company" value={nt.role} onChange={(e) => setNt((p) => ({ ...p, role: e.target.value }))} />
                  </div>
                  <textarea className={inpSm + " resize-none mb-4"} rows={3} placeholder="Testimonial text…" value={nt.text} onChange={(e) => setNt((p) => ({ ...p, text: e.target.value }))} />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1"><span className="text-sm text-gray-500 mr-1">Rating:</span>
                      {[1, 2, 3, 4, 5].map((n) => (<button key={n} onClick={() => setNt((p) => ({ ...p, rating: n }))}><Star size={22} color={n <= nt.rating ? "#F97316" : "#CBD5E1"} fill={n <= nt.rating ? "#F97316" : "none"} /></button>))}
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button onClick={() => setShowTForm(false)} className="px-4 py-2 text-sm border rounded-xl text-gray-500">Cancel</button>
                      <button onClick={addTestimonial} className="px-5 py-2 text-sm text-white rounded-xl font-bold" style={{ background: C.blue }}>Save</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: t.approved ? "#16A34A" : C.orange }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ background: C.blue }}>{t.avatar || t.name?.[0]}</div>
                        <div><div className="font-bold text-sm" style={{ color: C.dark }}>{t.name}</div><div className="text-gray-400 text-xs">{t.role}</div></div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.approved ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>{t.approved ? "Published" : "Pending"}</span>
                    </div>
                    <Stars n={t.rating} />
                    <p className="text-gray-600 text-sm italic my-3 leading-relaxed">"{t.text}"</p>
                    <div className="flex gap-2">
                      <button onClick={() => toggleTestimonial(t.id, t.approved)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${t.approved ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}`}>
                        <Check size={12} /> {t.approved ? "Unpublish" : "Approve & Publish"}
                      </button>
                      <button onClick={() => deleteTestimonial(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600">
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
