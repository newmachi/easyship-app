// @ts-nocheck
import { useState, useEffect } from "react";
import {
  Package, Truck, CheckCircle, DollarSign, MapPin, Menu,
  Home, CreditCard, Headphones, User, LogOut, Plus, Send,
  Phone, Mail, MessageSquare, RefreshCw, Clock,
} from "lucide-react";
import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db } from "../firebase";
import { C, STAGES, ORDER_TYPES, NG_CITIES, INTL_DEST, INIT_PRICING, EJS_SVC, EJS_TPL, EJS_KEY, PS_KEY } from "../constants";
import { fmt, inp, Pill, Stars, Spinner } from "../components/Helpers";

export default function CustomerDashboard({ firebaseUser, userProfile, onLogout }) {
  const [sec, setSec] = useState("overview");
  const [sideOpen, setSideOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [trackId, setTrackId] = useState(null);

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
  const [sf, setSf] = useState({ name: userProfile?.name || "", email: firebaseUser?.email || "", subject: "", cat: "General Enquiry", msg: "" });
  const [sDone, setSDone] = useState(false);
  const [sSending, setSSending] = useState(false);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const q = query(collection(db, "orders"), where("userId", "==", firebaseUser.uid));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoadingOrders(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const calcPrice = () => {
    const ot = ORDER_TYPES.find((o) => o.id === orderType);
    if (orderType === "international") {
      const route = INIT_PRICING.find((p) => p.from.toLowerCase() === origin.toLowerCase() && p.to.toLowerCase() === destination.toLowerCase());
      return route ? route.price : ot?.basePrice || 45000;
    }
    const w = parseFloat(weight) || 1;
    return Math.round((ot?.basePrice || 3500) * Math.max(1, w * 0.8));
  };

  const handleBookOrder = async () => {
    if (!origin || !destination || !items || !weight) return;
    setBooking(true);
    try {
      const price = calcPrice();
      const dateStr = new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
      await addDoc(collection(db, "orders"), {
        userId: firebaseUser.uid,
        userName: userProfile.name,
        userEmail: firebaseUser.email,
        orderType, origin, destination, items,
        weight: parseFloat(weight),
        fragile, notes: orderNotes,
        cost: price, paid: false,
        adminApproved: false, stage: 0,
        date: dateStr, createdAt: new Date().toISOString(),
      });
      await emailjs.send(EJS_SVC, EJS_TPL, {
        from_name: userProfile.name,
        from_email: firebaseUser.email,
        message: `New ${orderType} order!\nFrom: ${origin}\nTo: ${destination}\nItems: ${items}\nWeight: ${weight}kg\nFragile: ${fragile ? "Yes" : "No"}\nEstimated Cost: ${fmt(price)}`,
      }, EJS_KEY);
      setBooked(true);
      fetchOrders();
      setItems(""); setWeight(""); setFragile(false); setOrderNotes(""); setDestination("");
      setTimeout(() => setBooked(false), 4000);
    } catch (e) { console.error("Booking error:", e); }
    setBooking(false);
  };

  const handlePaystack = (order) => {
    if (!window.PaystackPop) { alert("Payment system loading, please try again."); return; }
    const handler = window.PaystackPop.setup({
      key: PS_KEY,
      email: firebaseUser.email,
      amount: order.cost * 100,
      currency: "NGN",
      ref: `EASY-${Date.now()}`,
      callback: async (response) => {
        try {
          await updateDoc(doc(db, "orders", order.id), { paid: true, stage: 1, paymentRef: response.reference, paidAt: new Date().toISOString() });
          await emailjs.send(EJS_SVC, EJS_TPL, {
            from_name: userProfile.name,
            from_email: firebaseUser.email,
            message: `Payment confirmed!\nOrder: ${order.id}\nAmount: ${fmt(order.cost)}\nRef: ${response.reference}`,
          }, EJS_KEY);
          fetchOrders();
          alert("Payment successful! Your shipment is now being processed.");
        } catch (e) { console.error(e); }
      },
      onClose: () => {},
    });
    handler.openIframe();
  };

  const handleSupport = async () => {
    if (!sf.subject || !sf.msg) return;
    setSSending(true);
    try {
      await emailjs.send(EJS_SVC, EJS_TPL, {
        from_name: sf.name,
        from_email: sf.email,
        message: `SUPPORT REQUEST\nCategory: ${sf.cat}\nSubject: ${sf.subject}\n\n${sf.msg}`,
      }, EJS_KEY);
      setSDone(true);
    } catch (e) { console.error(e); }
    setSSending(false);
  };

  const tracked = trackId ? orders.find((o) => o.id === trackId) : null;
  const paid = orders.filter((o) => o.paid);
  const unpaidApproved = orders.filter((o) => !o.paid && o.adminApproved);
  const pendingApproval = orders.filter((o) => !o.paid && !o.adminApproved);

  const navItems = [
    { id:"overview",  icon:<Home size={18}/>,       label:"Overview" },
    { id:"book",      icon:<Plus size={18}/>,        label:"Book Shipment", badge:true },
    { id:"shipments", icon:<Package size={18}/>,    label:"My Orders" },
    { id:"track",     icon:<MapPin size={18}/>,     label:"Track Package" },
    { id:"payment",   icon:<CreditCard size={18}/>, label:"Payment" },
    { id:"support",   icon:<Headphones size={18}/>, label:"Support" },
    { id:"profile",   icon:<User size={18}/>,       label:"My Profile" },
  ];

  const SideNav = () => (
    <div className="flex flex-col h-full p-4">
      <div className="text-white font-black text-xl mt-2 mb-8">
        Easy<span style={{ color: C.orange }}>Ship</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((n) => (
          <button key={n.id} onClick={() => { setSec(n.id); setSideOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${sec === n.id ? "text-white" : "text-blue-300 hover:text-white hover:bg-blue-900"}`}
            style={sec === n.id ? { background: C.orange } : {}}>
            {n.icon} {n.label}
            {n.badge && <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-white font-black" style={{ color: C.orange }}>NEW</span>}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="flex items-center gap-2 text-blue-300 hover:text-white text-sm px-4 py-3 rounded-xl hover:bg-blue-900 transition">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col flex-shrink-0" style={{ background: C.dark }}>
        <SideNav />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col" style={{ background: C.dark }}><SideNav /></div>
          <div className="flex-1" style={{ background:"rgba(0,0,0,0.5)" }} onClick={() => setSideOpen(false)} />
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSideOpen(true)}><Menu size={22} color="#475569" /></button>
            <h1 className="font-bold text-lg" style={{ color: C.dark }}>{navItems.find((n) => n.id === sec)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black" style={{ background: C.blue }}>
              {userProfile?.name?.[0] || "U"}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700">{userProfile?.name}</span>
          </div>
        </div>

        <div className="p-6">

          {/* ── OVERVIEW ── */}
          {sec === "overview" && (
            <div>
              <p className="text-gray-400 text-sm mb-6">Welcome back, <b className="text-gray-700">{userProfile?.name?.split(" ")[0]}</b> 👋</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label:"Total Orders", val:orders.length,                                              icon:<Package size={20}/>,    color:C.blue    },
                  { label:"Delivered",    val:orders.filter((o) => o.stage === 5).length,                icon:<CheckCircle size={20}/>, color:"#16A34A" },
                  { label:"In Transit",   val:orders.filter((o) => o.stage > 0 && o.stage < 5).length,  icon:<Truck size={20}/>,       color:"#CA8A04" },
                  { label:"Total Spent",  val:fmt(paid.reduce((a, o) => a + o.cost, 0)),                 icon:<DollarSign size={20}/>,  color:C.orange  },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: c.color }}>{c.icon}</div>
                    <div className="text-2xl font-black" style={{ color: C.dark }}>{c.val}</div>
                    <div className="text-gray-400 text-xs mt-1">{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Book CTA */}
              <div className="rounded-2xl p-6 mb-6 flex items-center justify-between" style={{ background:`linear-gradient(135deg,${C.dark},${C.blue})` }}>
                <div>
                  <h3 className="text-white font-black text-xl mb-1">Need to ship something?</h3>
                  <p className="text-blue-300 text-sm">Book a new shipment in under 2 minutes</p>
                </div>
                <button onClick={() => setSec("book")} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white hover:opacity-90 transition" style={{ background: C.orange }}>
                  <Plus size={18} /> Book Now
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: C.dark }}>Recent Orders</h3>
                  <button onClick={fetchOrders} className="text-gray-400 hover:text-gray-600"><RefreshCw size={16} /></button>
                </div>
                {loadingOrders
                  ? <div className="text-center py-8"><Spinner size={24} color={C.blue} /></div>
                  : orders.length === 0
                    ? <div className="text-center py-10 text-gray-300"><Package size={36} className="mx-auto mb-2" /><p className="text-sm">No orders yet — book your first shipment!</p></div>
                    : <div className="space-y-3">
                        {orders.slice(0, 3).map((o) => (
                          <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:"#EFF6FF" }}><Package size={16} style={{ color: C.blue }} /></div>
                              <div>
                                <div className="text-sm font-bold" style={{ color: C.dark }}>{o.origin} → {o.destination}</div>
                                <div className="text-xs text-gray-400 capitalize">{o.orderType} · {o.date}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Pill stage={o.stage} approved={o.adminApproved} />
                              <div className="text-xs text-gray-400 mt-1">{fmt(o.cost)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                }
                {orders.length > 0 && <button onClick={() => setSec("shipments")} className="mt-4 text-sm font-semibold hover:underline" style={{ color: C.blue }}>View all orders →</button>}
              </div>
            </div>
          )}

          {/* ── BOOK SHIPMENT ── */}
          {sec === "book" && (
            <div className="max-w-2xl">
              {booked && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
                  <CheckCircle size={22} color="#16A34A" />
                  <div>
                    <div className="font-bold text-green-700">Order Booked Successfully!</div>
                    <div className="text-green-600 text-sm">Confirmation email sent. Your order is pending admin approval.</div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-xl mb-1" style={{ color: C.dark }}>Book a Shipment</h3>
                <p className="text-gray-400 text-sm mb-6">Fill in your shipment details and we'll handle the rest.</p>

                {/* Order Type */}
                <div className="mb-5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2 block">Order Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {ORDER_TYPES.map((ot) => (
                      <button key={ot.id} onClick={() => { setOrderType(ot.id); setDestination(""); }}
                        className="p-3 rounded-xl border-2 text-center transition"
                        style={{ borderColor: orderType === ot.id ? C.orange : "#E5E7EB", background: orderType === ot.id ? "#FFF7ED" : "white" }}>
                        <div className="text-2xl mb-1">{ot.icon}</div>
                        <div className="text-xs font-bold" style={{ color: orderType === ot.id ? C.orange : C.dark }}>{ot.label}</div>
                        <div className="text-xs text-gray-400">{ot.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Origin */}
                <div className="mb-4">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Pickup City (Origin)</label>
                  <select className={inp} value={origin} onChange={(e) => setOrigin(e.target.value)}>
                    {NG_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Destination */}
                <div className="mb-4">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">
                    {orderType === "international" ? "International Destination" : "Delivery City"}
                  </label>
                  <select className={inp} value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select destination...</option>
                    {(orderType === "international" ? INTL_DEST : NG_CITIES).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Items Description</label>
                    <input className={inp} placeholder="e.g. Skincare products, Electronics, Documents" value={items} onChange={(e) => setItems(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Weight (kg)</label>
                    <input className={inp} type="number" placeholder="e.g. 2.5" value={weight} onChange={(e) => setWeight(e.target.value)} min="0.1" step="0.1" />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer mt-6">
                      <input type="checkbox" checked={fragile} onChange={(e) => setFragile(e.target.checked)} className="w-5 h-5 rounded" style={{ accentColor: C.orange }} />
                      <div>
                        <div className="text-sm font-semibold" style={{ color: C.dark }}>Fragile Items</div>
                        <div className="text-xs text-gray-400">Extra care packaging</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block">Special Instructions (optional)</label>
                  <textarea className={inp + " resize-none"} rows={2} placeholder="Any special handling instructions..." value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
                </div>

                {/* Price Preview */}
                {origin && destination && weight && (
                  <div className="rounded-xl p-4 mb-5 flex items-center justify-between" style={{ background:"#F0F4FF" }}>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Estimated Price</div>
                      <div className="text-3xl font-black mt-1" style={{ color: C.dark }}>{fmt(calcPrice())}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{ORDER_TYPES.find((o) => o.id === orderType)?.desc} · {weight}kg</div>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                )}

                <button onClick={handleBookOrder} disabled={booking || !origin || !destination || !items || !weight}
                  className="w-full py-4 rounded-xl text-white font-black text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                  style={{ background: (!origin || !destination || !items || !weight) ? "#94A3B8" : C.orange }}>
                  {booking ? <><Spinner size={18} /> Booking…</> : <><Package size={18} /> Confirm Booking</>}
                </button>
              </div>
            </div>
          )}

          {/* ── MY ORDERS ── */}
          {sec === "shipments" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold" style={{ color: C.dark }}>All My Orders</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={fetchOrders} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50"><RefreshCw size={16} /></button>
              </div>
              {loadingOrders
                ? <div className="text-center py-16"><Spinner size={28} color={C.blue} /></div>
                : orders.length === 0
                  ? <div className="text-center py-16 text-gray-300">
                      <Package size={48} className="mx-auto mb-3" />
                      <p>No orders yet</p>
                      <button onClick={() => setSec("book")} className="mt-3 text-sm font-semibold px-4 py-2 rounded-xl text-white" style={{ background: C.orange }}>Book your first shipment</button>
                    </div>
                  : <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead style={{ background:"#F8FAFF" }}>
                          <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                            {["Route","Type","Items","Date","Cost","Status",""].map((h) => <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 transition">
                              <td className="px-5 py-4"><div className="text-xs font-medium text-gray-700">{o.origin}</div><div className="text-xs text-gray-400">→ {o.destination}</div></td>
                              <td className="px-5 py-4 text-xs text-gray-500 capitalize">{o.orderType}</td>
                              <td className="px-5 py-4 text-xs text-gray-500 max-w-xs">{o.items}</td>
                              <td className="px-5 py-4 text-xs text-gray-400">{o.date}</td>
                              <td className="px-5 py-4 font-bold text-xs" style={{ color: C.dark }}>{fmt(o.cost)}</td>
                              <td className="px-5 py-4"><Pill stage={o.stage} approved={o.adminApproved} /></td>
                              <td className="px-5 py-4">
                                <button onClick={() => { setTrackId(o.id); setSec("track"); }} className="text-xs px-3 py-1.5 rounded-lg text-white font-semibold hover:opacity-80" style={{ background: C.blue }}>Track</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
              }
            </div>
          )}

          {/* ── TRACK ── */}
          {sec === "track" && (
            <div className="max-w-xl">
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
                <h3 className="font-bold mb-3" style={{ color: C.dark }}>Select an Order to Track</h3>
                {orders.length === 0
                  ? <p className="text-gray-400 text-sm">No orders to track yet.</p>
                  : <div className="flex flex-wrap gap-2">
                      {orders.map((o) => (
                        <button key={o.id} onClick={() => setTrackId(o.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          style={{ background: trackId === o.id ? C.blue : "#F0F4FF", color: trackId === o.id ? "white" : C.dark }}>
                          {o.origin} → {o.destination}
                        </button>
                      ))}
                    </div>
                }
              </div>
              {tracked && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b">
                    <div>
                      <div className="font-black text-lg" style={{ color: C.blue }}>{tracked.origin} → {tracked.destination}</div>
                      <p className="text-gray-500 text-sm mt-0.5 capitalize">{tracked.orderType} · {tracked.items}</p>
                      <p className="text-gray-400 text-xs">{tracked.weight}kg · {tracked.date}</p>
                    </div>
                    <Pill stage={tracked.stage} approved={tracked.adminApproved} />
                  </div>
                  {!tracked.adminApproved
                    ? <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3"><Clock size={24} color={C.orange} /></div>
                        <h4 className="font-bold" style={{ color: C.dark }}>Awaiting Admin Approval</h4>
                        <p className="text-gray-400 text-sm mt-1">Tracking begins once your order is approved.</p>
                      </div>
                    : <div>
                        {STAGES.map((stage, i) => {
                          const done = i < tracked.stage;
                          const active = i === tracked.stage;
                          return (
                            <div key={stage.label} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0"
                                  style={{ background: done ? "#16A34A" : active ? C.orange : "#F9FAFB", borderColor: done ? "#16A34A" : active ? C.orange : "#E5E7EB", color: done || active ? "white" : "#D1D5DB" }}>
                                  {done ? "✓" : stage.icon}
                                </div>
                                {i < STAGES.length - 1 && <div className="w-0.5 h-8 my-1" style={{ background: done ? "#16A34A" : "#E5E7EB" }} />}
                              </div>
                              <div className="pt-2 pb-6">
                                <div className="font-semibold text-sm" style={{ color: done ? "#16A34A" : active ? C.orange : "#D1D5DB" }}>{stage.label}</div>
                                {done && <div className="text-xs text-gray-400 mt-0.5">Completed ✓</div>}
                                {active && <div className="text-xs font-medium mt-0.5" style={{ color: C.orange }}>⟵ Current stage</div>}
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
          {sec === "payment" && (
            <div className="max-w-xl">
              <h3 className="font-bold mb-5" style={{ color: C.dark }}>Payments</h3>
              {unpaidApproved.length === 0 && pendingApproval.length === 0 && paid.length === 0 && (
                <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
                  <CheckCircle size={40} color="#16A34A" className="mx-auto mb-3" />
                  <p className="font-bold text-gray-700">All paid up!</p>
                  <p className="text-gray-400 text-sm mt-1">No pending payments.</p>
                </div>
              )}
              {unpaidApproved.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl p-5 shadow-sm mb-4 border-l-4" style={{ borderLeftColor: C.orange }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm" style={{ color: C.dark }}>{o.origin} → {o.destination}</div>
                      <p className="text-gray-500 text-xs mt-0.5 capitalize">{o.orderType} · {o.items}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">✓ Approved — Ready to Pay</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black" style={{ color: C.dark }}>{fmt(o.cost)}</div>
                      <button onClick={() => handlePaystack(o)} className="mt-2 px-5 py-2 rounded-xl text-white font-bold text-sm hover:opacity-90 transition" style={{ background: C.orange }}>Pay with Paystack</button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingApproval.map((o) => (
                <div key={o.id} className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-3">
                  <div className="flex justify-between items-center">
                    <div><div className="font-bold text-sm" style={{ color: C.orange }}>{o.origin} → {o.destination}</div><p className="text-gray-500 text-xs mt-0.5">{o.items}</p></div>
                    <div className="text-right"><div className="font-bold text-gray-700">{fmt(o.cost)}</div><span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">⏳ Awaiting Approval</span></div>
                  </div>
                </div>
              ))}
              {paid.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Paid Orders</h4>
                  {paid.map((o) => (
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
          {sec === "support" && (
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-xl mb-1" style={{ color: C.dark }}>Contact Support</h3>
                  <p className="text-gray-400 text-sm mb-6">We respond within 2 hours during working hours.</p>
                  {sDone
                    ? <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><CheckCircle size={30} color="#16A34A" /></div>
                        <h4 className="font-black text-xl text-green-600">Message Sent!</h4>
                        <p className="text-gray-400 text-sm mt-2 mb-5">Our team will respond within 2 hours.</p>
                        <button onClick={() => { setSDone(false); setSf((p) => ({ ...p, subject:"", msg:"", cat:"General Enquiry" })); }} className="text-sm font-semibold underline" style={{ color: C.blue }}>Send another message</button>
                      </div>
                    : <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Your Name</label><input className={inp + " mt-1"} value={sf.name} onChange={(e) => setSf((p) => ({ ...p, name: e.target.value }))} /></div>
                          <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</label><input className={inp + " mt-1"} value={sf.email} onChange={(e) => setSf((p) => ({ ...p, email: e.target.value }))} /></div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Category</label>
                          <select className={inp + " mt-1"} value={sf.cat} onChange={(e) => setSf((p) => ({ ...p, cat: e.target.value }))}>
                            {["General Enquiry","Complaint","Tracking Issue","Payment Issue","Damaged Item","Other"].map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Subject</label><input className={inp + " mt-1"} placeholder="Brief description of your issue" value={sf.subject} onChange={(e) => setSf((p) => ({ ...p, subject: e.target.value }))} /></div>
                        <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Message</label><textarea className={inp + " mt-1 resize-none"} rows={4} placeholder="Describe your issue in detail…" value={sf.msg} onChange={(e) => setSf((p) => ({ ...p, msg: e.target.value }))} /></div>
                        <button onClick={handleSupport} disabled={sSending || !sf.subject || !sf.msg}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
                          style={{ background: sSending || !sf.subject || !sf.msg ? "#94A3B8" : C.orange }}>
                          {sSending ? <><Spinner size={16} /> Sending…</> : <><Send size={16} /> Send Message</>}
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
                  ].map((c) => (
                    <div key={c.title} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: C.blue }}>{c.icon}</div>
                      <div><div className="font-bold text-sm" style={{ color: C.dark }}>{c.title}</div><div className="text-gray-700 text-sm">{c.val}</div><div className="text-gray-400 text-xs">{c.sub}</div></div>
                    </div>
                  ))}
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="font-bold text-sm mb-3" style={{ color: C.dark }}>Working Hours</div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      {[["Monday – Friday","8AM – 8PM"],["Saturday","9AM – 5PM"],["Sunday","Closed"]].map(([d, h]) => (
                        <div key={d} className="flex justify-between"><span>{d}</span><span className={`font-semibold ${h === "Closed" ? "text-red-400" : ""}`}>{h}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {sec === "profile" && (
            <div className="max-w-md">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black" style={{ background: C.blue }}>{userProfile?.name?.[0] || "U"}</div>
                  <div>
                    <h3 className="font-black text-xl" style={{ color: C.dark }}>{userProfile?.name}</h3>
                    <p className="text-gray-400 text-sm">{firebaseUser?.email}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: C.blue }}>Customer</span>
                      {userProfile?.promoEmails && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">Promo Emails ✓</span>}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ["Full Name",           userProfile?.name],
                    ["Email Address",       firebaseUser?.email],
                    ["Phone",               userProfile?.phone || "Not provided"],
                    ["Company / Business",  userProfile?.company || "Individual"],
                    ["Member Since",        userProfile?.joined],
                    ["Promotional Emails",  userProfile?.promoEmails ? "Subscribed" : "Not subscribed"],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">{l}</label>
                      <div className="mt-1 px-4 py-2.5 rounded-xl bg-gray-50 text-sm text-gray-700 border border-gray-100">{v || "—"}</div>
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
