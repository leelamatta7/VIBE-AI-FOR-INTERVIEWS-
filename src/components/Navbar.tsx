import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Globe,
  HelpCircle,
  Video,
  Award,
  Layers,
  Code2,
  User,
  LogOut,
  FileText,
  Bell,
  Sliders,
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Mail,
} from "lucide-react";
import { CandidateNotification } from "../types";

interface NavbarProps {
  currentStage:
    | "login"
    | "role_selection"
    | "setup"
    | "room_verification"
    | "interview"
    | "coding"
    | "assessment"
    | "admin";
  onNavigate: (
    stage:
      | "login"
      | "role_selection"
      | "setup"
      | "room_verification"
      | "interview"
      | "coding"
      | "assessment"
      | "admin"
  ) => void;
  onOpenHelpTour: () => void;
  onOpenProfile: () => void;
  onOpenUpdates: () => void;
  integrityScore: number;
  proctoringFlagsCount: number;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  candidateName?: string;
  avatarUrl?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  notifications?: CandidateNotification[];
  onMarkNotificationRead?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onNavigate,
  onOpenHelpTour,
  onOpenProfile,
  onOpenUpdates,
  integrityScore,
  proctoringFlagsCount,
  selectedLanguage,
  onLanguageChange,
  candidateName,
  avatarUrl,
  isAuthenticated = true,
  onLogout,
  notifications = [],
  onMarkNotificationRead,
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
      {/* Brand with VIBE AI & Live Badge */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onNavigate(isAuthenticated ? "role_selection" : "login")}
      >
        <div className="w-9 h-9 bg-gradient-to-tr from-[#4285F4] via-[#6366F1] to-[#9B51E0] rounded-xl shadow-xs flex items-center justify-center text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none font-sans flex items-center gap-1">
              VIBE <span className="text-[#4285F4] font-black">AI</span>
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
              By Vibe Coders
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200 uppercase tracking-wider">
            Talview Proctored
          </span>
        </div>
      </div>

      {/* Center Stages Navigation (shown when authenticated) */}
      {currentStage !== "login" && (
        <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/80">
          <button
            onClick={() => onNavigate("role_selection")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "role_selection"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>1. Company Roles</span>
          </button>

          <button
            onClick={() => onNavigate("setup")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "setup"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>2. Candidate CV</span>
          </button>

          <button
            onClick={() => onNavigate("room_verification")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "room_verification"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Camera & 360° Scan</span>
          </button>

          <button
            onClick={() => onNavigate("interview")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "interview"
                ? "bg-[#4285F4] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>4. Live Interview</span>
          </button>

          <button
            onClick={() => onNavigate("coding")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "coding"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-600" />
            <span>5. Code Lab</span>
          </button>

          <button
            onClick={() => onNavigate("assessment")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "assessment"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-rose-500" />
            <span>6. Assessment</span>
          </button>
        </nav>
      )}

      {/* Right Controls: Notifications, Updates, Language, Recruiter Hub & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Candidate Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Candidate Recruitment Notifications"
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer relative"
          >
            <Bell className="w-4 h-4 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span>Recruiter Decisions & Notifications</span>
                </span>
                <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                  {notifications.length} Total
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    No notifications yet. Recruiter decisions and offer letters will appear here.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead && onMarkNotificationRead(notif.id)}
                      className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                        notif.status === "fit_offer"
                          ? "bg-emerald-50/70 border-emerald-200"
                          : notif.status === "unfit_rejected"
                          ? "bg-rose-50/70 border-rose-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900 flex items-center gap-1">
                          {notif.status === "fit_offer" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative hidden md:flex items-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Auto Detect">Auto Detect</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
            </select>
          </div>
        </div>

        {/* User Profile Avatar */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="Open Profile Settings"
        >
          <img
            src={avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
            alt={candidateName || "User"}
            className="w-8 h-8 rounded-xl object-cover border border-gray-200 shadow-2xs group-hover:border-blue-500 transition-colors"
          />
        </div>

        {/* Logout Button */}
        {isAuthenticated && onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
