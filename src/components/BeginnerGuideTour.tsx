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
              Welcome to Gemini AI Video Interviewer!
            </h2>
            <p className="text-xs text-gray-500">
              Here is your quick, beginner-friendly roadmap to navigate every feature.
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
                Resume & Job Description Analysis
                <span className="text-[10px] bg-blue-100 text-[#1a73e8] px-2 py-0.5 rounded-full font-semibold normal-case tracking-normal">
                  Instant Samples Available
                </span>
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Click <strong>"Load Sample Candidate"</strong> to immediately populate candidate details, skills, and target job description. Gemini automatically matches qualifications and crafts a tailored interview roadmap.
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
                Before the interview starts, the system guides you to scan 5 angles (Front, Left, Right, Desk, Behind). AI computer vision verifies an uncluttered, authorized workspace.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-[#EA4335] flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Video className="w-4 h-4 text-[#EA4335]" />
                Interactive Video Meeting & Speech
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold normal-case tracking-normal">
                  Multilingual
                </span>
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Experience a natural video call with the AI avatar. Speak into your microphone in <strong>English, Hindi (हिंदी), or mixed Hinglish</strong>. The AI detects your language in real time and speaks back with voice output!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-amber-600" />
                Silent Device & Monocular Depth Proximity Detection
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                The vision engine silently scans video frames for nearby mobile phones, laptops, or extra people using bounding boxes and <span className="font-semibold text-amber-800">&lt;3-foot proximity estimation</span>. <em>Crucially, it never interrupts the candidate</em>; all events are silently logged for HR review.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-[#4285F4] flex items-center justify-center font-bold text-xs shrink-0">
              5
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-[#4285F4]" />
                Live Coding Sandbox & Test Runner
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Click <strong>"Live Code"</strong> to solve real algorithmic coding challenges in JavaScript or Python. Execute code against test suites and receive immediate AI complexity analysis ($O(N)$) and follow-up probes.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-[#34A853] flex items-center justify-center font-bold text-xs shrink-0">
              6
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#34A853]" />
                Evidence-Based Final Assessment & HR Audit
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                At the conclusion, receive a comprehensive evaluation: Technical Knowledge, Problem Solving, Coding, Debugging, and Communication, with observable citations, constructive improvement feedback, and downloadable PDF reports.
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
            I'll Explore on My Own
          </button>
          <button
            onClick={() => {
              onClose();
              onSelectSampleAndStart();
            }}
            className="px-5 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <span>Launch Quick 1-Click Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
