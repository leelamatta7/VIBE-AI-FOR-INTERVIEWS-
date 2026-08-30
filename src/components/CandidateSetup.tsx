import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Briefcase,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  Cpu,
  Layers,
  Code2,
  RefreshCw,
  Zap,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  DollarSign,
  Clock,
  Sparkle,
} from "lucide-react";
import { CandidateProfile, QualificationMatch, InterviewPlan } from "../types";
import { SAMPLE_CANDIDATES } from "../data/sampleCandidates";

interface CandidateSetupProps {
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  qualificationMatch: QualificationMatch | null;
  interviewPlan: InterviewPlan | null;
  isLoadingPlan: boolean;
  onGeneratePlan: () => void;
  onProceedToRoomScan: () => void;
}

export const CandidateSetup: React.FC<CandidateSetupProps> = ({
  profile,
  setProfile,
  qualificationMatch,
  interviewPlan,
  isLoadingPlan,
  onGeneratePlan,
  onProceedToRoomScan,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>("fullstack_senior");
  const [showAdvancedFields, setShowAdvancedFields] = useState<boolean>(true);

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const sample = SAMPLE_CANDIDATES.find((s) => s.id === sampleId);
    if (sample) {
      setProfile(sample.profile);
    }
  };

  const autofillSpecificField = (key: keyof CandidateProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Banner with Professional Polish styling */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 shadow-2xs mb-3 text-xs font-semibold text-[#1a73e8]">
              <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>Step 1: Automated Candidate & Role Alignment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Candidate Profile & Job Qualification
            </h1>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Upload or enter the candidate's resume, contact info, and job description. Every field has 1-click demo autofill options. VIBE AI parses technical skills, evaluates job alignment, and dynamically drafts a customized multilingual interview roadmap.
            </p>
          </div>

          {/* 10-Minute Demo Structure Overview Card */}
          <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 p-4 rounded-xl border border-blue-200/80 shadow-xs shrink-0 md:w-84">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4285F4]" />
                10-Min Demo Interview
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                60m Condensed
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mb-2.5">
              The full technical interview is paced for a high-density 10-minute demo session:
            </p>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-100">
                <span className="font-medium text-gray-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  1. Personal Experience & Projects
                </span>
                <span className="font-mono text-[10px] text-gray-500 font-semibold">~3.5m</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-100">
                <span className="font-medium text-gray-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  2. Live Code Sandbox
                </span>
                <span className="font-mono text-[10px] text-indigo-600 font-semibold">~4.5m</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-100">
                <span className="font-medium text-gray-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  3. Performance Synthesis
                </span>
                <span className="font-mono text-[10px] text-emerald-600 font-semibold">~2.0m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 uppercase tracking-wider">
                <User className="w-4 h-4 text-[#4285F4]" />
                <span>Candidate Personal & Job Details</span>
              </h2>
              <button
                type="button"
                onClick={() => handleSelectSample("fullstack_senior")}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkle className="w-3 h-3 text-blue-500" />
                <span>Autofill All Fields</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Full Name
                  </label>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => autofillSpecificField("name", "Aarav Sharma")}
                      className="px-1.5 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded cursor-pointer"
                    >
                      Aarav
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillSpecificField("name", "Priya Patel")}
                      className="px-1.5 py-0.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded cursor-pointer"
                    >
                      Priya
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              {/* Target Job Role */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Target Job Role
                  </label>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => autofillSpecificField("targetRole", "Senior Full-Stack Software Engineer")}
                      className="px-1.5 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded cursor-pointer"
                    >
                      Full-Stack
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillSpecificField("targetRole", "Lead Frontend Architect")}
                      className="px-1.5 py-0.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded cursor-pointer"
                    >
                      Frontend
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={profile.targetRole}
                  onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Senior Full Stack Engineer"
                />
              </div>
            </div>

            {/* Contact & Personal Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>Phone No.</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => autofillSpecificField("phoneNumber", "+1 (415) 890-2345")}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Demo
                  </button>
                </div>
                <input
                  type="text"
                  value={profile.phoneNumber || ""}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  placeholder="+1 (555) 019-2834"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span>Location</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => autofillSpecificField("location", "San Francisco, CA")}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Demo
                  </button>
                </div>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    <span>Expected Comp.</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => autofillSpecificField("expectedSalary", "$165,000 - $185,000 USD")}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Demo
                  </button>
                </div>
                <input
                  type="text"
                  value={profile.expectedSalary || ""}
                  onChange={(e) => setProfile({ ...profile, expectedSalary: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  placeholder="$160k - $180k"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Years of Experience
                  </label>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => autofillSpecificField("experienceYears", 5)}
                      className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                    >
                      5y
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillSpecificField("experienceYears", 8)}
                      className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                    >
                      8y
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={profile.experienceYears}
                  onChange={(e) =>
                    setProfile({ ...profile, experienceYears: Number(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  min={0}
                  max={40}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Preferred Interview Languages
                  </label>
                  <button
                    type="button"
                    onClick={() => autofillSpecificField("preferredLanguages", ["English", "Hindi"])}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Demo: EN/HI
                  </button>
                </div>
                <input
                  type="text"
                  value={profile.preferredLanguages.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredLanguages: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. English, Hindi, Telugu"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Core Technical Skills
                </label>
                <button
                  type="button"
                  onClick={() => autofillSpecificField("skills", "React, TypeScript, Node.js, GraphQL, PostgreSQL, Docker, AWS")}
                  className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                >
                  Autofill Full Stack Stack
                </button>
              </div>
              <input
                type="text"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. TypeScript, React, Python, Docker, PostgreSQL"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-[#34A853]" />
              <span>Resume Content & Job Description</span>
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">
                  Candidate CV / Resume Text
                </label>
                <button
                  type="button"
                  onClick={() => autofillSpecificField("resumeText", SAMPLE_CANDIDATES[0].profile.resumeText)}
                  className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                >
                  Autofill Sample CV
                </button>
              </div>
              <textarea
                rows={4}
                value={profile.resumeText}
                onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 leading-relaxed"
                placeholder="Paste candidate resume work history and achievements here..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">
                  Job Description & Expectations
                </label>
                <button
                  type="button"
                  onClick={() => autofillSpecificField("jobDescription", SAMPLE_CANDIDATES[0].profile.jobDescription)}
                  className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                >
                  Autofill Sample JD
                </button>
              </div>
              <textarea
                rows={4}
                value={profile.jobDescription}
                onChange={(e) => setProfile({ ...profile, jobDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 leading-relaxed"
                placeholder="Paste role requirements, tech stack, and evaluation criteria..."
              />
            </div>

            <div className="pt-2">
              <button
                onClick={onGeneratePlan}
                disabled={isLoadingPlan}
                className="w-full py-3 px-5 bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoadingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>VIBE AI is parsing qualifications & generating roadmap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Resume & Generate AI Interview Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Generated Roadmap Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Qualification Match Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3 uppercase tracking-wider">
              <span className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-[#EA4335]" />
                <span>Qualification Match</span>
              </span>
              {qualificationMatch && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {qualificationMatch.score}% Match
                </span>
              )}
            </h2>

            {qualificationMatch ? (
              <div className="mt-4 space-y-4">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    AI Candidate Fit Summary
                  </span>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {qualificationMatch.summary}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Matched Competencies ({qualificationMatch.matchedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {qualificationMatch.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {qualificationMatch.missingSkills?.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Skills to Probe in Interview
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {qualificationMatch.missingSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flagged Discrepancies */}
                {qualificationMatch.discrepancies && qualificationMatch.discrepancies.length > 0 && (
                  <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      Flagged Discrepancies vs. Job Description
                    </span>
                    <ul className="space-y-1">
                      {qualificationMatch.discrepancies.map((disc, i) => (
                        <li key={i} className="text-xs text-red-900 flex items-start gap-1.5 leading-snug">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{disc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Clarification during Interview */}
                {qualificationMatch.areasForClarification && qualificationMatch.areasForClarification.length > 0 && (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Areas Requiring Clarification in Interview
                    </span>
                    <ul className="space-y-1">
                      {qualificationMatch.areasForClarification.map((area, i) => (
                        <li key={i} className="text-xs text-amber-950 flex items-start gap-1.5 leading-snug">
                          <span className="text-amber-600 font-bold">→</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 space-y-2">
                <Sparkles className="w-8 h-8 text-gray-300 mx-auto animate-pulse" />
                <p className="text-xs">
                  Click "Analyze Resume" to preview qualification scoring and skill alignments.
                </p>
              </div>
            )}
          </div>

          {/* Generated Plan & Next Step CTA */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#FBBC05]" />
              <span>Interview Roadmap</span>
            </h2>

            {interviewPlan ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-700 block">
                    Planned Assessment Topics
                  </span>
                  {interviewPlan.topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                    >
                      <div className="font-semibold text-gray-900 flex items-center justify-between">
                        <span>
                          {idx + 1}. {t.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-normal">
                          {t.expectedDepth}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 text-[11px]">{t.description}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                  <div className="font-semibold text-[#1a73e8] flex items-center gap-1.5 mb-1">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Live Coding Challenge Prepared:</span>
                  </div>
                  <p className="text-gray-800 font-medium">{interviewPlan.codingChallenge.title}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Difficulty: {interviewPlan.codingChallenge.difficulty} •{" "}
                    {interviewPlan.codingChallenge.testCases.length} automated test cases
                  </p>
                </div>

                <button
                  onClick={onProceedToRoomScan}
                  className="w-full py-3.5 px-5 bg-[#34A853] hover:bg-[#2D9247] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  <span>Proceed to 360° Workspace Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 space-y-2">
                <Layers className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs">Interview topics will be generated based on the resume.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

