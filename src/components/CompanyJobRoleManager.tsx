import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Sliders,
  DollarSign,
  Layers,
  FileCode,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { CompanyJobRole } from "../types";

interface CompanyJobRoleManagerProps {
  jobRoles: CompanyJobRole[];
  onAddJobRole: (newRole: CompanyJobRole) => void;
  onSelectRoleForAnalysis: (role: CompanyJobRole) => void;
}

export const CompanyJobRoleManager: React.FC<CompanyJobRoleManagerProps> = ({
  jobRoles,
  onAddJobRole,
  onSelectRoleForAnalysis,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    companyName: "Google Cloud",
    title: "",
    department: "Cloud & Distributed Systems",
    location: "San Francisco, CA / Remote",
    employmentType: "Full-time" as "Full-time" | "Contract" | "Remote" | "Hybrid",
    experienceRequired: "4+ Years",
    skills: "",
    salaryRange: "$165,000 - $210,000 / yr",
    minMatchThreshold: 75,
    jobDescription: "",
  });

  const [selectedRoleDetail, setSelectedRoleDetail] = useState<CompanyJobRole | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.jobDescription.trim()) return;

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newRole: CompanyJobRole = {
      id: `role_${Date.now()}`,
      companyName: formData.companyName.trim() || "Tech Enterprise",
      title: formData.title.trim(),
      department: formData.department.trim() || "Engineering",
      location: formData.location.trim() || "Remote",
      employmentType: formData.employmentType,
      experienceRequired: formData.experienceRequired.trim() || "3+ Years",
      skillsRequired: skillsArray.length > 0 ? skillsArray : ["TypeScript", "Distributed Systems", "Cloud Architecture"],
      minMatchThreshold: Number(formData.minMatchThreshold) || 75,
      salaryRange: formData.salaryRange.trim() || "$140,000 - $180,000 / yr",
      jobDescription: formData.jobDescription.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      applicantsCount: 0,
      status: "active",
    };

    onAddJobRole(newRole);
    setIsCreatingNew(false);
    setFormData({
      companyName: "Google Cloud",
      title: "",
      department: "Cloud & Distributed Systems",
      location: "San Francisco, CA / Remote",
      employmentType: "Full-time",
      experienceRequired: "4+ Years",
      skills: "",
      salaryRange: "$165,000 - $210,000 / yr",
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
            Add open engineering roles with target companies, skill requirements, and job descriptions. Candidates can browse and apply directly to these requisitions.
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
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Create New Hiring Role Requisition</span>
            </h3>
            <span className="text-xs text-blue-600 font-semibold">Active in Candidate Catalog</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Company Name */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Google Cloud, Stripe, Microsoft"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Job Role Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Full-Stack Cloud Engineer"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* Department */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Department / Team</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Cloud Engineering / AI Infrastructure"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA / Remote"
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
                placeholder="e.g. 4+ Years"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Salary Range */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Salary Compensation</label>
              <input
                type="text"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                placeholder="e.g. $160,000 - $200,000 / yr"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div className="text-xs">
            <label className="font-bold text-gray-700 block mb-1">
              Required Technical Skills (Comma-separated) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="TypeScript, React, Node.js, PostgreSQL, Docker, Redis, Kubernetes, Distributed Systems"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Job Description Textarea */}
          <div className="text-xs">
            <label className="font-bold text-gray-700 block mb-1">
              Full Job Description & Technical Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              placeholder="Paste the full job description, role objectives, key technical deliverables, and interview focus areas..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Role to Recruitment Catalog</span>
            </button>
          </div>
        </form>
      )}

      {/* List of Job Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-600" />
                  <span>{role.companyName || "Tech Enterprise"}</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {role.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{role.title}</h3>
                <span className="text-xs text-gray-500">{role.department}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600 pt-1">
                <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  {role.location}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                  <Clock className="w-3 h-3 text-gray-400" />
                  {role.experienceRequired}
                </span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {role.skillsRequired.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
                {role.skillsRequired.length > 4 && (
                  <span className="text-[10px] text-gray-400 self-center">
                    +{role.skillsRequired.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 font-mono">
                {role.salaryRange || "$150,000/yr"}
              </span>

              <button
                type="button"
                onClick={() => setSelectedRoleDetail(role)}
                className="text-xs font-bold text-[#4285F4] hover:text-[#3367D6] flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Role Details Modal */}
      {selectedRoleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {selectedRoleDetail.companyName || "Tech Enterprise"}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">{selectedRoleDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRoleDetail(null)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-semibold text-gray-800">{selectedRoleDetail.location}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Salary</span>
                  <span className="font-semibold text-gray-800">{selectedRoleDetail.salaryRange}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="font-semibold text-gray-800">{selectedRoleDetail.experienceRequired}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Min Match Fit</span>
                  <span className="font-semibold text-emerald-700">{selectedRoleDetail.minMatchThreshold}%</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-700 block mb-1">Required Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoleDetail.skillsRequired.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 font-mono text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-700 block mb-1">Job Description</span>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedRoleDetail.jobDescription}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRoleDetail(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
