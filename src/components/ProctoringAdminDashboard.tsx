import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Layers,
  Smartphone,
  Users,
  Maximize2,
  Search,
  Briefcase,
  Sparkles,
  TrendingUp,
  Sliders,
  ChevronRight,
  FileText,
  UserCheck,
  Building2,
  ArrowRight,
} from "lucide-react";
import {
  ProctoringEvent,
  RoomScanStep,
  ApplicantRecord,
  CompanyJobRole,
  ApplicantDecision,
} from "../types";
import { INITIAL_JOB_ROLES, INITIAL_APPLICANTS } from "../data/recruitmentData";
import { CandidatePipelineTable } from "./CandidatePipelineTable";
import { CompanyJobRoleManager } from "./CompanyJobRoleManager";
import { JobRequirementFitAnalyzer } from "./JobRequirementFitAnalyzer";

interface ProctoringAdminDashboardProps {
  proctoringEvents: ProctoringEvent[];
  setProctoringEvents: React.Dispatch<React.SetStateAction<ProctoringEvent[]>>;
  roomScanResults: RoomScanStep[];
  candidateName: string;
  onReturnToInterview: () => void;
  onSelectCandidateForSession?: (applicant: ApplicantRecord) => void;
}

export type AdminTab = "pipeline" | "jobs" | "analyzer" | "proctoring";

