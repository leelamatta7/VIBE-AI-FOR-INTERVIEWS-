import React from "react";
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
} from "lucide-react";

interface NavbarProps {
  currentStage: "login" | "setup" | "room_verification" | "interview" | "coding" | "assessment" | "admin";
  onNavigate: (stage: "login" | "setup" | "room_verification" | "interview" | "coding" | "assessment" | "admin") => void;
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
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
      {/* Brand with VIBE AI & Live Badge */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(isAuthenticated ? "setup" : "login")}>
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
            onClick={() => onNavigate("setup")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "setup"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>1. Resume & Match</span>
          </button>

          <button
            onClick={() => onNavigate("room_verification")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "room_verification"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. 360° Scan</span>
          </button>

          <button
            onClick={() => onNavigate("interview")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "interview"
                ? "bg-[#4285F4] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>3. Live Interview</span>
          </button>

          <button
            onClick={() => onNavigate("coding")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "coding"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>4. Code Lab</span>
          </button>

          <button
            onClick={() => onNavigate("assessment")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStage === "assessment"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-rose-500" />
            <span>5. Assessment</span>
          </button>
        </nav>
      )}

      {/* Right Controls: Updates, Language, HR Proctoring, Profile & SignOut */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Updates Changelog Button */}
        <button
          onClick={onOpenUpdates}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          title="View Latest App Updates & Changelog"
        >
          <Bell className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline font-semibold">Updates</span>
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        </button>

        {currentStage !== "login" && (
          <>
            {/* Language selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-[10px] font-bold text-gray-500 uppercase hidden md:inline">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="text-xs font-medium bg-transparent border-none focus:ring-0 cursor-pointer text-gray-800 outline-hidden"
              >
                <option value="Auto Detect">Auto (English/Hindi)</option>
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Spanish">Español (Spanish)</option>
              </select>
            </div>

            {/* HR / Recruiter & Proctoring Dashboard Trigger */}
            <button
              onClick={() => onNavigate("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                currentStage === "admin"
                  ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                  : proctoringFlagsCount > 0
                  ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                  : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              }`}
              title="Open Recruiter Pipeline, Job Role Fit Analyzer & Proctoring Hub"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recruiter Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-white/80 rounded font-mono font-bold">
                {integrityScore}%
              </span>
              {proctoringFlagsCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              )}
            </button>
          </>
        )}

        {/* Beginner Guide Tour Button */}
        <button
          onClick={onOpenHelpTour}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          title="Open Beginner Guide & Feature Overview"
        >
          <HelpCircle className="w-4 h-4 text-[#4285F4]" />
          <span className="hidden md:inline">Guide</span>
        </button>

        {/* Profile Button & User Avatar */}
        {currentStage !== "login" && (
          <div className="flex items-center gap-1.5 pl-1 sm:border-l sm:border-gray-200 sm:pl-2.5">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 hover:bg-gray-100 rounded-xl border border-transparent hover:border-gray-200 transition-all cursor-pointer"
              title="View & Edit Candidate Profile (CV, Phone, Personal Details)"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={candidateName || "Candidate"}
                  className="w-7 h-7 rounded-full object-cover border border-blue-300"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {candidateName ? candidateName.split(" ").map((n) => n[0]).join("") : "AC"}
                </div>
              )}
              <span className="hidden xl:inline text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                {candidateName || "Profile"}
              </span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Sign Out / Switch Persona"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

