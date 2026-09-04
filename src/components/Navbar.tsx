import React, { useState } from "react";
import { NavView } from "../types";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  FileText,
  Video,
  Code,
  BarChart3,
  User,
  Sun,
  Moon,
  LogOut,
  Flame,
  Award,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  openAuthModal: (mode: "login" | "register") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openAuthModal,
}) => {
  const {
    user,
    isAuthenticated,
    logout,
    darkMode,
    toggleDarkMode,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [profileDropdownOpen, setProfileDropdownOpen] =
    useState(false);

  const handleNavClick = (view: NavView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView("landing");
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navItem = (
    view: NavView,
    label: string,
    icon: React.ReactNode,
    active: boolean
  ) => (
    <button
      onClick={() => handleNavClick(view)}
      className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      }`}
    >
      {icon}

      <span>{label}</span>

      {active && (
        <span className="absolute left-3 right-3 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600" />
      )}
    </button>
  );

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-slate-200/80
        bg-white/95
        backdrop-blur-xl
        transition-colors
      "
    >
      <div
        className="
          max-w-[1440px]
          mx-auto
          px-4 sm:px-6 lg:px-8
          h-[76px]
          flex items-center
          justify-between
          gap-6
        "
      >

        {/* =====================================================
    BRAND
====================================================== */}
<button
  id="brand-logo"
  onClick={() =>
    handleNavClick(
      isAuthenticated ? "dashboard" : "landing"
    )
  }
  className="
    flex items-center
    cursor-pointer
    select-none
    shrink-0
  "
  aria-label=" home"
>
  <img
    src="logo.jpeg"
    alt="IntervuAI"
    className="w-[150px] h-auto object-contain block"
  />
</button>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav
          className="
            hidden lg:flex
            items-center
            gap-0.5
            flex-1
            justify-center
          "
        >
          {isAuthenticated ? (
            <>
              {navItem(
                "dashboard",
                "Dashboard",
                <LayoutDashboard className="w-[17px] h-[17px]" />,
                currentView === "dashboard"
              )}

              {navItem(
                "interview-setup",
                "Mock Interview",
                <Video className="w-[17px] h-[17px] text-emerald-600" />,
                currentView === "interview-setup" ||
                  currentView === "interview-room"
              )}

              {navItem(
                "resume-analyzer",
                "Resume Lab",
                <FileText className="w-[17px] h-[17px] text-blue-600" />,
                currentView === "resume-analyzer"
              )}

              {navItem(
                "coding-round",
                "Coding Round",
                <Code className="w-[17px] h-[17px] text-amber-500" />,
                currentView === "coding-round"
              )}

              {navItem(
                "analytics",
                "Analytics",
                <BarChart3 className="w-[17px] h-[17px] text-violet-600" />,
                currentView === "analytics"
              )}

              {navItem(
                "challenges",
                "Practice Hub",
                <Award className="w-[17px] h-[17px] text-rose-500" />,
                currentView === "challenges" ||
                  currentView === "flashcards"
              )}
            </>
          ) : (
            <button
              onClick={() => handleNavClick("landing")}
              className="
                px-4 py-2.5
                rounded-xl
                text-sm font-semibold
                text-slate-700
                hover:bg-slate-50
                hover:text-slate-950
                transition-colors
              "
            >
              Home
            </button>
          )}
        </nav>

        {/* =====================================================
            RIGHT CONTROLS
        ====================================================== */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleDarkMode}
            className="
              w-10 h-10
              rounded-xl
              flex items-center justify-center
              text-slate-600
              hover:bg-slate-100
              hover:text-slate-950
              transition-colors
            "
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-[19px] h-[19px] text-amber-400" />
            ) : (
              <Moon className="w-[19px] h-[19px] text-indigo-600" />
            )}
          </button>

          {/* =================================================
              AUTHENTICATED USER
          ================================================== */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                id="user-profile-menu"
                onClick={() =>
                  setProfileDropdownOpen(
                    (previous) => !previous
                  )
                }
                className={`
                  flex items-center gap-2
                  pl-1.5 pr-2 py-1.5
                  rounded-full
                  border
                  transition-all
                  ${
                    profileDropdownOpen
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }
                `}
                aria-expanded={profileDropdownOpen}
              >
                {/* Avatar */}
                <div
                  className="
                    w-9 h-9
                    rounded-full
                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-600
                    flex items-center
                    justify-center
                    text-white
                    font-bold
                    text-sm
                    shadow-sm
                  "
                >
                  {user?.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                {/* Name */}
                <span
                  className="
                    hidden xl:block
                    max-w-[120px]
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  {user?.name || "User"}
                </span>

                <ChevronDown
                  className={`
                    hidden sm:block
                    w-4 h-4
                    text-slate-400
                    transition-transform
                    ${
                      profileDropdownOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================== */}
              {profileDropdownOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    shadow-2xl
                    shadow-slate-900/10
                  "
                >
                  {/* User information */}
                  <div
                    className="
                      px-4 py-4
                      border-b
                      border-slate-100
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-bold
                        text-slate-950
                        truncate
                      "
                    >
                      {user?.name || "User"}
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-500
                        truncate
                        mt-0.5
                      "
                    >
                      {user?.email || ""}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3">
                      <span
                        className="
                          inline-flex
                          items-center gap-1
                          text-[11px]
                          font-bold
                          text-amber-700
                          bg-amber-50
                          border border-amber-100
                          px-2 py-1
                          rounded-full
                        "
                      >
                        <Flame className="w-3 h-3 fill-current" />
                        7 Day Streak
                      </span>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* Profile */}
                    <button
                      id="menu-item-profile"
                      onClick={() =>
                        handleNavClick("profile")
                      }
                      className="
                        w-full
                        text-left
                        px-3 py-2.5
                        rounded-xl
                        text-sm
                        font-medium
                        text-slate-700
                        hover:bg-slate-50
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          w-8 h-8
                          rounded-lg
                          bg-indigo-50
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <User className="w-4 h-4 text-indigo-600" />
                      </span>

                      My Profile & Targets
                    </button>

                    <div className="border-t border-slate-100 my-2" />

                    {/* Logout */}
                    <button
                      id="menu-item-logout"
                      onClick={handleLogout}
                      className="
                        w-full
                        text-left
                        px-3 py-2.5
                        rounded-xl
                        text-sm
                        font-semibold
                        text-rose-600
                        hover:bg-rose-50
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          w-8 h-8
                          rounded-lg
                          bg-rose-50
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <LogOut className="w-4 h-4" />
                      </span>

                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =================================================
               NOT LOGGED IN
            ================================================== */
            <div className="hidden sm:flex items-center gap-2">
              <button
                id="btn-login"
                onClick={() =>
                  openAuthModal("login")
                }
                className="
                  px-4 py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-100
                  transition-colors
                "
              >
                Log In
              </button>

              <button
                id="btn-get-started"
                onClick={() =>
                  openAuthModal("register")
                }
                className="
                  px-4 py-2.5
                  rounded-xl
                  text-sm
                  font-bold
                  text-white
                  bg-gradient-to-r
                  from-indigo-600
                  to-violet-600
                  hover:from-indigo-500
                  hover:to-violet-500
                  shadow-md
                  shadow-indigo-500/20
                  hover:-translate-y-0.5
                  active:translate-y-0
                  transition-all
                "
              >
                Get Started Free
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() =>
              setMobileMenuOpen(
                (previous) => !previous
              )
            }
            className="
              lg:hidden
              w-10 h-10
              rounded-xl
              flex items-center
              justify-center
              text-slate-700
              hover:bg-slate-100
              transition-colors
            "
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}
      {mobileMenuOpen && (
        <div
          className="
            lg:hidden
            border-t
            border-slate-200
            bg-white
          "
        >
          <div
            className="
              max-w-[1440px]
              mx-auto
              px-4 sm:px-6
              py-4
              space-y-1
            "
          >
            {isAuthenticated ? (
              <>
                {[
                  ["dashboard", "Dashboard"],
                  [
                    "interview-setup",
                    "Mock Interview",
                  ],
                  [
                    "resume-analyzer",
                    "Resume Lab",
                  ],
                  [
                    "coding-round",
                    "Coding Round",
                  ],
                  ["analytics", "Analytics"],
                  ["challenges", "Practice Hub"],
                  ["profile", "My Profile"],
                ].map(([view, label]) => (
                  <button
                    key={view}
                    onClick={() =>
                      handleNavClick(
                        view as NavView
                      )
                    }
                    className={`
                      w-full
                      text-left
                      px-4 py-3
                      rounded-xl
                      text-sm
                      font-semibold
                      transition-colors
                      ${
                        currentView === view
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setMobileMenuOpen(false);
                  }}
                  className="
                    w-full
                    text-left
                    px-4 py-3
                    rounded-xl
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:bg-slate-50
                  "
                >
                  Log In
                </button>

                <button
                  onClick={() => {
                    openAuthModal("register");
                    setMobileMenuOpen(false);
                  }}
                  className="
                    w-full
                    text-center
                    px-4 py-3
                    rounded-xl
                    text-sm
                    font-bold
                    text-white
                    bg-gradient-to-r
                    from-indigo-600
                    to-violet-600
                  "
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};