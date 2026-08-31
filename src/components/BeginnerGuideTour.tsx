import React from "react";
import {
  Sparkles,
  CheckCircle2,
  Video,
  Mic,
  Code2,
  ShieldCheck,
  Award,
  ArrowRight,
  X,
  Globe2,
  Eye,
  Sliders,
  Layers,
  Cpu,
} from "lucide-react";

interface BeginnerGuideTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSampleAndStart: () => void;
}

export const BeginnerGuideTour: React.FC<BeginnerGuideTourProps> = ({
  isOpen,
  onClose,
  onSelectSampleAndStart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 relative text-[#202124]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          title="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#4285F4] shadow-2xs shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Real-Time AI Technical Interview Platform
            </h2>
            <p className="text-xs text-gray-500">
              Candidate Login: <code className="text-blue-600 font-bold font-mono">leelamatta7@gmail.com</code> | Password: <code className="text-blue-600 font-bold font-mono">12345678</code>
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#4285F4] flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                Real-Time Profile & Job Description Fit
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Configure your verified candidate credentials, target engineering role, experience, and skills. The platform analyzes qualification fit and customizes an adaptive interview agenda.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-[#34A853] flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#34A853]" />
                360° Workspace Camera Verification
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Before the interview starts, the system scans 5 angles (Front, Left, Right, Desk, Behind) to confirm a compliant, clean testing workspace.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-indigo-600" />
                LiveKit / Pipecat & WebRTC Real-Time Media Streams
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Bi-directional WebRTC audio/video feeds, sub-50ms Voice Activity Detection (VAD), and natural interruption handling.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Video className="w-4 h-4 text-purple-600" />
                Anam AI / HeyGen / D-ID Avatar & Viseme Lip-Sync
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Neural AI interviewer avatar with audio-reactive visemes, natural eye-blinks, adaptive head tilts, and multi-provider rendering.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
              5
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-amber-600" />
                Vapi / Retell AI Unified Orchestration
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Unified STT, Gemini LLM reasoning, and neural TTS synthesis with real-time latency telemetry.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#4285F4] flex items-center justify-center font-bold text-xs shrink-0">
              6
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-[#4285F4]" />
                Live Coding Sandbox & Test Runner
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Solve live coding problems with real test-case execution, complexity analysis ($O(N)$), and interactive debugging probes.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
          <button
            onClick={() => {
              onClose();
              onSelectSampleAndStart();
            }}
            className="px-5 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <span>Proceed to Interview Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
