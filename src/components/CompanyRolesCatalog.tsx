import React, { useState } from "react";
import {
  Building2,
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
  GraduationCap,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { CompanyJobRole } from "../types";

interface CompanyRolesCatalogProps {
  jobRoles: CompanyJobRole[];
  onSelectRole: (role: CompanyJobRole) => void;
  onOpenRecruiterPortal?: () => void;
}

export const CompanyRolesCatalog: React.FC<CompanyRolesCatalogProps> = ({
  jobRoles,
  onSelectRole,
  onOpenRecruiterPortal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [previewRole, setPreviewRole] = useState<CompanyJobRole | null>(null);

  // Extract unique companies & departments for filters
  const companiesList = Array.from(new Set(jobRoles.map((r) => r.companyName || "Tech Enterprise")));
  const departmentsList = Array.from(new Set(jobRoles.map((r) => r.department)));

  // Filtered roles
  const filteredRoles = jobRoles.filter((role) => {
    const compName = (role.companyName || "").toLowerCase();
    const roleTitle = (role.title || "").toLowerCase();
    const dept = (role.department || "").toLowerCase();
    const skills = role.skillsRequired.map((s) => s.toLowerCase());
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      compName.includes(query) ||
      roleTitle.includes(query) ||
      dept.includes(query) ||
      skills.some((s) => s.includes(query));

    const matchesCompany =
      selectedCompany === "all" || role.companyName === selectedCompany;

    const matchesDept =
      selectedDepartment === "all" || role.department === selectedDepartment;

    return matchesSearch && matchesCompany && matchesDept;
  });

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* Top Banner with prominent title and context */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 shadow-2xs text-xs font-semibold text-[#1a73e8]">
              <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>Step 1 of 4 • Select Company & Target Job Role</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Open Positions Across Top Companies
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
              Explore live job opportunities. Select any company and role to proceed to candidate details submission, resume upload, and real-time AI technical evaluation.
            </p>
          </div>

          {/* Stat Pill */}
          <div className="flex items-center gap-3 shrink-0 bg-blue-50/70 border border-blue-100 p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {filteredRoles.length}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Active Roles Available</div>
              <div className="text-[11px] text-gray-500">Across {companiesList.length} Global Companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Role Name, Company Name, or Required Skills (e.g. React, TypeScript, Python)..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Departments ({jobRoles.length})</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-500 font-medium shrink-0 flex items-center gap-1 mr-1">
            <Building2 className="w-3.5 h-3.5 text-gray-400" /> Filter Company:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCompany("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCompany === "all"
                ? "bg-gray-900 text-white shadow-2xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Companies ({jobRoles.length})
          </button>
          {companiesList.map((comp) => (
            <button
              key={comp}
              type="button"
              onClick={() => setSelectedCompany(comp)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCompany === comp
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{comp}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Company Roles with Highlighted Role Name & Company Name */}
      {filteredRoles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No matching job roles found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search keywords or clearing company and department filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCompany("all");
              setSelectedDepartment("all");
            }}
            className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header with Highlighted Company and Role */}
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* 1. Highlighted Company Name Banner */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 font-bold text-xs shadow-2xs">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="tracking-tight uppercase text-[11px] text-blue-800">Company:</span>
                    <strong className="text-blue-950 font-extrabold">{role.companyName || "Tech Enterprise"}</strong>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Hiring
                  </span>
                </div>

                {/* 2. Highlighted Role Name Title */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {role.title}
                  </h2>
                  <div className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span>{role.department}</span>
                  </div>
                </div>

                {/* Meta details (Location, Experience, Salary) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{role.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{role.experienceRequired}</span>
                  </div>
                  {role.salaryRange && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold col-span-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{role.salaryRange}</span>
                    </div>
                  )}
                </div>

                {/* Skills Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Required Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.skillsRequired.slice(0, 5).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[11px] font-medium rounded-md border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {role.skillsRequired.length > 5 && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-md">
                        +{role.skillsRequired.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewRole(role)}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-200/70 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Job Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRole(role)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-sm"
                >
                  <span>Select Role & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Details Preview Modal */}
      {previewRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{previewRole.companyName || "Tech Enterprise"}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">{previewRole.title}</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {previewRole.department} • {previewRole.location} • {previewRole.experienceRequired}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewRole(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Salary and Qualifications Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block uppercase font-bold">Compensation</span>
                <strong className="text-emerald-700">{previewRole.salaryRange || "Competitive Market Rate"}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block uppercase font-bold">Min Qualification Match</span>
                <strong className="text-blue-700">{previewRole.minMatchThreshold}% Semantic Score</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block uppercase font-bold">Employment Type</span>
                <strong className="text-gray-800">{previewRole.employmentType || "Full-time"}</strong>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Required Technical Skills:</h4>
              <div className="flex flex-wrap gap-1.5">
                {previewRole.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Full Job Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Full Job Description:</h4>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 whitespace-pre-line leading-relaxed font-mono">
                {previewRole.jobDescription}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPreviewRole(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const r = previewRole;
                  setPreviewRole(null);
                  onSelectRole(r);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Proceed with This Role & Fill Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
