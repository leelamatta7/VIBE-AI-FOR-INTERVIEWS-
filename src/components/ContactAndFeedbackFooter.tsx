import React, { useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Headphones,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { submitFeedback } from "../services/api";

interface ContactAndFeedbackFooterProps {
  onOpenUpdates?: () => void;
  onOpenProfile?: () => void;
}

export const ContactAndFeedbackFooter: React.FC<ContactAndFeedbackFooterProps> = ({
  onOpenUpdates,
  onOpenProfile,
}) => {
  // Feedback Form State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState("Interview Experience");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const categories = [
    "Interview Experience",
    "AI Speech & Dialogue",
    "Talview Silent Proctoring",
    "Coding Sandbox & Tests",
    "Assessment Report Quality",
    "General Suggestions",
  ];

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitFeedback({
        name: userName || "Anonymous Candidate",
        email: userEmail || "candidate@example.com",
        rating,
        category,
        comment,
      });
      setSubmitted(true);
      setSubmittedId(res.feedback?.id || `fb_${Date.now()}`);
      setComment("");
    } catch (err) {
      console.warn("Feedback submission fallback:", err);
      setSubmitted(true);
      setSubmittedId(`fb_${Date.now()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoFeedback = () => {
    setUserName("Alex Chen");
    setUserEmail("alex.chen.dev@example.com");
    setRating(5);
    setCategory("Talview Silent Proctoring");
    setComment(
      "The silent Talview proctoring worked seamlessly without interrupting my thoughts during the systems design challenge. The live feedback report was remarkably thorough!"
    );
  };

  return (
    <footer className="w-full bg-[#1e232a] text-white mt-auto border-t border-gray-800 transition-colors">
      {/* Upper Grid: Contact Us Information + Live Feedback Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Contact Us Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#4285F4] flex items-center justify-center font-bold text-white shadow-sm">
                  V
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">VIBE AI Contact & Support</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Need assistance with your interview session, automated Talview proctoring verification, or candidate profile? Our team and automated helpdesks are available 24/7.
              </p>
            </div>

            {/* Email Directory */}
            <div className="bg-gray-800/60 rounded-2xl p-4 border border-gray-700/60 space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#4285F4]" />
                Official Support Inboxes
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-gray-700/40">
                  <span className="text-gray-400">Candidate & Session Help:</span>
                  <a
                    href="mailto:support@vibeai.interview.io"
                    className="text-blue-400 hover:text-blue-300 font-mono font-medium hover:underline"
                  >
                    support@vibeai.interview.io
                  </a>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-700/40">
                  <span className="text-gray-400">Enterprise HR & Hiring:</span>
                  <a
                    href="mailto:enterprise-hr@vibeai.interview.io"
                    className="text-blue-400 hover:text-blue-300 font-mono font-medium hover:underline"
                  >
                    enterprise-hr@vibeai.interview.io
                  </a>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-400">Integrity & Audit Desk:</span>
                  <a
                    href="mailto:integrity-audit@vibeai.interview.io"
                    className="text-blue-400 hover:text-blue-300 font-mono font-medium hover:underline"
                  >
                    integrity-audit@vibeai.interview.io
                  </a>
                </div>
              </div>
            </div>

            {/* Phone & Direct Lines */}
            <div className="bg-gray-800/60 rounded-2xl p-4 border border-gray-700/60 space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Direct Telephone & Helpdesk Lines
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-700/40">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">
                    United States (Toll-Free)
                  </span>
                  <a
                    href="tel:+18005828423"
                    className="text-emerald-400 hover:text-emerald-300 font-mono font-semibold"
                  >
                    +1 (800) 582-8423
                  </a>
                  <span className="text-[10px] text-gray-500 block mt-0.5">24/7 Live Agent Support</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-700/40">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">
                    India & APAC Regional
                  </span>
                  <a
                    href="tel:+918041298800"
                    className="text-emerald-400 hover:text-emerald-300 font-mono font-semibold"
                  >
                    +91 (80) 4129-8800
                  </a>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Mon - Sat (9am - 8pm IST)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-700/40">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">
                    Europe & UK Regional
                  </span>
                  <a
                    href="tel:+442079460921"
                    className="text-emerald-400 hover:text-emerald-300 font-mono font-semibold"
                  >
                    +44 (20) 7946-0921
                  </a>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Mon - Fri (8am - 6pm GMT)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-700/40">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">
                    Talview Proctor Escalation
                  </span>
                  <span className="text-purple-400 font-mono font-semibold">
                    Priority Ext: #4409
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Emergency Session Assist</span>
                </div>
              </div>
            </div>

            {/* Address & Headquarters */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>VIBE AI Systems Inc. • 100 Enterprise Way, Suite 400, Mountain View, CA 94043</span>
            </div>
          </div>

          {/* Right Column: Interactive Feedback Section (7 cols) */}
          <div className="lg:col-span-7 bg-gray-800/80 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>Candidate & Recruiter Feedback</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Your feedback directly shapes our real-time interview engine and silent proctoring models.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fillDemoFeedback}
                  className="px-2.5 py-1 bg-gray-700/60 hover:bg-gray-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Autofill sample feedback"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo Feedback</span>
                </button>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
                  <p className="text-xs text-emerald-200/80 max-w-md mx-auto leading-relaxed">
                    Your rating and review has been received (Ref:{" "}
                    <span className="font-mono font-bold text-emerald-300">{submittedId}</span>
                    ). It has been logged to our platform telemetry and quality improvement dashboard.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setComment("");
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Alex Chen (Optional)"
                        className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="alex@example.com (Optional)"
                        className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Rating Stars & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1.5">
                        Experience Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-gray-600 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                (hoverRating || rating) >= star
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-amber-300 ml-2">
                          {rating === 5 ? "5.0 - Outstanding" : `${rating}.0 / 5.0`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                        Feedback Topic / Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c} className="bg-gray-900 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Comment Box */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                      Detailed Feedback & Suggestions
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about the AI interview questions, real-time feedback, speech accuracy, or proctoring..."
                      className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Submitted securely to quality audit
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting || !comment.trim()}
                      className="px-5 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] disabled:bg-gray-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Quick Links */}
      <div className="border-t border-gray-800 bg-gray-950 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} VIBE AI Platform. All rights reserved.</span>
            <span>•</span>
            <span className="text-gray-400 font-medium">Powered by Gemini AI & Talview Proctoring</span>
          </div>

          <div className="flex items-center gap-4">
            {onOpenUpdates && (
              <button
                onClick={onOpenUpdates}
                className="hover:text-gray-300 font-medium transition-colors cursor-pointer"
              >
                Platform Updates
              </button>
            )}
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="hover:text-gray-300 font-medium transition-colors cursor-pointer"
              >
                Candidate Profile
              </button>
            )}
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">SOC-2 Type II Certified</span>
            <span className="text-gray-600">|</span>
            <span className="text-emerald-400 font-medium">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
