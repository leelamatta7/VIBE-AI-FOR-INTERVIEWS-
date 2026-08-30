import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Sparkles,
  CheckCircle2,
  Trash2,
  FileText,
  MapPin,
  Clock,
  DollarSign,
  Layers,
  ChevronRight,
  TrendingUp,
  Building2,
  Sliders,
} from "lucide-react";
import { CompanyJobRole } from "../types";

interface CompanyJobRoleManagerProps {
  jobRoles: CompanyJobRole[];
  onAddJobRole: (newRole: CompanyJobRole) => void;
  onSelectRoleForAnalysis: (role: CompanyJobRole) => void;
}

const PRESET_COMPANY_JDS = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Core Platform",
    location: "San Francisco, CA / Remote",
    experienceRequired: "4+ Years",
    skills: "TypeScript, React, Node.js, PostgreSQL, System Design, Docker, Redis",
    salaryRange: "$160,000 - $190,000 / yr",
    minMatchThreshold: 75,
    jobDescription: `We are seeking a Senior Full-Stack Software Engineer to architect our enterprise web platforms.
Key Responsibilities:
- Design, build, and maintain high-performance APIs and microservices using TypeScript, Node.js, and PostgreSQL.
- Implement responsive, accessible, and performant user interfaces using React and modern CSS.
- Optimize database schemas, query performance, and distributed caching layers with Redis.
- Collaborate with product managers and designers to rapidly iterate on core business capabilities.
Requirements:
- 4+ years of professional full-stack development experience.
- Deep algorithmic knowledge and experience with distributed system patterns.
- Strong automated testing rigor with unit, integration, and end-to-end tests.`,
  },
  {
    title: "Staff AI Research & Core Systems Engineer",
    department: "AI & Machine Learning",
    location: "Seattle, WA / Remote",
    experienceRequired: "5+ Years",
    skills: "Python, FastAPI, Gemini API, PyTorch, pgvector, LLM Tooling, Cloud Run",
    salaryRange: "$180,000 - $220,000 / yr",
    minMatchThreshold: 80,
    jobDescription: `Join our AI Core team to build autonomous agentic workflows and LLM infrastructure.
Key Responsibilities:
- Architect scalable inference pipelines, tool-calling frameworks, and multimodal processing engines with Google Gemini.
- Build vector indexing, hybrid search, and semantic retrieval systems using pgvector and embeddings.
- Maintain low-latency asynchronous APIs with FastAPI and Docker.
Requirements:
- 5+ years building backend and machine learning systems with Python.
- Proven experience deploying generative AI models, agents, or semantic search into production.`,
  },
  {
    title: "Staff Cloud DevOps & SRE Lead",
    department: "Infrastructure & Security",
    location: "Austin, TX / Remote",
    experienceRequired: "6+ Years",
    skills: "Kubernetes, Terraform, GCP, Prometheus, Zero Trust, CI/CD",
    salaryRange: "$175,000 - $210,000 / yr",
    minMatchThreshold: 80,
    jobDescription: `Lead multi-region cloud operations, automated CI/CD deployments, and high-availability infrastructure.
Key Responsibilities:
- Manage enterprise Kubernetes clusters across multiple Google Cloud Platform regions.
- Implement infrastructure-as-code with Terraform and enforce zero-trust security policies.
- Establish SLOs, Prometheus monitoring, automated alerting, and disaster recovery plans.
Requirements:
- 6+ years managing production cloud infrastructure and Kubernetes.
- Deep expertise in GCP/AWS networking, IAM security, and container orchestration.`,
  },
];