export const ProctoringAdminDashboard: React.FC<ProctoringAdminDashboardProps> = ({
  proctoringEvents,
  setProctoringEvents,
  roomScanResults,
  candidateName,
  onReturnToInterview,
  onSelectCandidateForSession,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("pipeline");

  // Local state for Job Roles and Applicants
  const [jobRoles, setJobRoles] = useState<CompanyJobRole[]>(INITIAL_JOB_ROLES);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(INITIAL_APPLICANTS);

  // Cross-tab selection states
  const [selectedApplicantForAnalysis, setSelectedApplicantForAnalysis] = useState<ApplicantRecord | null>(null);
  const [selectedJobRoleForAnalysis, setSelectedJobRoleForAnalysis] = useState<CompanyJobRole | null>(null);

  // Proctoring sub-states
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

  // Compute Integrity Index
  const flagsCount = proctoringEvents.length;
  const highSeverityCount = proctoringEvents.filter((e) => e.severity === "high").length;
  const integrityIndex = Math.max(20, 100 - flagsCount * 4 - highSeverityCount * 6);

  const filteredEvents = proctoringEvents.filter((e) => {
    if (filterSeverity === "all") return true;
    return e.severity === filterSeverity;
  });

  const toggleReviewed = (id: string) => {
    setProctoringEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, reviewed: !e.reviewed } : e))
    );
  };

  const handleUpdateDecision = (applicantId: string, decision: ApplicantDecision, notes?: string) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId
          ? {
              ...app,
              decision,
              decisionNotes: notes || app.decisionNotes,
              decisionTimestamp: new Date().toISOString(),
            }
          : app
      )
    );
  };

  const handleAddJobRole = (newRole: CompanyJobRole) => {
    setJobRoles((prev) => [newRole, ...prev]);
  };

  const handleSelectRoleForAnalysis = (role: CompanyJobRole) => {
    setSelectedJobRoleForAnalysis(role);
    setActiveTab("analyzer");
  };

  const handleSelectApplicantForAnalysis = (applicant: ApplicantRecord) => {
    setSelectedApplicantForAnalysis(applicant);
    setActiveTab("analyzer");
  };

  const downloadAuditReport = () => {
    const data = {
      candidateName,
      generatedAt: new Date().toISOString(),
      integrityIndex,
      flagsCount,
      roomVerification: roomScanResults,
      incidents: proctoringEvents,
      applicantsSummary: applicants,
      activeJobRoles: jobRoles,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recruiter_audit_report_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Banner with AI Agent Branding */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 mb-3 text-xs font-semibold text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIBE AI — Autonomous Talent Recruitment & Proctoring Agent</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Recruiter & Proctoring Administration Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
            Monitor interviewed candidates in row view, evaluate company requirement fit percentages, manage hiring decisions (Accept/Reject), build custom company Job Descriptions, and review silent Talview proctoring logs.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={downloadAuditReport}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs rounded-xl border border-gray-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Recruiter JSON</span>
          </button>
          <button
            onClick={onReturnToInterview}
            className="px-4 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Back to Active Interview</span>
          </button>
        </div>
      </div>

      {/* Main Slide / Tab Selector */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "pipeline"
              ? "bg-[#4285F4] text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline & Outcomes ({applicants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "jobs"
              ? "bg-[#4285F4] text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Company Job Roles & JD Builder ({jobRoles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("analyzer")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "analyzer"
              ? "bg-[#4285F4] text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Requirement & Fit Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab("proctoring")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "proctoring"
              ? "bg-[#4285F4] text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Silent Proctoring & Vision Logs ({proctoringEvents.length})</span>
        </button>
      </div>

      {/* Slide 1: Candidate Pipeline & Interview Outcomes Row View */}
      {activeTab === "pipeline" && (
        <CandidatePipelineTable
          applicants={applicants}
          jobRoles={jobRoles}
          onUpdateDecision={handleUpdateDecision}
          onSelectForFitAnalysis={handleSelectApplicantForAnalysis}
          onLaunchCandidateInterview={onSelectCandidateForSession}
        />
      )}

      {/* Slide 2: Company Job Openings & Role Builder */}
      {activeTab === "jobs" && (
        <CompanyJobRoleManager
          jobRoles={jobRoles}
          onAddJobRole={handleAddJobRole}
          onSelectRoleForAnalysis={handleSelectRoleForAnalysis}
        />
      )}

      {/* Slide 3: AI Agent Requirement & Fit Analyzer */}
      {activeTab === "analyzer" && (
        <JobRequirementFitAnalyzer
          applicants={applicants}
          jobRoles={jobRoles}
          selectedApplicantForAnalysis={selectedApplicantForAnalysis}
          selectedJobRoleForAnalysis={selectedJobRoleForAnalysis}
          onUpdateDecision={handleUpdateDecision}
        />
      )}

      {/* Slide 4: Silent Vision Proctoring Audit & Workspace Timeline */}
      {activeTab === "proctoring" && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Exam Integrity Score
              </span>
              <div className="flex items-baseline space-x-2">
                <span
                  className={`text-2xl font-bold font-mono ${
                    integrityIndex > 80
                      ? "text-emerald-600"
                      : integrityIndex > 60
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {integrityIndex}%
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {integrityIndex > 80 ? "High Trust" : "Review Required"}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Silent Device Detections
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900 font-mono">{flagsCount}</span>
                <span className="text-xs text-gray-400 font-medium">Incidents</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                &lt;3ft Proximity Alerts
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-amber-600 font-mono">
                  {proctoringEvents.filter((e) => e.proximityScore === "close (<3ft)").length}
                </span>
                <span className="text-xs text-gray-400 font-medium">Monocular Depth</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                360° Workspace Checks
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-emerald-600 font-mono">
                  {roomScanResults.filter((r) => r.status === "clear").length}/5
                </span>
                <span className="text-xs text-gray-400 font-medium">Angles Clear</span>
              </div>
            </div>
          </div>

          {/* 360-Degree Workspace Verification History */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3 uppercase tracking-wider">
              <Camera className="w-4 h-4 text-[#4285F4]" />
              <span>360-Degree Pre-Interview Workspace Verification Summary</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {roomScanResults.map((scan, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    scan.status === "clear"
                      ? "bg-emerald-50 border-emerald-200"
                      : scan.status === "flagged"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="truncate">{scan.angle}</span>
                    {scan.status === "clear" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2">
                    {scan.feedbackMessage || "Angle captured and logged."}
                  </p>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">
                    Status: {scan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Chronological Incident Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#EA4335]" />
                <span>Silent Incident & Device Detection Timeline ({filteredEvents.length})</span>
              </h2>

              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 outline-none cursor-pointer"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High (&lt;3ft proximity / multiple people)</option>
                  <option value="medium">Medium (Peripheral devices)</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-gray-700">No suspicious integrity events recorded</p>
                <p className="text-[11px] text-gray-400">
                  The camera feed and audio stream show a verified, single-candidate workspace for {candidateName}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      evt.reviewed
                        ? "bg-gray-50 border-gray-200 opacity-60"
                        : evt.severity === "high"
                        ? "bg-red-50 border-red-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          evt.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-gray-900 capitalize">
                            {evt.objectName} Detected
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-gray-100 text-gray-600 font-semibold">
                            {evt.confidence}% Confidence
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                              evt.proximityScore === "close (<3ft)"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {evt.proximityScore}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mt-1">{evt.notes}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          Logged at {evt.timeFormatted} • Candidate experience was not interrupted
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {evt.snapshotBase64 && (
                        <button
                          onClick={() => setSelectedSnapshot(evt.snapshotBase64 || null)}
                          className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>View Snapshot</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleReviewed(evt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          evt.reviewed
                            ? "bg-gray-200 text-gray-700"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {evt.reviewed ? "Reviewed ✓" : "Mark Reviewed"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Snapshot Modal */}
          {selectedSnapshot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Incident Evidence Frame Snapshot</h3>
                  <button
                    onClick={() => setSelectedSnapshot(null)}
                    className="text-gray-400 hover:text-gray-700 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <img
                  src={selectedSnapshot}
                  alt="Proctoring Snapshot"
                  className="w-full rounded-xl border border-gray-200"
                />
                <p className="text-[11px] text-gray-500">
                  Timestamped evidence capture with bounding coordinates logged securely to the compliance audit record.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
