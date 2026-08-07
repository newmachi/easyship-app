// @ts-nocheck
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";

import { auth, db } from "./firebase";
import { EJS_SVC, EJS_TPL, EJS_KEY } from "./constants";
import { LoadingScreen } from "./components/Helpers";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [page, setPage] = useState("loading");
  const [authMode, setAuthMode] = useState("login");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Load testimonials for landing page
    const loadTestimonials = async () => {
      try {
        const snap = await getDocs(collection(db, "testimonials"));
        setTestimonials(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
    };
    loadTestimonials();

    // Firebase auth state listener
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const profile = { id: user.uid, ...userDoc.data() };
            setUserProfile(profile);
            setFirebaseUser(user);
            setPage(profile.role === "admin" ? "admin" : "customer");
          } else {
            setPage("auth");
          }
        } catch (e) {
          console.error(e);
          setPage("auth");
        }
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
        setPage("landing");
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) { console.error(e); return false; }
  };

  const handleRegister = async ({ name, email, password, phone, company, promoEmails }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Change this email to whichever address should get admin access
      const role = email === "mavalour.mc@gmail.com" ? "admin" : "user";
      const data = {
        name, email, phone: phone || "", company: company || "", role,
        joined: new Date().toLocaleDateString("en-US", { month:"short", year:"numeric" }),
        active: true, promoEmails,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", cred.user.uid), data);
      // Send welcome email (non-blocking — registration still succeeds if this fails)
      try {
        await emailjs.send(EJS_SVC, EJS_TPL, {
          from_name: name,
          from_email: email,
          message: `Welcome to EasyShip, ${name}! 🚀\n\nYour account has been created successfully.\n\nYou can now:\n• Book local, national & international shipments\n• Track your packages in real-time\n• Pay securely via Paystack\n\nShip Smarter. Grow Faster.\n— The EasyShip Team`,
        }, EJS_KEY);
      } catch (emailErr) { console.error("Email error:", emailErr); }
      return true;
    } catch (e) { console.error(e); return false; }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setPage("landing");
  };

  const goAuth = (mode) => { setAuthMode(mode); setPage("auth"); };

  if (page === "loading")  return <LoadingScreen />;
  if (page === "landing")  return <LandingPage onNav={goAuth} testimonials={testimonials} />;
  if (page === "auth")     return <AuthPage mode={authMode} setMode={setAuthMode} onLogin={handleLogin} onRegister={handleRegister} onBack={() => setPage("landing")} />;
  if (page === "customer") return <CustomerDashboard firebaseUser={firebaseUser} userProfile={userProfile} onLogout={handleLogout} />;
  if (page === "admin")    return <AdminDashboard onLogout={handleLogout} />;
  return null;
}
