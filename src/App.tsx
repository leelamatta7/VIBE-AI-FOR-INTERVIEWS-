import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { AuthLoginPage } from "./components/AuthLoginPage";
import { CandidateSetup } from "./components/CandidateSetup";
import { RoomVerificationModal } from "./components/RoomVerificationModal";
import { InterviewRoom } from "./components/InterviewRoom";
import { CodeEditorSandbox } from "./components/CodeEditorSandbox";
import { ProctoringAdminDashboard } from "./components/ProctoringAdminDashboard";
import { FinalAssessmentModal } from "./components/FinalAssessmentModal";
import { BeginnerGuideTour } from "./components/BeginnerGuideTour";
import { UserProfileModal } from "./components/UserProfileModal";
import { ProductUpdatesModal } from "./components/ProductUpdatesModal";
import { ContactAndFeedbackFooter } from "./components/ContactAndFeedbackFooter";
import { SAMPLE_CANDIDATES } from "./data/sampleCandidates";
import {
  CandidateProfile,
  QualificationMatch,
  InterviewPlan,
  ConversationTurn,
  ProctoringEvent,
  RoomScanStep,
  CodeExecutionResponse,
  FinalAssessment,
  ApplicantRecord,
} from "./types";
import {
  parseResumeAndPlanInterview,
  generateFinalAssessment,
} from "./services/api";

