import React, { useState } from "react";
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  Terminal,
  HelpCircle,
  Cpu,
  Video,
} from "lucide-react";
import { CodingChallenge, CodeExecutionResponse, ConversationTurn } from "../types";
import { executeCandidateCode, evaluateCandidateCode } from "../services/api";

interface CodeEditorSandboxProps {
  challenge: CodingChallenge;
  codingLanguage: "javascript" | "python";
  setCodingLanguage: (lang: "javascript" | "python") => void;
  code: string;
  setCode: (code: string) => void;
  executionResults: CodeExecutionResponse | null;
  setExecutionResults: React.Dispatch<React.SetStateAction<CodeExecutionResponse | null>>;
  onReturnToInterview: () => void;
  onAdvanceToReport: () => void;
  addTurnToTranscript: (turn: ConversationTurn) => void;
}

export const CodeEditorSandbox: React.FC<CodeEditorSandboxProps> = ({
  challenge,
  codingLanguage,
  setCodingLanguage,
  code,
  setCode,
  executionResults,
  setExecutionResults,
  onReturnToInterview,
  onAdvanceToReport,
  addTurnToTranscript,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"test_results" | "ai_review" | "console">("test_results");
  const [showHints, setShowHints] = useState<boolean>(false);
  const [candidateNotes, setCandidateNotes] = useState<string>("");

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await executeCandidateCode({
        language: codingLanguage,
        code,
        testCases: challenge.testCases,
      });
      setExecutionResults(res);
      setActiveTab("test_results");
    } catch (e: any) {
      console.error("Execution error:", e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitAndEvaluate = async () => {
    setIsEvaluating(true);
    try {
      // First run tests if not already run
      let currentExec = executionResults;
      if (!currentExec) {
        currentExec = await executeCandidateCode({
          language: codingLanguage,
          code,
          testCases: challenge.testCases,
        });
        setExecutionResults(currentExec);
      }

      // Then request Gemini AI code analysis
      const analysis = await evaluateCandidateCode({
        code,
        language: codingLanguage,
        problemTitle: challenge.title,
        executionResults: currentExec,
        candidateExplanation: candidateNotes,
      });

      setExecutionResults((prev) =>
        prev
          ? {
              ...prev,
              aiAnalysis: analysis,
            }
          : null
      );

      // Add feedback to interview conversation turns
      addTurnToTranscript({
        id: `turn_code_${Date.now()}`,
        sender: "ai",
        text: `[Coding Review] ${analysis.feedback} Follow-up: ${analysis.suggestedFollowUp}`,
        language: "English",
        timestamp: Date.now(),
        eventTag: "code_review",
      });

      setActiveTab("ai_review");
    } catch (e: any) {
      console.error("Evaluation error:", e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetCode = () => {
    if (codingLanguage === "javascript") {
      setCode(challenge.starterCodeJs);
    } else {
      setCode(challenge.starterCodePy);
    }
  };

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a73e8]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                {challenge.title}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Live Algorithmic Evaluation • Optimal Time: {challenge.optimalComplexity.time} • Space: {challenge.optimalComplexity.space}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => {
                setCodingLanguage("javascript");
                setCode(challenge.starterCodeJs);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                codingLanguage === "javascript"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => {
                setCodingLanguage("python");
                setCode(challenge.starterCodePy);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                codingLanguage === "python"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Python 3
            </button>
          </div>

          <button
            onClick={onReturnToInterview}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Video className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Return to Video</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Problem Description, Test cases, Hints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Problem Statement
            </h3>
            <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-sans">
              {challenge.description}
            </div>

            {/* Test Case Preview */}
            <div>
              <span className="text-xs font-semibold text-gray-800 block mb-2">
                Sample Test Cases
              </span>
              <div className="space-y-2">
                {challenge.testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 font-mono text-[11px]"
                  >
                    <div className="text-gray-600">
                      Input: <span className="text-gray-900 font-semibold">{tc.input}</span>
                    </div>
                    <div className="text-gray-600">
                      Expected Output:{" "}
                      <span className="text-emerald-700 font-semibold">{tc.expectedOutput}</span>
                    </div>
                    {tc.explanation && (
                      <div className="text-[10px] text-gray-400 font-sans mt-0.5">
                        {tc.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hints Accordion */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-xs font-semibold text-[#1a73e8] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHints ? "Hide Algorithmic Hints" : "View Algorithmic Hints"}</span>
              </button>

              {showHints && (
                <div className="mt-2 p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-gray-700 space-y-1">
                  {challenge.hints.map((hint, i) => (
                    <p key={i}>• {hint}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Candidate explanation note */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Reasoning / Complexity Explanation (Optional)
              </label>
              <textarea
                rows={2}
                value={candidateNotes}
                onChange={(e) => setCandidateNotes(e.target.value)}
                placeholder="Explain your approach (e.g. Using two pointers with sliding window)..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Code Editor + Output / AI Analysis Pane */}
        <div className="lg:col-span-7 space-y-4">
          {/* Editor Container */}
          <div className="bg-gray-900 rounded-2xl border-4 border-white shadow-xl overflow-hidden flex flex-col">
            {/* Top Editor Bar */}
            <div className="px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-gray-400 ml-2">
                  solution.{codingLanguage === "javascript" ? "js" : "py"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetCode}
                  className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 cursor-pointer"
                >
                  Reset Template
                </button>
              </div>
            </div>

            {/* Code Textarea with Monospace styling */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={13}
                spellCheck={false}
                className="w-full p-4 bg-transparent text-sky-200 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-[#4285F4]/40"
              />
            </div>

            {/* Execution Buttons Bar */}
            <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Language: <strong className="text-gray-200">{codingLanguage}</strong>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-xl border border-gray-600 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isRunning ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>Run Tests</span>
                </button>

                <button
                  onClick={handleSubmitAndEvaluate}
                  disabled={isEvaluating}
                  className="px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Submit & AI Evaluate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Test Results / AI Review / Console Output Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab("test_results")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "test_results"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Test Results</span>
                  {executionResults && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        executionResults.passed === executionResults.total
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {executionResults.passed}/{executionResults.total}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("ai_review")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "ai_review"
                      ? "bg-[#4285F4] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini Code Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab("console")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "console"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console</span>
                </button>
              </div>

              <button
                onClick={onAdvanceToReport}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>Finish & View Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "test_results" && (
              <div>
                {executionResults ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-gray-800">
                        {executionResults.passed === executionResults.total ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> All {executionResults.total} Test Cases Passed!
                          </span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Passed {executionResults.passed} of {executionResults.total} test cases
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {executionResults.results.map((r) => (
                        <div
                          key={r.testIndex}
                          className={`p-3 rounded-xl border text-xs font-mono ${
                            r.passed
                              ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                              : "bg-red-50/70 border-red-200 text-red-950"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold">Test #{r.testIndex}</span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                r.passed
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {r.passed ? "PASSED" : "FAILED"}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-600">Input: {r.input}</div>
                          <div className="text-[11px] text-gray-600">Expected: {r.expected}</div>
                          <div className="text-[11px] font-semibold">Actual: {r.actual}</div>
                          {r.error && <div className="text-[10px] text-red-600 mt-1">{r.error}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    Click "Run Tests" to execute your solution against test cases.
                  </div>
                )}
              </div>
            )}

            {activeTab === "ai_review" && (
              <div>
                {executionResults?.aiAnalysis ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                          Time Complexity
                        </span>
                        <span className="font-bold text-sm text-gray-900 font-mono">
                          {executionResults.aiAnalysis.timeComplexity}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                          Space Complexity
                        </span>
                        <span className="font-bold text-sm text-gray-900 font-mono">
                          {executionResults.aiAnalysis.spaceComplexity}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                          Code Quality
                        </span>
                        <span className="font-bold text-sm text-[#4285F4]">
                          {executionResults.aiAnalysis.codeQualityScore} / 10
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1.5">
                      <span className="font-bold text-[#1a73e8] block">
                        Gemini Code Evaluation:
                      </span>
                      <p className="text-gray-800 leading-relaxed">
                        {executionResults.aiAnalysis.feedback}
                      </p>
                    </div>

                    <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 space-y-1.5">
                      <span className="font-bold text-purple-800 block">
                        Interviewer Follow-up Question:
                      </span>
                      <p className="text-gray-800 italic">
                        "{executionResults.aiAnalysis.suggestedFollowUp}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    Click "Submit & AI Evaluate" to receive Gemini complexity analysis & follow-up questions.
                  </div>
                )}
              </div>
            )}

            {activeTab === "console" && (
              <div className="p-3 bg-gray-900 rounded-xl font-mono text-xs text-gray-300 min-h-[100px]">
                {executionResults?.consoleOutput ? (
                  <pre className="whitespace-pre-wrap">{executionResults.consoleOutput}</pre>
                ) : (
                  <span className="text-gray-500">// No console logs generated</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