export const CompanyJobRoleManager: React.FC<CompanyJobRoleManagerProps> = ({
  jobRoles,
  onAddJobRole,
  onSelectRoleForAnalysis,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "Core Platform",
    location: "San Francisco, CA / Remote",
    experienceRequired: "4+ Years",
    skills: "",
    salaryRange: "$150,000 - $185,000 / yr",
    minMatchThreshold: 75,
    jobDescription: "",
  });

  const [selectedRoleDetail, setSelectedRoleDetail] = useState<CompanyJobRole | null>(null);

  const handleApplyPreset = (preset: (typeof PRESET_COMPANY_JDS)[0]) => {
    setFormData({
      title: preset.title,
      department: preset.department,
      location: preset.location,
      experienceRequired: preset.experienceRequired,
      skills: preset.skills,
      salaryRange: preset.salaryRange,
      minMatchThreshold: preset.minMatchThreshold,
      jobDescription: preset.jobDescription,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.jobDescription.trim()) return;

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newRole: CompanyJobRole = {
      id: `role_${Date.now()}`,
      title: formData.title.trim(),
      department: formData.department.trim(),
      location: formData.location.trim(),
      experienceRequired: formData.experienceRequired.trim(),
      skillsRequired: skillsArray.length > 0 ? skillsArray : ["Software Engineering", "System Design"],
      minMatchThreshold: Number(formData.minMatchThreshold) || 75,
      salaryRange: formData.salaryRange.trim(),
      jobDescription: formData.jobDescription.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      applicantsCount: 0,
      status: "active",
    };

    onAddJobRole(newRole);
    setIsCreatingNew(false);
    setFormData({
      title: "",
      department: "Core Platform",
      location: "San Francisco, CA / Remote",
      experienceRequired: "4+ Years",
      skills: "",
      salaryRange: "$150,000 - $185,000 / yr",
      minMatchThreshold: 75,
      jobDescription: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono">
              Company Job Roles & Hiring Requisitions
            </span>
            <span className="text-xs text-gray-500">• {jobRoles.length} Active Openings</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Define Target Roles & Custom Job Descriptions (JD)
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl mt-0.5">
            Add specific job roles for your organization with detailed technical requirements. The VIBE AI Agent will evaluate all candidates against these exact specifications.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="px-4 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          {isCreatingNew ? (
            <span>Close Form</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add New Company Job Role</span>
            </>
          )}
        </button>
      </div>

      {/* Role Creator Form */}
      {isCreatingNew && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-md space-y-5 animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Create New Company Role Specification</span>
            </h3>

            {/* Quick 1-Click Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-gray-400 mr-1">1-Click Presets:</span>
              {PRESET_COMPANY_JDS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 transition-colors cursor-pointer"
                >
                  {preset.title.split(" ")[0]} {preset.title.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Title */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Staff Distributed Systems Engineer"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Department / Team</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Core Engineering / AI Systems"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Experience Required */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Experience Baseline</label>
              <input
                type="text"
                value={formData.experienceRequired}
                onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
                placeholder="e.g. 5+ Years"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Required Skills */}
            <div className="sm:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">
                Required Skills & Tech Stack (Comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. TypeScript, React 19, Node.js, PostgreSQL, Docker, Redis"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Salary Range */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Compensation Range</label>
              <input
                type="text"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                placeholder="e.g. $160,000 - $190,000 / yr"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Full Job Description Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-gray-700 text-xs">
                Full Company Job Description & Technical Requirements <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-gray-400">
                The VIBE AI Agent performs deep semantic parsing on this text.
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              placeholder="Paste full responsibilities, mandatory qualifications, tech stack requirements, and architectural expectations..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
            />
          </div>

          {/* Submit Controls */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish & Enable AI Requirement Matching</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-300 transition-all shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">
                      {role.department}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Added {role.createdAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{role.title}</h3>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Exp: {role.experienceRequired}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{role.location}</span>
                </div>
                {role.salaryRange && (
                  <div className="flex items-center gap-1.5 col-span-2 text-gray-500 font-mono text-[11px]">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{role.salaryRange}</span>
                  </div>
                )}
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {role.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] font-medium text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Job Description Preview */}
              <p className="text-xs text-gray-600 line-clamp-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 leading-relaxed">
                {role.jobDescription}
              </p>
            </div>

            {/* Role Card Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRoleDetail(role)}
                className="text-xs text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full JD</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectRoleForAnalysis(role)}
                className="px-3.5 py-1.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Candidates vs This Role</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Role JD Detail Modal */}
      {selectedRoleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600">
                  {selectedRoleDetail.department}
                </span>
                <h3 className="text-base font-bold text-gray-900">{selectedRoleDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRoleDetail(null)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Location</span>
                  <span className="font-semibold text-gray-800">{selectedRoleDetail.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Experience</span>
                  <span className="font-semibold text-gray-800">{selectedRoleDetail.experienceRequired}</span>
                </div>
                {selectedRoleDetail.salaryRange && (
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Salary</span>
                    <span className="font-semibold text-emerald-700">{selectedRoleDetail.salaryRange}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Threshold</span>
                  <span className="font-semibold text-blue-700">{selectedRoleDetail.minMatchThreshold}% minimum fit</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Full Company Job Description:
                </h4>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-gray-800">
                  {selectedRoleDetail.jobDescription}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRoleDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectRoleForAnalysis(selectedRoleDetail);
                  setSelectedRoleDetail(null);
                }}
                className="px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Requirement Analysis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
