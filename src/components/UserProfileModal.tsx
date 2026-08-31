import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  FileText,
  Sparkles,
  CheckCircle,
  Clock,
  Award,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  Globe,
  Shield,
  Save,
} from "lucide-react";
import { CandidateProfile } from "../types";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  onUpdateProfile: (updated: CandidateProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "resume" | "experience" | "education">("overview");
  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4285F4]/10 border border-[#4285F4]/20 flex items-center justify-center overflow-hidden">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-[#4285F4]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{formData.name || "Candidate Profile"}</h2>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Verified Candidate
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <span>{formData.targetRole || "Software Engineer"}</span>
                <span>•</span>
                <span>{formData.experienceYears} Years Exp</span>
                <span>•</span>
                <span>{formData.location || "Remote / Global"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6 gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "overview"
                ? "border-[#4285F4] text-[#4285F4] bg-white rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal & Job Details</span>
          </button>

          <button
            onClick={() => setActiveTab("resume")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "resume"
                ? "border-[#4285F4] text-[#4285F4] bg-white rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV & Resume Document</span>
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "experience"
                ? "border-[#4285F4] text-[#4285F4] bg-white rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Work History ({formData.workExperience?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "education"
                ? "border-[#4285F4] text-[#4285F4] bg-white rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Education & Degrees ({formData.education?.length || 0})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Candidate full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="+1 (555) 342-8921"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Current Location
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="City, State / Remote"
                  />
                </div>
              </div>

              {/* Target Role */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Target Role / Job Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </div>
              </div>

              {/* Experience Years */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Years of Professional Experience
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Key Skills & Technical Stack
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="React, TypeScript, Node.js, Python, PostgreSQL, AWS..."
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.skills
                    .split(/[,;]/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              {/* Profile Photo URL */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider block mb-1">
                  Profile Photo Avatar URL
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    value={formData.avatarUrl || ""}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  {formData.avatarUrl && (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar preview"
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "resume" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Full Resume / CV Text
                  </h4>
                  <p className="text-xs text-gray-500">
                    This CV content is parsed by Gemini AI to tailor your interview questions, detect discrepancies, and design your coding problem.
                  </p>
                </div>
                {formData.resumeUrl && (
                  <a
                    href={formData.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                  >
                    <span>View PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <textarea
                rows={12}
                value={formData.resumeText}
                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono leading-relaxed text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Paste or write detailed resume text here..."
              />
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Work Experience History
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const newExp = {
                      company: "New Company",
                      role: "Software Engineer",
                      duration: "2024 - Present",
                      description: "Built scalable web features and microservices.",
                    };
                    setFormData({
                      ...formData,
                      workExperience: [...(formData.workExperience || []), newExp],
                    });
                  }}
                  className="px-3 py-1 bg-[#4285F4] text-white rounded-lg text-xs font-bold hover:bg-[#3367D6] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.workExperience || []).map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-2xl relative space-y-2 group"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.workExperience || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, workExperience: updated });
                      }}
                      className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                      title="Remove entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...(formData.workExperience || [])];
                            updated[idx].company = e.target.value;
                            setFormData({ ...formData, workExperience: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block">
                          Title / Role
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...(formData.workExperience || [])];
                            updated[idx].role = e.target.value;
                            setFormData({ ...formData, workExperience: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const updated = [...(formData.workExperience || [])];
                            updated[idx].duration = e.target.value;
                            setFormData({ ...formData, workExperience: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block">
                        Responsibilities & Impact
                      </label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...(formData.workExperience || [])];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, workExperience: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Education & Academic Degrees
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const newEdu = {
                      institution: "University Name",
                      degree: "B.S. in Computer Science",
                      year: "2024",
                    };
                    setFormData({
                      ...formData,
                      education: [...(formData.education || []), newEdu],
                    });
                  }}
                  className="px-3 py-1 bg-[#4285F4] text-white rounded-lg text-xs font-bold hover:bg-[#3367D6] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.education || []).map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-2xl relative space-y-2"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.education || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, education: updated });
                      }}
                      className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                      title="Remove entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...(formData.education || [])];
                            updated[idx].institution = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block">
                          Degree / Major
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...(formData.education || [])];
                            updated[idx].degree = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block">
                          Graduation Year
                        </label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const updated = [...(formData.education || [])];
                            updated[idx].year = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Profile details saved successfully!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
