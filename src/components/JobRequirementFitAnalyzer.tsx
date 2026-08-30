import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Briefcase,
  TrendingUp,
  Brain,
  Sliders,
  Check,
  Send,
  RefreshCw,
  Award,
  Zap,
  HelpCircle,
} from "lucide-react";
import { ApplicantRecord, CompanyJobRole, JobFitAnalysisResult, ApplicantDecision } from "../types";
import { analyzeJobFit } from "../services/api";

interface JobRequirementFitAnalyzerProps {
  applicants: ApplicantRecord[];
  jobRoles: CompanyJobRole[];
  selectedApplicantForAnalysis?: ApplicantRecord | null;
  selectedJobRoleForAnalysis?: CompanyJobRole | null;
  onUpdateDecision: (applicantId: string, decision: ApplicantDecision, notes?: string) => void;
}

export const JobRequirementFitAnalyzer: React.FC<JobRequirementFitAnalyzerProps> = ({
  applicants,
  jobRoles,
  selectedApplicantForAnalysis,
  selectedJobRoleForAnalysis,
  onUpdateDecision,
}) => {
  // Selected Applicant
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(
    selectedApplicantForAnalysis?.id || applicants[0]?.id || ""
  );

  // Selected Role or Custom JD
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    selectedJobRoleForAnalysis?.id || jobRoles[0]?.id || "custom"
  );

  const [customJobTitle, setCustomJobTitle] = useState<string>("Senior Cloud Architect");
  const [customJobDescription, setCustomJobDescription] = useState<string>(
    `We are seeking a Senior Cloud Architect to lead our multi-region Kubernetes platform.
Requirements:
- 5+ years building distributed cloud infrastructure with Kubernetes, Terraform, and GCP.
- Deep expertise in high-concurrency microservices, network security, and zero-trust IAM.
- Experience with real-time observability, SLO tracking with Prometheus, and incident response.`
  );

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<JobFitAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Synchronize when incoming props change
  useEffect(() => {
    if (selectedApplicantForAnalysis) {
      setSelectedApplicantId(selectedApplicantForAnalysis.id);
    }
  }, [selectedApplicantForAnalysis]);

  useEffect(() => {
    if (selectedJobRoleForAnalysis) {
      setSelectedRoleId(selectedJobRoleForAnalysis.id);
    }
  }, [selectedJobRoleForAnalysis]);

  const activeApplicant = applicants.find((a) => a.id === selectedApplicantId) || applicants[0];
  const activeJobRole = jobRoles.find((r) => r.id === selectedRoleId);

  const handleRunAIAnalysis = async () => {
    if (!activeApplicant) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const targetRoleTitle =
        selectedRoleId === "custom" ? customJobTitle : activeJobRole?.title || "Target Role";

      const targetJD =
        selectedRoleId === "custom" ? customJobDescription : activeJobRole?.jobDescription || "";

      const result = await analyzeJobFit({
        candidateProfile: {
          name: activeApplicant.name,
          targetRole: activeApplicant.targetRoleName,
          skills: activeApplicant.skills.join(", "),
          experienceYears: activeApplicant.experienceYears,
          resumeText: activeApplicant.resumeSummary,
        },
        jobRole: {
          title: targetRoleTitle,
          department: activeJobRole?.department || "Engineering",
          experienceRequired: activeJobRole?.experienceRequired || "4+ Years",
          skillsRequired: activeJobRole?.skillsRequired || ["Engineering"],
          jobDescription: targetJD,
        },
      });

      setAnalysisResult(result);
    } catch (err: any) {
      console.error("AI Analysis error:", err);
      setAnalysisError(err.message || "Failed to analyze requirement match with VIBE AI Agent.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-700 mb-2 text-xs font-semibold text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Autonomous AI Hiring & Job Description Gap Analyzer</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            AI-Powered Candidate vs Company Requirement Fit Intelligence
          </h2>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            The VIBE AI Agent performs deep semantic parsing across the candidate&apos;s interview evidence, resume, and specific company job description to evaluate exact requirement compliance.
          </p>
        </div>

        <button
          onClick={handleRunAIAnalysis}
          disabled={isAnalyzing}
          className="px-5 py-3 bg-[#4285F4] hover:bg-[#3367D6] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Requirements with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run AI Agent Fit Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Candidate & Job Role Selector Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Candidate Selector */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Select Interviewed Candidate</span>
            </label>
            <span className="text-[10px] text-gray-400 font-mono">
              {applicants.length} Candidates in Pipeline
            </span>
          </div>

          <select
            value={selectedApplicantId}
            onChange={(e) => setSelectedApplicantId(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {applicants.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name} — {app.targetRoleName} ({app.experienceYears}y exp • {app.matchPercentage}% met)
              </option>
            ))}
          </select>

          {activeApplicant && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{activeApplicant.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold">
                  Status: {activeApplicant.decision.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] line-clamp-2">
                {activeApplicant.resumeSummary}
              </p>
              <div className="flex flex-wrap gap-1">
                {activeApplicant.skills.slice(0, 5).map((s, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Company Job Role / JD Selector */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Select Company Job Description (JD)</span>
            </label>
            <span className="text-[10px] text-gray-400 font-mono">
              {jobRoles.length} Active Company Roles
            </span>
          </div>

          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {jobRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} ({role.department} • Exp: {role.experienceRequired})
              </option>
            ))}
            <option value="custom">✏️ Custom Paste Job Description</option>
          </select>

          {selectedRoleId === "custom" ? (
            <div className="space-y-2">
              <input
                type="text"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                placeholder="Custom Job Title..."
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900"
              />
              <textarea
                rows={3}
                value={customJobDescription}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                placeholder="Paste custom requirements..."
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-mono text-gray-800"
              />
            </div>
          ) : (
            activeJobRole && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>{activeJobRole.title}</span>
                  <span className="text-purple-700 text-[10px]">{activeJobRole.department}</span>
                </div>
                <p className="text-gray-600 text-[11px] line-clamp-2">
                  {activeJobRole.jobDescription}
                </p>
                <span className="text-[10px] text-gray-400 font-mono block">
                  Required: {activeJobRole.skillsRequired.join(", ")}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {analysisError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{analysisError}</span>
        </div>
      )}

      {/* 3. AI Fit Analysis Results Output */}
      {analysisResult ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95">
          {/* Output Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                  {analysisResult.fitLevel}
                </span>
                <span className="text-xs text-gray-500">
                  Target Role: <strong className="text-gray-900">{analysisResult.roleTitle}</strong>
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Evaluation for {analysisResult.candidateName}
              </h3>
            </div>

            {/* Match Percentage Dial */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Requirements Met
                </span>
                <span className="text-2xl font-bold font-mono text-[#4285F4]">
                  {analysisResult.matchPercentage}%
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* AI Executive Summary Card */}
          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-1.5 text-xs text-gray-800">
            <span className="font-bold text-blue-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Brain className="w-4 h-4 text-blue-600" />
              Autonomous AI Agent Summary & Recommendation
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">{analysisResult.summary}</p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Recommendation:</span>
              <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-md text-xs font-bold">
                {analysisResult.aiRecommendation}
              </span>
            </div>
          </div>

          {/* Competency Scores Grid */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
              Competency Alignment Dimensions (1-10 Scale)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(analysisResult.competencyScores).map(([key, rawVal]) => {
                const val = Number(rawVal) || 0;
                return (
                  <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <div className="text-xl font-bold font-mono text-gray-900 mt-1">{val}/10</div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-[#4285F4] rounded-full"
                        style={{ width: `${(val / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Satisfied vs Missing Requirements Dual Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Met Requirements */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2.5">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Company Requirements Satisfied ({analysisResult.matchedRequirements.length})
              </span>
              <ul className="space-y-2">
                {analysisResult.matchedRequirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-gray-800 leading-relaxed shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Unmet / Missing Requirements */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2.5">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Missing Qualifications or Gaps ({analysisResult.unmetOrMissingRequirements.length})
              </span>
              <ul className="space-y-2">
                {analysisResult.unmetOrMissingRequirements.length > 0 ? (
                  analysisResult.unmetOrMissingRequirements.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-100 text-gray-800 leading-relaxed shadow-2xs"
                    >
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))
                ) : (
                  <li className="p-2.5 bg-white/90 rounded-xl text-gray-500 italic">
                    Candidate satisfies all key criteria without disqualifying gaps.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Recommended Probing Questions */}
          {analysisResult.recommendedQuestions?.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1.5 uppercase text-xs">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                Targeted AI Probing Questions for Next Round
              </span>
              <ul className="space-y-1.5">
                {analysisResult.recommendedQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="font-mono text-purple-600 font-bold">Q{i + 1}:</span>
                    <span className="leading-snug">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Direct Pipeline Decision Action Bar */}
          <div className="p-4 bg-gray-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-400 block">Take Immediate Action</span>
              <p className="text-xs text-gray-300">
                Update candidate hiring pipeline status based on AI Agent recommendations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeApplicant) {
                    onUpdateDecision(
                      activeApplicant.id,
                      "accepted",
                      `Accepted based on AI Job Fit Analysis (${analysisResult.matchPercentage}% met). ${analysisResult.summary}`
                    );
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Applicant</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeApplicant) {
                    onUpdateDecision(
                      activeApplicant.id,
                      "rejected",
                      `Rejected based on AI Job Fit Gaps (${analysisResult.matchPercentage}% met).`
                    );
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Applicant</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-3">
          <Brain className="w-12 h-12 text-blue-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-800">
            Ready to Analyze Candidate vs Company Job Requirements
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Select an applicant on the left and a company job description on the right, then click{" "}
            <strong className="text-blue-600">&ldquo;Run AI Agent Fit Analysis&rdquo;</strong> to inspect qualification compliance.
          </p>
        </div>
      )}
    </div>
  );
};
