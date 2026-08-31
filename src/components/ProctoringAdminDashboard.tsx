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
  Bell,
  Mail,
} from "lucide-react";
import {
  ProctoringEvent,
  RoomScanStep,
  ApplicantRecord,
  CompanyJobRole,
  ApplicantDecision,
  CandidateNotification,
} from "../types";
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
  jobRoles?: CompanyJobRole[];
  setJobRoles?: React.Dispatch<React.SetStateAction<CompanyJobRole[]>>;
  applicants?: ApplicantRecord[];
  setApplicants?: React.Dispatch<React.SetStateAction<ApplicantRecord[]>>;
  onSendCandidateNotification?: (notification: CandidateNotification) => void;
}

export type AdminTab = "pipeline" | "jobs" | "analyzer" | "proctoring";

export const ProctoringAdminDashboard: React.FC<ProctoringAdminDashboardProps> = ({
  proctoringEvents,
  setProctoringEvents,
  roomScanResults,
  candidateName,
  onReturnToInterview,
  onSelectCandidateForSession,
  jobRoles = [],
  setJobRoles,
  applicants = [],
  setApplicants,
  onSendCandidateNotification,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("pipeline");

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

  const handleUpdateDecision = (
    applicantId: string,
    decision: ApplicantDecision,
    notes?: string,
    fitEvaluation?: "Fit" | "Unfit"
  ) => {
    if (setApplicants) {
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicantId
            ? {
                ...app,
                decision,
                recruiterFitEvaluation: fitEvaluation || app.recruiterFitEvaluation,
                decisionNotes: notes || app.decisionNotes,
                decisionTimestamp: new Date().toISOString(),
              }
            : app
        )
      );
    }
  };

  const handleAddJobRole = (newRole: CompanyJobRole) => {
    if (setJobRoles) {
      setJobRoles((prev) => [newRole, ...prev]);
    }
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
      proctoringEventsCount: proctoringEvents.length,
      highRiskFlags: highSeverityCount,
      roomVerification: roomScanResults,
      events: proctoringEvents,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proctoring-audit-${candidateName.toLowerCase().replace(/\s+/g, "_")}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* Top Banner with Navigation Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-2 text-xs font-semibold text-[#1a73e8]">
            <Building2 className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Recruiter & Proctoring Administration Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Recruiter Hub & Autonomous Evaluation Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
            Manage company job openings, review completed candidate assessments, decide fit/unfit status, and dispatch live candidate recruitment notifications.
          </p>
        </div>

        {/* Action Controls & Return */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadAuditReport}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit Log</span>
          </button>

          <button
            onClick={onReturnToInterview}
            className="px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Live Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recruiter Navigation Tabs */}
      <div className="flex border-b border-gray-200 space-x-2 sm:space-x-4 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "pipeline"
              ? "border-[#4285F4] text-[#1a73e8]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline & Assessments</span>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono">
            {applicants.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "jobs"
              ? "border-[#4285F4] text-[#1a73e8]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Company Job Roles & JDs</span>
          <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full font-mono">
            {jobRoles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("analyzer")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "analyzer"
              ? "border-[#4285F4] text-[#1a73e8]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI JD-Resume Gap Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab("proctoring")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "proctoring"
              ? "border-[#4285F4] text-[#1a73e8]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Live Vision Proctoring Telemetry</span>
          {proctoringEvents.length > 0 && (
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-mono">
              {proctoringEvents.length} flags
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Candidate Pipeline & Recruiter Decision */}
      {activeTab === "pipeline" && (
        <CandidatePipelineTable
          applicants={applicants}
          jobRoles={jobRoles}
          onUpdateDecision={handleUpdateDecision}
          onSelectForFitAnalysis={handleSelectApplicantForAnalysis}
          onLaunchCandidateInterview={onSelectCandidateForSession}
          onSendCandidateNotification={onSendCandidateNotification}
        />
      )}

      {/* Tab 2: Company Job Role Manager (Add/Manage Roles) */}
      {activeTab === "jobs" && (
        <CompanyJobRoleManager
          jobRoles={jobRoles}
          onAddJobRole={handleAddJobRole}
          onSelectRoleForAnalysis={handleSelectRoleForAnalysis}
        />
      )}

      {/* Tab 3: AI Job Requirement Fit Analyzer */}
      {activeTab === "analyzer" && (
        <JobRequirementFitAnalyzer
          applicants={applicants}
          jobRoles={jobRoles}
          initialSelectedApplicant={selectedApplicantForAnalysis}
          initialSelectedJobRole={selectedJobRoleForAnalysis}
          onUpdateApplicantDecision={handleUpdateDecision}
        />
      )}

      {/* Tab 4: Proctoring Audit & 360 Scan Evidence */}
      {activeTab === "proctoring" && (
        <div className="space-y-6">
          {/* Proctoring Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Trust Integrity Index</span>
                <span className={`text-2xl font-bold font-mono ${integrityIndex > 80 ? "text-emerald-600" : "text-amber-600"}`}>
                  {integrityIndex}%
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Calculated in real-time</span>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Total Flagged Incidents</span>
                <span className="text-2xl font-bold font-mono text-gray-900">{flagsCount}</span>
                <span className="text-[10px] text-rose-600 block mt-0.5">{highSeverityCount} High Severity</span>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">360° Workspace Status</span>
                <span className="text-sm font-bold text-emerald-600">Verified & Approved</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">{roomScanResults.length} Angles Inspected</span>
              </div>
              <Camera className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Incident Log Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Audited Proctoring Events Log
              </h3>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none"
              >
                <option value="all">All Severities</option>
                <option value="high">High Severity Only</option>
                <option value="medium">Medium Severity</option>
                <option value="low">Low Severity</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Event Type</th>
                    <th className="py-2.5 px-3">Detected Object / Alert</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Review Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No proctoring violations recorded. Environment verified clean.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-gray-500">{evt.timeFormatted}</td>
                        <td className="py-3 px-3 font-semibold text-gray-800">{evt.eventType}</td>
                        <td className="py-3 px-3 text-gray-700">{evt.objectName} ({evt.proximityScore})</td>
                        <td className="py-3 px-3 font-mono">{evt.confidence}%</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              evt.severity === "high"
                                ? "bg-rose-100 text-rose-700"
                                : evt.severity === "medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {evt.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleReviewed(evt.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              evt.reviewed
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {evt.reviewed ? "Reviewed ✓" : "Mark Reviewed"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
