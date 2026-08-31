import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Eye,
  FileText,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Play,
  UserCheck,
  AlertTriangle,
  Send,
  Bell,
  Mail,
  Building2,
  Check,
  Award,
} from "lucide-react";
import {
  ApplicantRecord,
  ApplicantDecision,
  CompanyJobRole,
  CandidateNotification,
} from "../types";

interface CandidatePipelineTableProps {
  applicants: ApplicantRecord[];
  jobRoles: CompanyJobRole[];
  onUpdateDecision: (applicantId: string, decision: ApplicantDecision, notes?: string, fitEvaluation?: "Fit" | "Unfit") => void;
  onSelectForFitAnalysis: (applicant: ApplicantRecord) => void;
  onLaunchCandidateInterview?: (applicant: ApplicantRecord) => void;
  onSendCandidateNotification?: (notification: CandidateNotification) => void;
}

export const CandidatePipelineTable: React.FC<CandidatePipelineTableProps> = ({
  applicants,
  jobRoles,
  onUpdateDecision,
  onSelectForFitAnalysis,
  onLaunchCandidateInterview,
  onSendCandidateNotification,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedDecision, setSelectedDecision] = useState<string>("all");
  const [selectedFit, setSelectedFit] = useState<string>("all");

  // Modal State
  const [activeModalApplicant, setActiveModalApplicant] = useState<ApplicantRecord | null>(null);
  const [modalAction, setModalAction] = useState<"accept" | "reject" | "view_details" | "send_notification" | null>(null);
  const [decisionNotesInput, setDecisionNotesInput] = useState<string>("");
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [notificationSentSuccess, setNotificationSentSuccess] = useState<string | null>(null);

  // Departments list from roles
  const departments = Array.from(new Set(jobRoles.map((r) => r.department)));

  // Filter Logic
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.targetRoleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.companyName && app.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDepartment === "all" || app.department === selectedDepartment;
    const matchesDecision = selectedDecision === "all" || app.decision === selectedDecision;
    const matchesFit =
      selectedFit === "all"
        ? true
        : selectedFit === "strong"
        ? app.matchPercentage >= 85
        : selectedFit === "moderate"
        ? app.matchPercentage >= 70 && app.matchPercentage < 85
        : app.matchPercentage < 70;

    return matchesSearch && matchesDept && matchesDecision && matchesFit;
  });

  // Aggregate Metrics
  const totalCount = applicants.length;
  const acceptedCount = applicants.filter((a) => a.decision === "accepted" || a.recruiterFitEvaluation === "Fit").length;
  const rejectedCount = applicants.filter((a) => a.decision === "rejected" || a.recruiterFitEvaluation === "Unfit").length;
  const underReviewCount = applicants.filter((a) => a.decision === "under_review" || a.decision === "completed").length;

  const avgMatch =
    totalCount > 0
      ? Math.round(applicants.reduce((sum, a) => sum + a.matchPercentage, 0) / totalCount)
      : 0;

  const avgIntegrity =
    totalCount > 0
      ? Math.round(applicants.reduce((sum, a) => sum + a.integrityScore, 0) / totalCount)
      : 0;

  const handleOpenDecisionModal = (app: ApplicantRecord, action: "accept" | "reject" | "view_details" | "send_notification") => {
    setActiveModalApplicant(app);
    setModalAction(action);
    setDecisionNotesInput(app.decisionNotes || "");
    setNotificationSentSuccess(null);

    if (action === "send_notification" || action === "accept") {
      setNotificationMessage(
        `Dear ${app.name},\n\nWe are pleased to inform you that following your VIBE AI technical evaluation for the ${app.targetRoleName} role at ${app.companyName || "our organization"}, our hiring team has marked you as FIT and is extending an offer. We look forward to welcoming you aboard!\n\nBest regards,\nRecruitment & Talent Operations Team`
      );
    } else if (action === "reject") {
      setNotificationMessage(
        `Dear ${app.name},\n\nThank you for undergoing the technical assessment for ${app.targetRoleName} at ${app.companyName || "our organization"}. After careful review of your interview responses, our team has decided to pursue other candidates whose skillsets align more closely with our current requirements.\n\nWe appreciate your effort and wish you success in your job search.`
      );
    }
  };

  const handleConfirmDecision = () => {
    if (!activeModalApplicant || !modalAction) return;

    if (modalAction === "accept") {
      onUpdateDecision(
        activeModalApplicant.id,
        "accepted",
        decisionNotesInput || "Candidate demonstrated excellent technical competency and is approved for hire.",
        "Fit"
      );
    } else if (modalAction === "reject") {
      onUpdateDecision(
        activeModalApplicant.id,
        "rejected",
        decisionNotesInput || "Candidate did not meet required senior architectural threshold.",
        "Unfit"
      );
    }

    setActiveModalApplicant(null);
    setModalAction(null);
  };

  const handleSendNotificationSubmit = () => {
    if (!activeModalApplicant) return;

    const isFit = activeModalApplicant.decision === "accepted" || activeModalApplicant.recruiterFitEvaluation === "Fit";
    const notif: CandidateNotification = {
      id: `notif_${Date.now()}`,
      candidateEmail: activeModalApplicant.email,
      candidateName: activeModalApplicant.name,
      companyName: activeModalApplicant.companyName || "Tech Enterprise",
      roleName: activeModalApplicant.targetRoleName,
      status: isFit ? "fit_offer" : "unfit_rejected",
      title: isFit
        ? `🎉 Offer Extended: ${activeModalApplicant.targetRoleName} at ${activeModalApplicant.companyName || "Tech Enterprise"}`
        : `Update regarding your application for ${activeModalApplicant.targetRoleName}`,
      message: notificationMessage || "Your candidate status has been updated by the recruitment team.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    if (onSendCandidateNotification) {
      onSendCandidateNotification(notif);
    }

    // Mark notification sent on applicant record
    onUpdateDecision(
      activeModalApplicant.id,
      activeModalApplicant.decision,
      activeModalApplicant.decisionNotes,
      activeModalApplicant.recruiterFitEvaluation
    );

    setNotificationSentSuccess(`Live notification dispatched to ${activeModalApplicant.email}!`);
    setTimeout(() => {
      setActiveModalApplicant(null);
      setModalAction(null);
      setNotificationSentSuccess(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Filter KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setSelectedDecision("accepted")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            selectedDecision === "accepted"
              ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20"
              : "bg-white border-gray-200 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold uppercase mb-1">
            <span>Fit / Hired</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{acceptedCount}</div>
          <span className="text-[10px] text-emerald-600/70">Offers Extended</span>
        </div>

        <div
          onClick={() => setSelectedDecision("rejected")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            selectedDecision === "rejected"
              ? "bg-rose-50 border-rose-300 ring-2 ring-rose-400/20"
              : "bg-white border-gray-200 hover:border-rose-300"
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold uppercase mb-1">
            <span>Unfit / Declined</span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600">{rejectedCount}</div>
          <span className="text-[10px] text-rose-600/70">Unfit Applicants</span>
        </div>

        <div
          onClick={() => setSelectedDecision("under_review")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            selectedDecision === "under_review"
              ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/20"
              : "bg-white border-gray-200 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase mb-1">
            <span>Completed / Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">{underReviewCount}</div>
          <span className="text-[10px] text-amber-600/70">Awaiting Recruiter Call</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase mb-1">
            <span>Avg Match Fit</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#4285F4]">{avgMatch}%</div>
          <span className="text-[10px] text-gray-400">JD Alignment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase mb-1">
            <span>Avg Integrity</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">{avgIntegrity}%</div>
          <span className="text-[10px] text-gray-400">Verified Proctoring</span>
        </div>
      </div>

      {/* 2. Filter, Search & Controls Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, company, role, skills..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none cursor-pointer focus:border-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Decision Filter */}
          <select
            value={selectedDecision}
            onChange={(e) => setSelectedDecision(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none cursor-pointer focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="accepted">Accepted / Fit</option>
            <option value="rejected">Rejected / Unfit</option>
            <option value="under_review">Under Review</option>
            <option value="completed">Completed Assessment</option>
          </select>

          {/* Fit Filter */}
          <select
            value={selectedFit}
            onChange={(e) => setSelectedFit(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none cursor-pointer focus:border-blue-500"
          >
            <option value="all">All Match Levels</option>
            <option value="strong">Strong Fit (&ge;85%)</option>
            <option value="moderate">Moderate Fit (70-84%)</option>
            <option value="borderline">Borderline (&lt;70%)</option>
          </select>

          {(searchTerm || selectedDepartment !== "all" || selectedDecision !== "all" || selectedFit !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDepartment("all");
                setSelectedDecision("all");
                setSelectedFit("all");
              }}
              className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. Applicant Row View Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                <th className="py-3.5 px-4">Company & Target Role</th>
                <th className="py-3.5 px-4 text-center">Fit % Match</th>
                <th className="py-3.5 px-4 text-center">AI Score</th>
                <th className="py-3.5 px-4 text-center">Integrity Trust</th>
                <th className="py-3.5 px-4 text-center">Recruiter Decision</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Recruiter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-600">No applicant records found</p>
                    <p className="text-xs text-gray-400">Completed assessments from candidate interviews will automatically appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const fitColor =
                    app.matchPercentage >= 85
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : app.matchPercentage >= 70
                      ? "text-blue-700 bg-blue-50 border-blue-200"
                      : "text-amber-700 bg-amber-50 border-amber-200";

                  const progressColor =
                    app.matchPercentage >= 85
                      ? "bg-emerald-500"
                      : app.matchPercentage >= 70
                      ? "bg-blue-500"
                      : "bg-amber-500";

                  const isFitDecision = app.decision === "accepted" || app.recruiterFitEvaluation === "Fit";
                  const isUnfitDecision = app.decision === "rejected" || app.recruiterFitEvaluation === "Unfit";

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* 1. Candidate Info */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt={app.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-2xs"
                          />
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{app.name}</span>
                              <span className="text-[10px] text-gray-400 font-normal">
                                ({app.experienceYears}y exp)
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">{app.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Applied Company & Job Role */}
                      <td className="py-4 px-4">
                        <div>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
                            <Building2 className="w-3 h-3 text-blue-500" />
                            <span>{app.companyName || "Google Cloud"}</span>
                          </div>
                          <span className="font-semibold text-gray-800 block mt-0.5">{app.targetRoleName}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">
                            {app.interviewDate} • {app.interviewDuration}
                          </span>
                        </div>
                      </td>

                      {/* 3. Match Fit % with Progress Bar */}
                      <td className="py-4 px-4">
                        <div className="max-w-[140px] mx-auto space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${fitColor}`}>
                              {app.matchPercentage}% Met
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">{app.fitStatus}</span>
                          </div>

                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                              style={{ width: `${app.matchPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 4. Overall AI Score */}
                      <td className="py-4 px-4 text-center">
                        <div className="font-bold font-mono text-sm text-[#4285F4]">
                          {app.overallScore}
                          <span className="text-[10px] text-gray-400 font-normal">/100</span>
                        </div>
                      </td>

                      {/* 5. Integrity Trust */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono font-bold text-xs ${
                              app.integrityScore >= 95
                                ? "text-emerald-600"
                                : app.integrityScore >= 80
                                ? "text-amber-600"
                                : "text-rose-600"
                            }`}
                          >
                            {app.integrityScore}%
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {app.proctoringFlags === 0 ? "0 flags" : `${app.proctoringFlags} flag(s)`}
                          </span>
                        </div>
                      </td>

                      {/* 6. Decision Status */}
                      <td className="py-4 px-4 text-center">
                        {isFitDecision && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Fit (Hire Offer)</span>
                          </span>
                        )}

                        {isUnfitDecision && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold shadow-2xs">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Unfit (Declined)</span>
                          </span>
                        )}

                        {!isFitDecision && !isUnfitDecision && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Decision</span>
                          </span>
                        )}
                      </td>

                      {/* 7. Action Controls */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Mark as Fit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDecisionModal(app, "accept")}
                            title="Mark as Fit & Extend Offer"
                            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isFitDecision
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Fit (Hire)</span>
                          </button>

                          {/* Mark as Unfit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDecisionModal(app, "reject")}
                            title="Mark as Unfit"
                            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isUnfitDecision
                                ? "bg-rose-600 text-white shadow-2xs"
                                : "bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Unfit</span>
                          </button>

                          {/* Send Notification Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDecisionModal(app, "send_notification")}
                            title="Send Recruiter Notification to Candidate"
                            className="p-1.5 sm:px-2.5 sm:py-1 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Notify</span>
                          </button>

                          {/* View Assessment Details */}
                          <button
                            type="button"
                            onClick={() => handleOpenDecisionModal(app, "view_details")}
                            title="View AI Requirement Gap Analysis"
                            className="p-1.5 sm:px-2.5 sm:py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                            <span className="hidden sm:inline">Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Accept / Reject / Notify Modal */}
      {activeModalApplicant && modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeModalApplicant.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={activeModalApplicant.name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {modalAction === "accept"
                      ? `Confirm Decision: Mark as Fit (${activeModalApplicant.name})`
                      : modalAction === "reject"
                      ? `Confirm Decision: Mark as Unfit (${activeModalApplicant.name})`
                      : modalAction === "send_notification"
                      ? `Send Recruiter Notification to ${activeModalApplicant.name}`
                      : `Candidate Assessment & Fit Breakdown: ${activeModalApplicant.name}`}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {activeModalApplicant.companyName || "Tech Enterprise"} • {activeModalApplicant.targetRoleName} ({activeModalApplicant.department})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveModalApplicant(null);
                  setModalAction(null);
                }}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Candidate Metric Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Requirement Fit</span>
                <span className="text-lg font-bold font-mono text-[#4285F4]">
                  {activeModalApplicant.matchPercentage}%
                </span>
                <span className="text-[10px] text-gray-500 block">{activeModalApplicant.fitStatus}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">AI Evaluation Score</span>
                <span className="text-lg font-bold font-mono text-emerald-600">
                  {activeModalApplicant.overallScore}/100
                </span>
                <span className="text-[10px] text-gray-500 block">Exam Performance</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Proctoring Trust</span>
                <span className="text-lg font-bold font-mono text-purple-600">
                  {activeModalApplicant.integrityScore}%
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {activeModalApplicant.proctoringFlags} Flags
                </span>
              </div>
            </div>

            {/* Notification dispatch success alert */}
            {notificationSentSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{notificationSentSuccess}</span>
              </div>
            )}

            {/* Notification Dispatch Form */}
            {modalAction === "send_notification" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Candidate Notification Message (Delivered to Candidate Portal):</span>
                </div>
                <textarea
                  rows={6}
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter message for the candidate regarding their recruitment status..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed"
                />
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Delivered to: <strong>{activeModalApplicant.email}</strong></span>
                  <span className="text-purple-600 font-semibold">Real-Time Notification Delivery</span>
                </div>
              </div>
            )}

            {/* AI Agent Recommendation & Evidence Summary */}
            {modalAction !== "send_notification" && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    VIBE AI Technical Synthesis
                  </span>
                  <p className="text-xs font-semibold text-gray-900">
                    {activeModalApplicant.aiRecommendation || "Evaluated by Multimodal VIBE AI Agent"}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {activeModalApplicant.aiReasoning || "Candidate demonstrated thorough technical mastery across algorithm design and architecture."}
                  </p>
                </div>

                {/* Matched vs Unmet Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-emerald-900 flex items-center gap-1 text-[11px] uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Requirements Satisfied
                    </span>
                    <ul className="space-y-1 text-gray-700">
                      {(activeModalApplicant.matchedRequirements || []).map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px] uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Gaps / Unmet Requirements
                    </span>
                    <ul className="space-y-1 text-gray-700">
                      {(activeModalApplicant.unmetRequirements || []).length > 0 ? (
                        activeModalApplicant.unmetRequirements.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">No significant disqualifying gaps detected.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Recruiter Decision Notes Input (for Accept / Reject) */}
                {modalAction !== "view_details" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                      Recruiter Decision & Audit Notes
                    </label>
                    <textarea
                      rows={3}
                      value={decisionNotesInput}
                      onChange={(e) => setDecisionNotesInput(e.target.value)}
                      placeholder="Add specific justification or next steps note..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  onSelectForFitAnalysis(activeModalApplicant);
                  setActiveModalApplicant(null);
                  setModalAction(null);
                }}
                className="text-xs text-[#4285F4] hover:text-[#3367D6] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Gap Analysis</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalApplicant(null);
                    setModalAction(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>

                {modalAction === "send_notification" && (
                  <button
                    type="button"
                    onClick={handleSendNotificationSubmit}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Notification to Candidate</span>
                  </button>
                )}

                {modalAction === "accept" && (
                  <button
                    type="button"
                    onClick={handleConfirmDecision}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Fit (Hire)</span>
                  </button>
                )}

                {modalAction === "reject" && (
                  <button
                    type="button"
                    onClick={handleConfirmDecision}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirm Unfit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
