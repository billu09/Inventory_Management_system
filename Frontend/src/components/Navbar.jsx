import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../stores/slices/authSlice";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  /* ================= AUTH STATE ================= */
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "Guest";

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());          // ✅ clear redux + localStorage
    setMenuOpen(false);
    navigate("/login");
  };

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  /* ================= ANIMATION ================= */
  const container = {
    hidden: { opacity: 0, y: -4, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.12, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -4,
      scale: 0.98,
      transition: { duration: 0.1, ease: "easeIn" },
    },
  };

  return (
    <nav className="w-full px-6 py-4 shadow-md bg-gradient-to-r from-gray-900 to-gray-700 text-white flex justify-between items-center">
      {/* ===== LOGO ===== */}
      <Link to="/" className="text-2xl font-extrabold tracking-wide">
        <span className="text-white">Inventory</span>
        <span className="text-yellow-400">Pro</span>
      </Link>

      {/* ===== RIGHT SIDE ===== */}
      {!user ? (
        /* ===== NOT LOGGED IN ===== */
        <Link
          to="/login"
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Login
        </Link>
      ) : (
        /* ===== LOGGED IN ===== */
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="text-3xl hover:text-yellow-300 transition"
          >
            <FaUserCircle />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-3 z-50"
                style={{ transformOrigin: "top right" }}
              >
                <div className="px-4 pb-2 border-b border-gray-200">
                  <p className="font-semibold text-sm">Signed in as</p>
                  <p className="text-xs text-gray-600 capitalize">{role}</p>
                </div>

                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </nav>
  );
}
