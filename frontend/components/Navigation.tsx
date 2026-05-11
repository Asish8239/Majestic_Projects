"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Home, Sparkles, History, LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/generator", label: "Generator", icon: <Sparkles className="w-5 h-5" /> },
    { href: "/history", label: "History", icon: <History className="w-5 h-5" /> },
  ];

  // Add dashboard for authenticated users
  const authenticatedNavItems = session
    ? [
        { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        ...navItems,
      ]
    : navItems;

  return (
    <nav className="sticky top-0 z-50 glass dark:glass-dark border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              Majestic Projects
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {authenticatedNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20"
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 transition-all ml-2"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.button>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="ml-2 px-4 py-2 rounded-lg bg-white/20 dark:bg-black/20 animate-pulse">
                <div className="w-20 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ) : session ? (
              <div className="relative ml-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-all"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {session.user.name?.[0] || session.user.email?.[0] || "U"}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user.name || session.user.email}
                  </span>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass dark:glass-dark rounded-lg shadow-xl border border-white/20 overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-white/20">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-2 px-3 py-2 hover:bg-white/20 dark:hover:bg-black/20 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-2 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
