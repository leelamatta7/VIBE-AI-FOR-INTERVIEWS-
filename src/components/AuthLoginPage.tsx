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
  KeyRound,
  Building2,
  Briefcase,
  Users,
  Eye,
  Send,
  Info,
  ShieldAlert,
} from "lucide-react";
import { DEFAULT_CANDIDATE_PROFILE } from "../data/sampleCandidates";
import { CandidateProfile } from "../types";

interface AuthLoginPageProps {
  onLoginAsCandidate: (profile: CandidateProfile) => void;
  onLoginAsRecruiter: () => void;
  onQuickStartDemo?: () => void;
}

export const AuthLoginPage: React.FC<AuthLoginPageProps> = ({
  onLoginAsCandidate,
  onLoginAsRecruiter,
  onQuickStartDemo,
}) => {
  // Candidate form state
  const [candidateEmail, setCandidateEmail] = useState<string>("leelamatta7@gmail.com");
  const [candidatePassword, setCandidatePassword] = useState<string>("12345678");
  const [candidateRememberMe, setCandidateRememberMe] = useState<boolean>(true);
  const [candidateAuthError, setCandidateAuthError] = useState<string | null>(null);

  // Recruiter form state
  const [recruiterEmail, setRecruiterEmail] = useState<string>("recruiter@enterprise.com");
  const [recruiterPassword, setRecruiterPassword] = useState<string>("recruiter2026");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("Google Cloud");
  const [recruiterAuthError, setRecruiterAuthError] = useState<string | null>(null);

  // Auto-fill helpers
  const handleFillCandidateCredentials = () => {
    setCandidateEmail("leelamatta7@gmail.com");
    setCandidatePassword("12345678");
    setCandidateAuthError(null);
  };

  const handleFillRecruiterCredentials = () => {
    setRecruiterEmail("recruiter@enterprise.com");
    setRecruiterPassword("recruiter2026");
    setSelectedOrganization("Google Cloud");
    setRecruiterAuthError(null);
  };

  // Candidate submit handler
  const handleCandidateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidateAuthError(null);

    if (candidateEmail.trim().toLowerCase() === "leelamatta7@gmail.com" && candidatePassword === "12345678") {
      onLoginAsCandidate({
        ...DEFAULT_CANDIDATE_PROFILE,
        name: "Leela Matta",
        email: "leelamatta7@gmail.com",
        targetRole: "Senior Full-Stack Cloud Engineer",
        targetCompany: "Google Cloud",
        resumeText: "", // Keep clean so candidate uploads/pastes their real CV
        skills: "TypeScript, React, Node.js, PostgreSQL, Distributed Systems",
      });
    } else if (candidateEmail.trim() && candidatePassword.length >= 6) {
      const derivedName =
        candidateEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Candidate";
      onLoginAsCandidate({
        ...DEFAULT_CANDIDATE_PROFILE,
        name: derivedName,
        email: candidateEmail.trim(),
        resumeText: "",
      });
    } else {
      setCandidateAuthError("Invalid credentials. Please enter email: leelamatta7@gmail.com and password: 12345678");
    }
  };

  // Recruiter submit handler
  const handleRecruiterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRecruiterAuthError(null);

    if (
      (recruiterEmail.trim().toLowerCase() === "recruiter@enterprise.com" && recruiterPassword === "recruiter2026") ||
      (recruiterEmail.trim() && recruiterPassword.length >= 6)
    ) {
      onLoginAsRecruiter();
    } else {
      setRecruiterAuthError("Invalid recruiter credentials. Enter email: recruiter@enterprise.com and password: recruiter2026");
    }
  };

  const handleLaunchDemo = () => {
    if (onQuickStartDemo) {
      onQuickStartDemo();
    } else {
      onLoginAsCandidate({
        ...DEFAULT_CANDIDATE_PROFILE,
        name: "Leela Matta",
        email: "leelamatta7@gmail.com",
        targetRole: "Senior Full-Stack Cloud Engineer",
        targetCompany: "Google Cloud",
        resumeText: "",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#F8F9FA] via-[#F1F5F9] to-[#EDF2F7] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Top Header & Platform Badge */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-xs font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#4285F4]" />
            <span>VIBE AI • Autonomous Technical Interview & Hiring Platform</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-sans">
            Authentication <span className="text-[#4285F4]">Portal</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Choose your portal below: sign in as a <strong>Candidate</strong> to browse open roles and take the AI interview, or as a <strong>Recruiter</strong> to manage job requisitions and candidate assessments.
          </p>
        </div>

        {/* Main Side-by-Side Grid: Candidate Sign In (Left) and Recruiter Sign In (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* ================= LEFT CARD: CANDIDATE SIGN IN ================= */}
          <div className="bg-white rounded-3xl border-2 border-blue-100/90 shadow-md p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] to-[#6366F1]" />

            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-blue-200">
                    <UserCheck className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span>Candidate Access</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Candidate Sign In</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Browse company job roles, submit your CV & take the interview
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#4285F4] to-[#3367D6] hover:from-[#3367D6] hover:to-[#2A56C6] text-white text-[11px] font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>Quick Start</span>
                </button>
              </div>

              {/* Candidate Credentials Callout */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900">Demo Candidate Credentials</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillCandidateCredentials}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 px-2.5 py-0.5 bg-white border border-blue-200 rounded-md shadow-2xs cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    Auto-Fill
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 p-2 bg-white/90 rounded-lg border border-blue-100 text-gray-800">
                    <span className="text-gray-400 font-sans font-medium text-[10px]">Email:</span>
                    <strong className="text-blue-700 font-semibold truncate text-[11px]">leelamatta7@gmail.com</strong>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-white/90 rounded-lg border border-blue-100 text-gray-800">
                    <span className="text-gray-400 font-sans font-medium text-[10px]">Password:</span>
                    <strong className="text-blue-700 font-semibold text-[11px]">12345678</strong>
                  </div>
                </div>
              </div>

              {/* Candidate Form */}
              <form onSubmit={handleCandidateLogin} className="space-y-4">
                {candidateAuthError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{candidateAuthError}</span>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Candidate Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      required
                      placeholder="leelamatta7@gmail.com"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={candidatePassword}
                      onChange={(e) => setCandidatePassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={candidateRememberMe}
                      onChange={(e) => setCandidateRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember candidate session</span>
                  </label>
                  <span className="text-gray-400 text-[11px]">Secure SSL</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In as Candidate & Explore Roles</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>

            {/* Candidate Workflow Perks */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Candidate Pipeline Features
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Company Roles Catalog</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Resume PDF/TXT Parsing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Camera Choice & 360° Scan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Interactive Coding Sandbox</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT CARD: RECRUITER SIGN IN ================= */}
          <div className="bg-white rounded-3xl border-2 border-purple-100/90 shadow-md p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-800" />

            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-purple-200">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Recruiter & Proctor Access</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recruiter Sign In</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage job requisitions, evaluate candidate assessments & dispatch decisions
                  </p>
                </div>

                <span className="px-2.5 py-1 bg-purple-100/70 text-purple-800 text-[10px] font-bold rounded-lg font-mono shrink-0">
                  ADMIN HUB
                </span>
              </div>

              {/* Recruiter Credentials Callout */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-bold text-purple-900">Demo Recruiter Credentials</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillRecruiterCredentials}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 px-2.5 py-0.5 bg-white border border-purple-200 rounded-md shadow-2xs cursor-pointer hover:bg-purple-50 transition-colors"
                  >
                    Auto-Fill
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 p-2 bg-white/90 rounded-lg border border-purple-100 text-gray-800">
                    <span className="text-gray-400 font-sans font-medium text-[10px]">Email:</span>
                    <strong className="text-purple-700 font-semibold truncate text-[11px]">recruiter@enterprise.com</strong>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-white/90 rounded-lg border border-purple-100 text-gray-800">
                    <span className="text-gray-400 font-sans font-medium text-[10px]">Password:</span>
                    <strong className="text-purple-700 font-semibold text-[11px]">recruiter2026</strong>
                  </div>
                </div>
              </div>

              {/* Recruiter Form */}
              <form onSubmit={handleRecruiterLogin} className="space-y-4">
                {recruiterAuthError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{recruiterAuthError}</span>
                  </div>
                )}

                {/* Organization Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Company / Organization</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedOrganization}
                      onChange={(e) => setSelectedOrganization(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 cursor-pointer"
                    >
                      <option value="Google Cloud">Google Cloud</option>
                      <option value="Stripe">Stripe</option>
                      <option value="OpenAI">OpenAI</option>
                      <option value="Microsoft Azure">Microsoft Azure</option>
                      <option value="Tech Enterprise">Tech Enterprise</option>
                    </select>
                  </div>
                </div>

                {/* Recruiter Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Recruiter Work Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      required
                      placeholder="recruiter@enterprise.com"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Recruiter Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={recruiterPassword}
                      onChange={(e) => setRecruiterPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 font-mono"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In as Recruiter & Open Operations Hub</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>

            {/* Recruiter Workflow Perks */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Recruiter Hub Capabilities
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Job Requisition Publisher</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Applicant Assessment Queue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Fit / Unfit Decision Flow</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Live Proctoring Violation Audit</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Global Security & Multi-Role Banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 block">Talview High-Trust Autonomous Assessment Protocol</span>
              <span className="text-gray-500 text-[11px]">
                End-to-end encrypted biometric telemetry, dual-perspective proctoring & Gemini Multimodal AI evaluation.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-gray-500">
            <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">Version 2.4.0</span>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-semibold">
              Live & Operational
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
