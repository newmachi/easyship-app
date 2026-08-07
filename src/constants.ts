// @ts-nocheck

/* ── Brand Colors ─────────────────────────────────── */
export const C = { dark:"#0D2B6B", blue:"#1A4FA0", orange:"#F97316" };

/* ── Third Party Keys ─────────────────────────────── */
export const EJS_SVC = "service_wsa7ahk";
export const EJS_TPL = "template_j1ticv6";
export const EJS_KEY = "vN74FpavFC_oolry3";
export const PS_KEY  = "pk_test_b1bbb3c39fb0e7b706dfc1e2aa3ee4fba8778679";

/* ── Shipment Stages ──────────────────────────────── */
export const STAGES = [
  { label:"Booking Confirmed", icon:"📋" },
  { label:"Package Picked Up", icon:"📦" },
  { label:"In Transit",        icon:"✈️" },
  { label:"Customs Clearance", icon:"🛃" },
  { label:"Out for Delivery",  icon:"🚚" },
  { label:"Delivered",         icon:"✅" },
];

/* ── Order Types ──────────────────────────────────── */
export const ORDER_TYPES = [
  { id:"local",         label:"Local",         desc:"Same city delivery",    icon:"🏙️", basePrice:3500  },
  { id:"national",      label:"National",      desc:"Cross-state delivery",  icon:"🗺️", basePrice:9000  },
  { id:"international", label:"International", desc:"Cross-border shipping", icon:"✈️", basePrice:45000 },
];

/* ── Locations ────────────────────────────────────── */
export const NG_CITIES = [
  "Lagos","Abuja","Port Harcourt","Kano","Ibadan","Enugu",
  "Benin City","Kaduna","Jos","Warri","Aba","Onitsha","Uyo","Calabar","Akure"
];

export const INTL_DEST = [
  "London, UK","Houston, TX","Dubai, UAE","Toronto, CA","New York, US",
  "Accra, GH","Nairobi, KE","Johannesburg, SA","Paris, FR","Berlin, DE",
  "Amsterdam, NL","Madrid, ES"
];

/* ── Initial Pricing ──────────────────────────────── */
export const INIT_PRICING = [
  { id:"1", from:"Lagos", to:"London, UK",   price:45000, days:"5–7 days"  },
  { id:"2", from:"Lagos", to:"Houston, TX",  price:78500, days:"7–10 days" },
  { id:"3", from:"Lagos", to:"Accra, GH",    price:12000, days:"2–3 days"  },
  { id:"4", from:"Lagos", to:"Dubai, UAE",   price:55000, days:"4–6 days"  },
  { id:"5", from:"Abuja", to:"Toronto, CA",  price:65000, days:"7–10 days" },
  { id:"6", from:"Lagos", to:"New York, US", price:82000, days:"7–10 days" },
];

/* ── Chart Data ───────────────────────────────────── */
export const CHART_DATA = [
  {m:"Jan",s:12},{m:"Feb",s:18},{m:"Mar",s:24},
  {m:"Apr",s:20},{m:"May",s:32},{m:"Jun",s:28},
];
