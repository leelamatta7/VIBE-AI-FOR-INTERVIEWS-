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
  Phone,
  MapPin,
  Globe,
  Clock,
  Check,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { CandidateProfile, QualificationMatch, InterviewPlan, CompanyJobRole } from "../types";

interface CandidateSetupProps {
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  qualificationMatch: QualificationMatch | null;
  interviewPlan: InterviewPlan | null;
  isLoadingPlan: boolean;
  onGeneratePlan: () => void;
  onProceedToRoomScan: () => void;
  onBackToRoles?: () => void;
  onBackToRolesCatalog?: () => void;
  selectedRoleObj?: CompanyJobRole | null;
}

export const CandidateSetup: React.FC<CandidateSetupProps> = ({
  profile,
  setProfile,
  qualificationMatch,
  interviewPlan,
  isLoadingPlan,
  onGeneratePlan,
  onProceedToRoomScan,
  onBackToRoles,
  onBackToRolesCatalog,
  selectedRoleObj,
}) => {
  const handleBack = onBackToRoles || onBackToRolesCatalog;
  const [showAdvancedFields, setShowAdvancedFields] = useState<boolean>(false);
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // File Upload Handler (PDF, DOCX, TXT)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setUploadSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setProfile((prev) => ({
          ...prev,
          resumeText: text.slice(0, 5000),
        }));
        setUploadSuccessMsg(`Parsed "${file.name}" (${Math.round(file.size / 1024)} KB) successfully into resume field!`);
      }
      setIsParsingResume(false);
    };

    reader.onerror = () => {
      setIsParsingResume(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* Top Banner with prominent Selected Company and Role */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-3">
              {handleBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Browse Other Roles</span>
                </button>
              )}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 shadow-2xs text-xs font-semibold text-[#1a73e8]">
                <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>Step 2 of 4 • Candidate Details & Resume Submission</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Candidate Profile & Resume Verification
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Enter your candidate details, target role, and CV/Resume. VIBE AI will analyze your technical background against the company job description and tailor your interview challenge.
            </p>
          </div>

          {/* Selected Company & Role Card */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 p-4 rounded-xl border border-blue-200 shadow-xs shrink-0 md:w-88 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Applying For:</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                Target Role
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{profile.targetCompany || selectedRoleObj?.companyName || "Tech Enterprise"}</span>
              </div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                {profile.targetRole || selectedRoleObj?.title || "Full Stack Software Engineer"}
              </div>
            </div>
            {selectedRoleObj?.location && (
              <div className="text-[11px] text-gray-500 flex items-center gap-1 pt-1 border-t border-blue-100">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{selectedRoleObj.location}</span>
                {selectedRoleObj.salaryRange && (
                  <span className="text-emerald-700 font-semibold ml-auto">{selectedRoleObj.salaryRange}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidate Profile & Experience (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 uppercase tracking-wider">
                <User className="w-4 h-4 text-[#4285F4]" />
                <span>Candidate Personal & Experience Profile</span>
              </h2>
              <span className="text-[11px] text-blue-600 font-semibold">
                {profile.email || "leelamatta7@gmail.com"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Candidate Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Leela Matta"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="leelamatta7@gmail.com"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Target Job Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Technical Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.targetRole}
                  onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                  placeholder="e.g. Senior Full-Stack Cloud Engineer"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                />
              </div>

              {/* Target Company */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Company Name
                </label>
                <input
                  type="text"
                  value={profile.targetCompany || ""}
                  onChange={(e) => setProfile({ ...profile, targetCompany: e.target.value })}
                  placeholder="e.g. Google Cloud"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                />
              </div>

              {/* Years of Experience */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Years of Professional Experience:</span>
                  <span className="text-blue-600 font-bold font-mono">{profile.experienceYears} Years</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={profile.experienceYears}
                  onChange={(e) => setProfile({ ...profile, experienceYears: parseInt(e.target.value) || 0 })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>0 (Junior/Entry)</span>
                  <span>5 (Mid/Senior)</span>
                  <span>10+ (Staff/Lead)</span>
                </div>
              </div>
            </div>

            {/* Core Skills Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                placeholder="TypeScript, React, Node.js, Express, PostgreSQL, Redis, Docker, System Design"
                className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono"
              />
            </div>

            {/* Resume Content & File Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700">
                  Candidate CV / Resume Details <span className="text-red-500">*</span>
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors border border-blue-200 shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isParsingResume ? "Parsing..." : "Upload Resume (TXT / PDF / DOCX)"}</span>
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              <textarea
                rows={6}
                value={profile.resumeText}
                onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
                placeholder="Enter or paste your candidate CV / resume content, projects, experience, education, and technical architecture highlights here..."
                className="w-full px-3.5 py-3 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 leading-relaxed font-sans"
              />
            </div>

            {/* Target Job Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Target Company Job Description & Role Requirements
              </label>
              <textarea
                rows={5}
                value={profile.jobDescription}
                onChange={(e) => setProfile({ ...profile, jobDescription: e.target.value })}
                placeholder="Job description details used to evaluate qualification match and generate tailored interview probes..."
                className="w-full px-3.5 py-3 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 leading-relaxed font-mono"
              />
            </div>

            {/* Advanced Fields Toggle */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showAdvancedFields ? "Hide" : "Show"} Optional Contact, Location & Portfolio Links</span>
              </button>

              {showAdvancedFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profile.phoneNumber || ""}
                      onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                      placeholder="+1 (555) 728-1904"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location || ""}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="San Francisco, CA / Remote"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-gray-400" />
                      LinkedIn / GitHub URL
                    </label>
                    <input
                      type="text"
                      value={profile.linkedInUrl || profile.githubUrl || ""}
                      onChange={(e) => setProfile({ ...profile, linkedInUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white text-gray-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onGeneratePlan}
                disabled={isLoadingPlan || !profile.name.trim() || !profile.resumeText.trim()}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoadingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Resume with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Match & Generate AI Interview Plan</span>
                  </>
                )}
              </button>

              {interviewPlan && (
                <button
                  type="button"
                  onClick={onProceedToRoomScan}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>Select Camera & 360° Scan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Plan & Qualification Fit Feedback (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Qualification Fit Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-[#4285F4]" />
                <span>Qualification Fit Analysis</span>
              </h2>
              {qualificationMatch && (
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold font-mono">
                  {qualificationMatch.score}% Match
                </span>
              )}
            </div>

            {qualificationMatch ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-gray-700">
                    <span>JD Requirement Alignment</span>
                    <span className="font-mono text-blue-700">{qualificationMatch.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        qualificationMatch.score >= 80
                          ? "bg-emerald-500"
                          : qualificationMatch.score >= 60
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${qualificationMatch.score}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {qualificationMatch.summary}
                </p>

                {/* Matched Skills */}
                <div>
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Verified Matched Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {qualificationMatch.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Probe Areas */}
                {qualificationMatch.areasForClarification && qualificationMatch.areasForClarification.length > 0 && (
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                      Live Interview Probe Focus:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-blue-950 space-y-1">
                      {qualificationMatch.areasForClarification.map((area, idx) => (
                        <li key={idx} className="leading-snug">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-xs text-gray-500">
                  Fill your resume and click <strong>"Analyze Match & Generate AI Interview Plan"</strong> to evaluate qualification fit.
                </p>
              </div>
            )}
          </div>

          {/* Interview Topics & Live Code Preview */}
          {interviewPlan && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-[#4285F4]" />
                  <span>Customized Technical Topics</span>
                </h2>
                <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
                  {interviewPlan.difficulty}
                </span>
              </div>

              <div className="space-y-2.5">
                {interviewPlan.topics.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                    <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
                      <span>{t.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">Topic {idx + 1}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">{t.description}</p>
                  </div>
                ))}
              </div>

              {interviewPlan.codingChallenge && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                      {interviewPlan.codingChallenge.title}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      {interviewPlan.codingChallenge.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-950 line-clamp-2 leading-relaxed">
                    {interviewPlan.codingChallenge.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