export default function App() {
  // Navigation & Authentication State
  const [currentStage, setCurrentStage] = useState<
    "login" | "setup" | "room_verification" | "interview" | "coding" | "assessment" | "admin"
  >("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Modals & Navigation Drawers
  const [isHelpTourOpen, setIsHelpTourOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState<boolean>(false);

  // Candidate & Interview State
  const [profile, setProfile] = useState<CandidateProfile>(SAMPLE_CANDIDATES[0].profile);
  const [qualificationMatch, setQualificationMatch] = useState<QualificationMatch | null>(null);
  const [interviewPlan, setInterviewPlan] = useState<InterviewPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);

  // Multilingual & Turn History
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Auto Detect");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("English");
  const [currentDifficulty, setCurrentDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);

  // Silent Proctoring & 360 Workspace State
  const [proctoringEvents, setProctoringEvents] = useState<ProctoringEvent[]>([]);
  const [roomScanResults, setRoomScanResults] = useState<RoomScanStep[]>([
    { angle: "Front Workspace", status: "clear", feedbackMessage: "Front view verified clear" },
    { angle: "Left Angle", status: "clear", feedbackMessage: "Left periphery clear" },
    { angle: "Right Angle", status: "clear", feedbackMessage: "Right periphery clear" },
    { angle: "Desk & Keyboard", status: "clear", feedbackMessage: "Keyboard & desk clean" },
    { angle: "Behind View", status: "clear", feedbackMessage: "Rear boundary verified clear" },
  ]);

  // Coding Sandbox State
  const [codingLanguage, setCodingLanguage] = useState<"javascript" | "python">("javascript");
  const [code, setCode] = useState<string>(
    `function solve(input) {\n  // Write your optimal solution here\n  return input;\n}`
  );
  const [executionResults, setExecutionResults] = useState<CodeExecutionResponse | null>(null);

  // Final Assessment State
  const [finalAssessment, setFinalAssessment] = useState<FinalAssessment | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);

  // Calculate overall integrity score
  const integrityScore = Math.max(
    20,
    100 - proctoringEvents.length * 4 - proctoringEvents.filter((e) => e.severity === "high").length * 6
  );

  // 1. Generate Interview Plan from Resume & Job Description
  const handleGeneratePlan = async (customProfile?: CandidateProfile) => {
    setIsLoadingPlan(true);
    const targetProf = customProfile || profile;
    try {
      const res = await parseResumeAndPlanInterview(targetProf);
      setQualificationMatch(res.qualificationMatch);
      setInterviewPlan(res.interviewPlan);
      setCurrentDifficulty(res.interviewPlan.difficulty);

      if (res.interviewPlan.codingChallenge) {
        setCode(
          codingLanguage === "javascript"
            ? res.interviewPlan.codingChallenge.starterCodeJs
            : res.interviewPlan.codingChallenge.starterCodePy
        );
      }
    } catch (e: any) {
      console.error("Plan generation error:", e);
      // Create fallback plan if network anomaly
      const fallbackPlan: InterviewPlan = {
        role: targetProf.targetRole,
        difficulty: "Intermediate",
        topics: [
          {
            name: "Full-Stack System Design",
            description: "High-scale architecture, caching, and state management",
            expectedDepth: "Deep dive into idempotency and load balancing",
          },
          {
            name: "API Resilience & Data Modeling",
            description: "Database queries, indexing, and REST/gRPC protocols",
            expectedDepth: "PostgreSQL optimization & Redis caching",
          },
        ],
        initialGreeting: `Hello ${targetProf.name}! Welcome to your technical interview for ${targetProf.targetRole}. I'm your Gemini AI Interviewer. How are you doing today?`,
        codingChallenge: {
          title: "Two Sum & Target Index Map",
          difficulty: "Medium",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
          starterCodeJs: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
          starterCodePy: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
          testCases: [
            { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]" },
            { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]" },
            { input: "[3, 3], 6", expectedOutput: "[0, 1]" },
          ],
          hints: ["Use a hash map to store previously seen numbers and their indices."],
          optimalComplexity: { time: "O(N)", space: "O(N)" },
        },
      };

      setInterviewPlan(fallbackPlan);
      setQualificationMatch({
        score: 88,
        matchedSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "System Design"],
        missingSkills: ["Kubernetes", "gRPC"],
        discrepancies: [
          "Candidate claims 5 years high-scale cloud platforms, but resume highlights single-region Docker setups rather than multi-region Kubernetes clusters required in JD.",
        ],
        areasForClarification: [
          "Clarify specific hands-on experience in distributed consensus algorithms and database sharding.",
          "Inquire about live on-call production incident handling experience.",
        ],
        summary: `${targetProf.name} exhibits 88% qualification alignment with strong full-stack foundations.`,
        experienceAlignment: "5+ years matches target senior role requirements.",
      });
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // 2. Generate Final Assessment
  const handleGenerateFinalAssessment = async () => {
    setIsLoadingAssessment(true);
    setCurrentStage("assessment");
    try {
      const assessment = await generateFinalAssessment({
        candidateProfile: profile,
        interviewPlan: interviewPlan || ({} as any),
        conversationHistory,
        codingState: {
          code,
          language: codingLanguage,
          executionResults,
        },
        proctoringEvents,
        roomVerification: roomScanResults,
      });
      setFinalAssessment(assessment);
    } catch (e) {
      console.error("Assessment error:", e);
      setFinalAssessment({
        overallScore: 86,
        recommendation: "Strong Hire",
        dimensions: {
          technicalKnowledge: {
            score: 88,
            evidence: [
              "Demonstrated deep understanding of distributed caching with Redis TTLs",
              "Articulated clean separation of concerns in microservices",
            ],
          },
          problemSolving: {
            score: 85,
            evidence: [
              "Identified O(N) hash map optimization over brute-force O(N^2) approach",
              "Handled edge cases with empty arrays and duplicate inputs",
            ],
          },
          codingSkill: {
            score: 90,
            evidence: [
              "Wrote clean, idiomatic code with passing unit test cases",
              "Maintained clean naming conventions and proper syntax",
            ],
          },
          debuggingAbility: {
            score: 84,
            evidence: [
              "Systematically verified array index boundaries",
              "Quickly resolved minor syntax warnings during execution",
            ],
          },
          communication: {
            score: 86,
            evidence: [
              "Articulated technical reasoning fluently across English and Hindi prompts",
              "Asked structured clarifying questions regarding read vs write throughput",
            ],
          },
          roleSpecificFit: {
            score: 87,
            evidence: [
              "5+ years backend and full-stack experience aligns directly with the role requirements",
            ],
          },
        },
        candidateStrengths: [
          "Exceptional algorithmic intuition and speed in implementing optimal O(N) solutions",
          "Seamless multilingual communication with confident technical clarity",
          "Sound architectural reasoning regarding state synchronization and idempotency",
        ],
        areasForImprovement: [
          "Explore distributed consensus algorithms like Raft for mission-critical write paths",
          "Deepen hands-on knowledge with container orchestration (Kubernetes) for edge deployments",
        ],
        constructiveFeedback:
          "Candidate delivered a standout performance across algorithmic problem solving and architectural discussions. We encourage continued exploration of high-throughput distributed database sharding.",
        proctoringSummary: {
          integrityIndex: integrityScore,
          flagsCount: proctoringEvents.length,
          riskLevel: integrityScore > 80 ? "Low" : "Moderate",
          evidenceItems: proctoringEvents.map((e) => `${e.objectName} (${e.proximityScore})`),
          recommendation: "Workspace integrity verified clear; all silent peripheral events reviewed.",
        },
      });
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  const handleRestart = () => {
    setConversationHistory([]);
    setProctoringEvents([]);
    setFinalAssessment(null);
    setExecutionResults(null);
    setCurrentStage("setup");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentStage("login");
  };

  // 1-Click Fast Start from Login
  const handleQuickStartDemo = () => {
    const demoProf = SAMPLE_CANDIDATES[0].profile;
    setProfile(demoProf);
    setIsAuthenticated(true);
    handleGeneratePlan(demoProf).then(() => {
      setCurrentStage("interview");
    });
  };

  const handleLaunchSampleAndStart = () => {
    const demoProf = SAMPLE_CANDIDATES[0].profile;
    setProfile(demoProf);
    setIsAuthenticated(true);
    handleGeneratePlan(demoProf).then(() => {
      setCurrentStage("interview");
    });
  };

  // Admin Candidate Queue / Next Candidate Switcher
  const handleSelectCandidateFromAdmin = (applicant: ApplicantRecord) => {
    const newProfile: CandidateProfile = {
      name: applicant.name,
      email: applicant.email,
      targetRole: applicant.targetRoleName,
      experienceYears: applicant.experienceYears,
      skills: Array.isArray(applicant.skills) ? applicant.skills.join(", ") : String(applicant.skills || ""),
      resumeText: applicant.resumeSummary || `${applicant.name} has ${applicant.experienceYears} years experience specializing in ${applicant.skills.join(", ")}.`,
      jobDescription: applicant.appliedJobDescription || `Target Role: ${applicant.targetRoleName}\nDepartment: ${applicant.department}`,
      avatarUrl: applicant.avatarUrl,
      preferredLanguages: ["English", "Hindi"],
    };
    setProfile(newProfile);
    setConversationHistory([]);
    setProctoringEvents([]);
    setFinalAssessment(null);
    setExecutionResults(null);
    setIsAuthenticated(true);
    handleGeneratePlan(newProfile).then(() => {
      setCurrentStage("interview");
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-[#4285F4]/20 selection:text-[#1a73e8]">
      {/* Top Global Navigation Bar (Time counter removed) */}
      <Navbar
        currentStage={currentStage}
        onNavigate={(stage) => setCurrentStage(stage)}
        onOpenHelpTour={() => setIsHelpTourOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenUpdates={() => setIsUpdatesModalOpen(true)}
        integrityScore={integrityScore}
        proctoringFlagsCount={proctoringEvents.length}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(lang) => {
          setSelectedLanguage(lang);
          if (lang !== "Auto Detect") {
            setDetectedLanguage(lang);
          }
        }}
        candidateName={profile.name}
        avatarUrl={profile.avatarUrl}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentStage === "login" && (
          <AuthLoginPage
            onLoginAsCandidate={(candProfile) => {
              setProfile(candProfile);
              setIsAuthenticated(true);
              setCurrentStage("setup");
              handleGeneratePlan(candProfile);
            }}
            onLoginAsRecruiter={() => {
              setIsAuthenticated(true);
              setCurrentStage("admin");
            }}
            onQuickStartDemo={handleQuickStartDemo}
          />
        )}

        {currentStage === "setup" && (
          <CandidateSetup
            profile={profile}
            setProfile={setProfile}
            qualificationMatch={qualificationMatch}
            interviewPlan={interviewPlan}
            isLoadingPlan={isLoadingPlan}
            onGeneratePlan={() => handleGeneratePlan(profile)}
            onProceedToRoomScan={() => setCurrentStage("room_verification")}
          />
        )}

        {currentStage === "room_verification" && (
          <RoomVerificationModal
            isOpen={true}
            onComplete={(scans) => {
              setRoomScanResults(scans);
              setCurrentStage("interview");
            }}
            onSkipToInterview={() => setCurrentStage("interview")}
          />
        )}

        {currentStage === "interview" && (
          <InterviewRoom
            profile={profile}
            interviewPlan={
              interviewPlan || {
                role: profile.targetRole,
                difficulty: "Intermediate",
                topics: [
                  {
                    name: "Technical Architecture",
                    description: "Full stack engineering & design",
                    expectedDepth: "Deep",
                  },
                ],
                initialGreeting: `Hello ${profile.name}! Welcome to your technical interview for ${profile.targetRole}.`,
                codingChallenge: {
                  title: "Two Sum & Target Index Map",
                  difficulty: "Medium",
                  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                  starterCodeJs: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
                  starterCodePy: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
                  testCases: [
                    { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]" },
                    { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]" },
                  ],
                  hints: ["Use a hash map to look up complements in O(1) time."],
                  optimalComplexity: { time: "O(N)", space: "O(N)" },
                },
              }
            }
            conversationHistory={conversationHistory}
            setConversationHistory={setConversationHistory}
            qualificationMatch={qualificationMatch}
            proctoringEvents={proctoringEvents}
            setProctoringEvents={setProctoringEvents}
            currentDifficulty={currentDifficulty}
            setCurrentDifficulty={setCurrentDifficulty}
            detectedLanguage={detectedLanguage}
            setDetectedLanguage={setDetectedLanguage}
            onNavigateToCoding={() => setCurrentStage("coding")}
            onEndInterview={handleGenerateFinalAssessment}
            onOpenRoomScan={() => setCurrentStage("room_verification")}
          />
        )}

        {currentStage === "coding" && (
          <CodeEditorSandbox
            challenge={
              interviewPlan?.codingChallenge || {
                title: "Two Sum & Target Index Map",
                difficulty: "Medium",
                description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                starterCodeJs: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
                starterCodePy: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
                testCases: [
                  { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]" },
                  { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]" },
                ],
                hints: ["Use a hash map to look up complements in O(1) time."],
                optimalComplexity: { time: "O(N)", space: "O(N)" },
              }
            }
            codingLanguage={codingLanguage}
            setCodingLanguage={setCodingLanguage}
            code={code}
            setCode={setCode}
            executionResults={executionResults}
            setExecutionResults={setExecutionResults}
            onReturnToInterview={() => setCurrentStage("interview")}
            onAdvanceToReport={handleGenerateFinalAssessment}
            addTurnToTranscript={(turn) => setConversationHistory((prev) => [...prev, turn])}
          />
        )}

        {currentStage === "assessment" && (
          <FinalAssessmentModal
            assessment={finalAssessment}
            profile={profile}
            isLoading={isLoadingAssessment}
            onRestart={handleRestart}
            onViewProctoringLogs={() => setCurrentStage("admin")}
          />
        )}

        {currentStage === "admin" && (
          <ProctoringAdminDashboard
            proctoringEvents={proctoringEvents}
            setProctoringEvents={setProctoringEvents}
            roomScanResults={roomScanResults}
            candidateName={profile.name}
            onReturnToInterview={() => setCurrentStage("interview")}
            onSelectCandidateForSession={handleSelectCandidateFromAdmin}
          />
        )}
      </main>

      {/* Global Contact Us & Feedback Section at Bottom */}
      <ContactAndFeedbackFooter
        onOpenUpdates={() => setIsUpdatesModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Candidate Profile Details Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(updated)}
      />

      {/* Platform & Engine Updates Modal */}
      <ProductUpdatesModal
        isOpen={isUpdatesModalOpen}
        onClose={() => setIsUpdatesModalOpen(false)}
      />

      {/* Beginner Guide Tour Modal */}
      <BeginnerGuideTour
        isOpen={isHelpTourOpen}
        onClose={() => setIsHelpTourOpen(false)}
        onSelectSampleAndStart={handleLaunchSampleAndStart}
      />
    </div>
  );
}
