import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Video,
  Code2,
  Award,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  Zap,
  CheckCircle2,
  Layers,
  FileText,
  Eye,
  Bot,
  Play,
  RotateCcw,
  Sparkle,
} from "lucide-react";
import { SAMPLE_CANDIDATES } from "../data/sampleCandidates";
import { CandidateProfile } from "../types";

interface AuthLoginPageProps {
  onLoginAsCandidate: (profile: CandidateProfile) => void;
  onLoginAsRecruiter: () => void;
  onQuickStartDemo: () => void;
}

export const AuthLoginPage: React.FC<AuthLoginPageProps> = ({
  onLoginAsCandidate,
  onLoginAsRecruiter,
  onQuickStartDemo,
}) => {
  const [email, setEmail] = useState<string>("aarav.sharma@gemini.ai");
  const [password, setPassword] = useState<string>("VibeAI2026!Demo");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const autofillField = (field: "email" | "password" | "both", sampleKey: "aarav" | "priya" | "rohan" | "recruiter" = "aarav") => {
    if (sampleKey === "recruiter") {
      if (field === "email" || field === "both") setEmail("recruiter@vibeai.tech");
      if (field === "password" || field === "both") setPassword("TalviewAudit2026!");
      setRole("recruiter");
      return;
    }

    const candidateMap = {
      aarav: SAMPLE_CANDIDATES[0].profile,
      priya: SAMPLE_CANDIDATES[1].profile,
      rohan: SAMPLE_CANDIDATES[2].profile,
    };
    const c = candidateMap[sampleKey];
    if (field === "email" || field === "both") setEmail(c.email || "aarav.sharma@gemini.ai");
    if (field === "password" || field === "both") setPassword("VibeAI2026!Demo");
    setRole("candidate");
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "recruiter") {
      onLoginAsRecruiter();
    } else {
      const matched = SAMPLE_CANDIDATES.find(
        (c) => c.profile.email?.toLowerCase() === email.toLowerCase()
      );
      if (matched) {
        onLoginAsCandidate(matched.profile);
      } else {
        onLoginAsCandidate({
          name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Aarav Sharma",
          email: email || "aarav.sharma@gemini.ai",
          phoneNumber: "+1 (555) 349-8821",
          location: "San Francisco, CA",
          targetRole: "Senior Full-Stack Software Engineer",
          experienceYears: 5,
          skills: "React, TypeScript, Node.js, PostgreSQL, Cloud Architecture, Microservices",
          preferredLanguages: ["English", "Hindi"],
          resumeText: "Experienced software engineer with 5 years building scalable web applications and microservices.",
          jobDescription: "Seeking a Senior Full-Stack Engineer with strong TypeScript, React, and backend API design expertise.",
        });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#F8F9FA] to-[#EDF2F7] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Top Banner & VIBE AI Badge */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-xs font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#4285F4]" />
            <span>VIBE AI • Next-Gen Video Interviewer with Talview Proctoring</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-sans">
            Welcome to <span className="text-[#4285F4]">VIBE AI</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            AI powered multilingual interview agent for interviews by vibe coders
          </p>
        </div>

        {/* Main Grid: Left is Login / Demo Cards, Right is Step-by-Step Interactive Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sign In & Demo Credentials (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header and 1-Click Demo Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#4285F4]" />
                  <span>Portal Authentication</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose a demo profile or enter custom credentials with field autofill
                </p>
              </div>

              {/* Fast Track Demo Launcher Button */}
              <button
                type="button"
                onClick={onQuickStartDemo}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4285F4] to-[#3367D6] hover:from-[#3367D6] hover:to-[#2A56C6] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>1-Click Instant Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fast 1-Click Access Cards: Candidate and Recruiter */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Quick Access Portal:
                </label>
                <span className="text-[10px] text-blue-600 font-semibold">Instant Launch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1-Click Candidate Entrance */}
                <button
                  type="button"
                  onClick={() => {
                    autofillField("both", "aarav");
                    onLoginAsCandidate(SAMPLE_CANDIDATES[0].profile);
                  }}
                  className="p-3.5 text-left rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 hover:border-blue-300 transition-all cursor-pointer group relative shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-8 h-8 rounded-lg bg-[#4285F4] text-white text-xs font-bold flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                      Candidate Portal
                    </span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 group-hover:text-blue-700 truncate">
                    Candidate Login (10-Min Demo)
                  </div>
                  <div className="text-[11px] text-gray-600 truncate mt-0.5">
                    Personal Experience • Code Sandbox
                  </div>
                  <div className="text-[10px] text-blue-700 font-mono mt-1 font-semibold truncate flex items-center gap-1">
                    <span>Enter Candidate Session</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Recruiter / Admin Command Center */}
                <button
                  type="button"
                  onClick={() => {
                    autofillField("both", "recruiter");
                    onLoginAsRecruiter();
                  }}
                  className="p-3.5 text-left rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 hover:border-emerald-300 transition-all cursor-pointer group relative shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      Admin Hub
                    </span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 group-hover:text-emerald-800 truncate">
                    Recruiter & Proctoring Admin
                  </div>
                  <div className="text-[11px] text-gray-600 truncate mt-0.5">
                    Candidate Pipeline • Next Candidate Queue
                  </div>
                  <div className="text-[10px] text-emerald-800 font-mono mt-1 font-semibold truncate flex items-center gap-1">
                    <span>Manage Candidate Queue</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Standard Credential Form with Field-by-Field Autofill Options */}
            <form onSubmit={handleCustomLogin} className="space-y-4 pt-2 border-t border-gray-100">
              {/* Role Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === "candidate"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Candidate Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("recruiter");
                    autofillField("both", "recruiter");
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === "recruiter"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Talview Proctoring Admin</span>
                </button>
              </div>

              {/* Email Input with Field-Level Demo Autofill */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-700">Email Address</label>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400">Autofill:</span>
                    <button
                      type="button"
                      onClick={() => autofillField("email", "aarav")}
                      className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium cursor-pointer"
                    >
                      Aarav
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillField("email", "priya")}
                      className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded font-medium cursor-pointer"
                    >
                      Priya
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillField("email", "recruiter")}
                      className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-medium cursor-pointer"
                    >
                      Recruiter
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              {/* Password Input with Field-Level Demo Autofill */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => autofillField("password", "aarav")}
                    className="text-[10px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Sparkle className="w-2.5 h-2.5 text-blue-500" />
                    <span>Autofill Demo Password</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono"
                  />
                </div>
              </div>

              {/* 1-Click Autofill All Credentials Bar */}
              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-center justify-between">
                <span className="text-[11px] text-blue-800 font-medium">Need demo login data?</span>
                <button
                  type="button"
                  onClick={() => autofillField("both", "aarav")}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Autofill Demo Credentials
                </button>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Save session on this device</span>
                </label>
                <span className="text-gray-500 text-[11px]">Instant Local Session</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In as {role === "candidate" ? "Candidate" : "Talview Recruiter"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Step-by-Step Process Roadmap (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Layers className="w-4 h-4 text-[#4285F4]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Step-by-Step VIBE AI Roadmap
                </h3>
              </div>

              <div className="space-y-3.5">
                {/* Step 1 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Resume & Discrepancy Matching</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Extract skills, calculate JD qualification match (0-100%), and formulate targeted probe areas.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>360° Workspace Verification</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-semibold">
                        Fast Track
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Scan 5 workspace angles or use 1-click Fast Track auto-verification.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
                  <div className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      <span>Live Video & Audio Interview</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded font-semibold">
                        REC
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Multilingual speech recognition, live subtitles, start/stop recording, and silent Talview gaze/proximity tracking.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Live Algorithmic Coding Sandbox</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Solve coding challenges in JS/Python, run test suites, and receive AI complexity feedback.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    5
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Structured Report & Silent Observations</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Highlighted silent observations, competency matrix, printable PDF export, and full audit logs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Help Note */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-xs text-gray-700">
                <span className="font-bold text-gray-900">VIBE AI Tip:</span> Click{" "}
                <strong className="text-blue-700">"1-Click Instant Demo"</strong> to automatically populate candidate credentials, run the qualification plan, and jump right into the live conversational video room!
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

