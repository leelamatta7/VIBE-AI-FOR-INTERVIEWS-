import React, { useState } from "react";
import {
  X,
  Sparkles,
  Shield,
  Zap,
  Cpu,
  Globe,
  Radio,
  CheckCircle,
  Clock,
  Tag,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { PRODUCT_UPDATES } from "../data/updatesData";
import { ProductUpdate } from "../types";

interface ProductUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductUpdatesModal: React.FC<ProductUpdatesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [activeUpdate, setActiveUpdate] = useState<ProductUpdate>(PRODUCT_UPDATES[0]);

  if (!isOpen) return null;

  const tags = ["All", "Talview AI", "Feature", "Enhancement", "Security"];

  const filteredUpdates =
    selectedTag === "All"
      ? PRODUCT_UPDATES
      : PRODUCT_UPDATES.filter((u) => u.tag.toLowerCase() === selectedTag.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">VIBE AI System Updates & Changelog</h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                  v2.4 Live
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Track new platform capabilities, silent proctoring models, and AI engine improvements.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Filters */}
        <div className="px-6 py-2.5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Filter:</span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-[#4285F4] text-white shadow-2xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Modal Body: Left List & Right Detail View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Updates List */}
          <div className="w-full md:w-[320px] border-r border-gray-100 overflow-y-auto p-3 space-y-2 bg-gray-50/30">
            {filteredUpdates.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveUpdate(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeUpdate.version === item.version
                    ? "bg-white border-[#4285F4] shadow-xs ring-1 ring-[#4285F4]/20"
                    : "bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {item.version}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Selected Update Detail */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-md text-xs font-bold font-mono">
                    {activeUpdate.version}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-semibold">
                    {activeUpdate.tag}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{activeUpdate.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{activeUpdate.title}</h3>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 leading-relaxed">
              {activeUpdate.description}
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Key Highlights & Enhancements
              </h4>
              <ul className="space-y-2">
                {activeUpdate.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Release cadence: Bi-weekly auto deployments
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
