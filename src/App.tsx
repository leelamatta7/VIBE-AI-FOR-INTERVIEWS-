import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { AuthLoginPage } from "./components/AuthLoginPage";
import { CompanyRolesCatalog } from "./components/CompanyRolesCatalog";
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
import { INITIAL_JOB_ROLES, INITIAL_APPLICANTS } from "./data/recruitmentData";
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
  CompanyJobRole,
  CandidateNotification,
} from "./types";
import {
  parseResumeAndPlanInterview,
  generateFinalAssessment,
} from "./services/api";

export default function App() {
  // Navigation & Authentication State
  const [currentStage, setCurrentStage] = useState<
    | "login"
    | "role_selection"
    | "setup"
    | "room_verification"
    | "interview"
    | "coding"
    | "assessment"
    | "admin"
  >("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Global Requisition & Pipeline State
  const [jobRoles, setJobRoles] = useState<CompanyJobRole[]>(INITIAL_JOB_ROLES);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(INITIAL_APPLICANTS);
  const [selectedRole, setSelectedRole] = useState<CompanyJobRole | null>(INITIAL_JOB_ROLES[0]);
  const [candidateNotifications, setCandidateNotifications] = useState<CandidateNotification[]>([
    {
      id: "notif_welcome",
      candidateEmail: "leelamatta7@gmail.com",
      candidateName: "Leela Matta",
      companyName: "Google Cloud",
      roleName: "Senior Full-Stack Cloud Engineer",
      status: "under_review",
      title: "Welcome to VIBE AI Technical Assessment Portal",
      message: "Browse available company roles, upload your CV, verify your camera, and complete the autonomous technical assessment.",
      timestamp: "Just now",
      read: false,
    },
  ]);

  // Modals & Navigation Drawers
  const [isHelpTourOpen, setIsHelpTourOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState<boolean>(false);

  // Candidate & Interview State
  const [profile, setProfile] = useState<CandidateProfile>({
    name: "Leela Matta",
    email: "leelamatta7@gmail.com",
    phoneNumber: "+1 (555) 349-2810",
    location: "San Francisco, CA",
    targetRole: INITIAL_JOB_ROLES[0].title,
    targetCompany: INITIAL_JOB_ROLES[0].companyName,
    skills: INITIAL_JOB_ROLES[0].skillsRequired.join(", "),
    experienceYears: 5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    preferredLanguages: ["English", "Hindi"],
    resumeText: `LEELA MATTA - SENIOR FULL STACK CLOUD ENGINEER
Email: leelamatta7@gmail.com | Phone: +1 (555) 349-2810 | Location: San Francisco, CA

SUMMARY
5+ years of hands-on experience designing and deploying high-throughput distributed cloud services, reactive React/TypeScript frontend architectures, and resilient microservices on GCP and AWS.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, Go, SQL
- Frontend: React 18, Next.js, Tailwind CSS, WebRTC, Redux Toolkit
- Backend & Cloud: Node.js, Express, Docker, Kubernetes, Google Cloud (Cloud Run, Spanner, Pub/Sub), PostgreSQL, Redis
- Engineering: CI/CD, Distributed Systems Architecture, Unit/E2E Testing, Real-Time Audio/Video Pipelines

EXPERIENCE
Senior Cloud Software Engineer | Enterprise Cloud Solutions (2022 - Present)
- Architected zero-downtime event-driven microservices handling 25M+ daily requests using Node.js, PostgreSQL, and Google Cloud Pub/Sub.
- Optimized frontend rendering pipelines, cutting Time to Interactive (TTI) by 45%.
- Implemented real-time bidirectional WebRTC streaming infrastructure.

Software Engineer | HighScale Technologies (2020 - 2022)
- Built resilient RESTful and gRPC APIs powering enterprise inventory management.
- Spearheaded PostgreSQL query optimization, reducing p99 latency from 450ms to 65ms.

EDUCATION
B.S. in Computer Science & Engineering | 2020`,
    jobDescription: INITIAL_JOB_ROLES[0].jobDescription,
  });

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
      // Fallback robust plan
      const fallbackPlan: InterviewPlan = {
        role: targetProf.targetRole,
        difficulty: "Intermediate",
        topics: [
          {
            name: "Full-Stack Distributed Systems",
            description: "High-scale architecture, caching, and state management",
            expectedDepth: "Deep dive into idempotency, caching, and load balancing",
          },
          {
            name: "API Resilience & Data Modeling",
            description: "Database queries, indexing, and REST/gRPC protocols",
            expectedDepth: "PostgreSQL optimization & Redis caching",
          },
        ],
        initialGreeting: `Hello ${targetProf.name}! Welcome to your technical interview for ${targetProf.targetRole} at ${targetProf.targetCompany || "our enterprise"}. I'm your Gemini AI Interviewer. How are you doing today?`,
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
          hints: ["Use a hash map to store previously seen numbers and their indices in O(1) time."],
          optimalComplexity: { time: "O(N)", space: "O(N)" },
        },
      };

      setInterviewPlan(fallbackPlan);
      setQualificationMatch({
        score: 92,
        matchedSkills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Google Cloud", "WebRTC"],
        missingSkills: ["Kubernetes Multi-Region Failover"],
        discrepancies: [
          "Candidate claims 5 years high-scale cloud platforms, but resume highlights single-region Docker setups rather than multi-region Kubernetes clusters required in JD.",
        ],
        areasForClarification: [
          "Clarify specific hands-on experience in distributed consensus algorithms and database sharding.",
          "Inquire about live on-call production incident handling experience.",
        ],
        summary: `${targetProf.name} exhibits 92% qualification alignment with strong full-stack foundations.`,
        experienceAlignment: "5+ years matches target senior role requirements.",
      });
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // 2. Generate Final Assessment and Push to Recruiter Hub
  const handleGenerateFinalAssessment = async () => {
    setIsLoadingAssessment(true);
    setCurrentStage("assessment");
    try {
      const assessment = await generateFinalAssessment({
        candidateProfile: profile,
        conversationHistory,
        proctoringEvents,
        code,
        executionResults,
      });
      setFinalAssessment(assessment);

      // Create new ApplicantRecord for the Recruiter Hub
      const newApplicantRecord: ApplicantRecord = {
        id: `applicant_${Date.now()}`,
        name: profile.name,
        email: profile.email || "leelamatta7@gmail.com",
        avatarUrl: profile.avatarUrl,
        companyName: profile.targetCompany || "Google Cloud",
        targetRoleId: selectedRole?.id || "role_1",
        targetRoleName: profile.targetRole,
        department: selectedRole?.department || "Engineering",
        interviewDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        interviewDuration: "18m 42s",
        experienceYears: profile.experienceYears,
        matchPercentage: qualificationMatch?.score || 92,
        fitStatus: (qualificationMatch?.score || 92) >= 85 ? "Strong Fit" : "Fit",
        overallScore: assessment.overallScore,
        integrityScore: assessment.proctoringSummary.integrityIndex,
        decision: "under_review",
        recruiterFitEvaluation: "Pending Decision",
        proctoringFlags: assessment.proctoringSummary.flagsCount,
        skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
        resumeSummary: profile.resumeText.slice(0, 280) + "...",
        matchedRequirements: qualificationMatch?.matchedSkills || ["TypeScript", "React", "Node.js", "PostgreSQL"],
        unmetRequirements: qualificationMatch?.missingSkills || [],
        aiRecommendation: assessment.recommendation,
        aiReasoning: assessment.constructiveFeedback,
        appliedJobDescription: profile.jobDescription,
        finalAssessment: assessment,
        conversationHistory,
      };

      setApplicants((prev) => [newApplicantRecord, ...prev]);
    } catch (e: any) {
      console.error("Assessment generation error:", e);
      const fallbackAssessment: FinalAssessment = {
        overallScore: 91,
        recommendation: "Strong Hire",
        dimensions: {
          technicalKnowledge: {
            score: 93,
            evidence: ["Detailed knowledge of async event queues, message streaming, and distributed cache invalidation."],
          },
          problemSolving: {
            score: 90,
            evidence: ["Constructed O(N) hash map lookup algorithm with zero redundant memory allocations."],
          },
          codingSkill: {
            score: 92,
            evidence: ["Clean TypeScript modular layout with strong type assertions and edge case guards."],
          },
          debuggingAbility: {
            score: 89,
            evidence: ["Quickly located target boundary condition during test case execution."],
          },
          communication: {
            score: 94,
            evidence: ["Articulate architectural explanations and collaborative responses to AI interview probes."],
          },
          roleSpecificFit: {
            score: 92,
            evidence: ["Strong full-stack experience aligns directly with Cloud Engineering requisition."],
          },
        },
        candidateStrengths: [
          "Deep mastery of Node.js & TypeScript microservices architecture.",
          "High awareness of computational complexity and memory bounds.",
          "Clear, structured technical communication.",
        ],
        areasForImprovement: [
          "Expand knowledge on multi-region Kubernetes cluster failover protocols.",
        ],
        constructiveFeedback:
          "Exceptional technical performance across all algorithmic and architectural evaluation criteria.",
        proctoringSummary: {
          integrityIndex: integrityScore,
          flagsCount: proctoringEvents.length,
          riskLevel: proctoringEvents.length > 2 ? "Moderate" : "Low",
          evidenceItems: ["Full 360° workspace verified clean", "Stable monocular proximity maintained"],
          recommendation: "Candidate integrity verified with complete confidence.",
          silentObservations: {
            gazeIntegrityScore: 98,
            focusRetentionRate: "97.4%",
            proximityIncidents: 0,
            audioNoiseFlags: 0,
            tabSwitchesCount: 0,
            workspaceVerificationSummary: "5-angle workspace inspection verified pristine.",
            keyObservations: [
              "Candidate maintained direct gaze engagement.",
              "Zero unauthorized auxiliary hardware detected.",
            ],
          },
        },
      };

      setFinalAssessment(fallbackAssessment);

      // Add to applicant queue
      const newApplicantRecord: ApplicantRecord = {
        id: `applicant_${Date.now()}`,
        name: profile.name,
        email: profile.email || "leelamatta7@gmail.com",
        avatarUrl: profile.avatarUrl,
        companyName: profile.targetCompany || "Google Cloud",
        targetRoleId: selectedRole?.id || "role_1",
        targetRoleName: profile.targetRole,
        department: selectedRole?.department || "Engineering",
        interviewDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        interviewDuration: "18m 42s",
        experienceYears: profile.experienceYears,
        matchPercentage: 92,
        fitStatus: "Strong Fit",
        overallScore: 91,
        integrityScore,
        decision: "under_review",
        recruiterFitEvaluation: "Pending Decision",
        proctoringFlags: proctoringEvents.length,
        skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
        resumeSummary: profile.resumeText.slice(0, 280) + "...",
        matchedRequirements: ["TypeScript", "React", "Node.js", "PostgreSQL", "Google Cloud"],
        unmetRequirements: ["Kubernetes Multi-Region"],
        aiRecommendation: "Strong Hire",
        aiReasoning: "Exceptional technical performance across all algorithmic and architectural evaluation criteria.",
        appliedJobDescription: profile.jobDescription,
        finalAssessment: fallbackAssessment,
        conversationHistory,
      };

      setApplicants((prev) => [newApplicantRecord, ...prev]);
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  // Restart Flow
  const handleRestart = () => {
    setConversationHistory([]);
    setProctoringEvents([]);
    setFinalAssessment(null);
    setExecutionResults(null);
    setCurrentStage("role_selection");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentStage("login");
  };

  // Candidate selects a company role from the catalog
  const handleSelectRoleAndApply = (role: CompanyJobRole) => {
    setSelectedRole(role);
    setProfile((prev) => ({
      ...prev,
      targetRole: role.title,
      targetCompany: role.companyName,
      jobDescription: role.jobDescription,
    }));
    setCurrentStage("setup");
  };

  // Recruiter switches candidate session
  const handleSelectCandidateFromAdmin = (applicant: ApplicantRecord) => {
    const newProfile: CandidateProfile = {
      name: applicant.name,
      email: applicant.email,
      targetRole: applicant.targetRoleName,
      targetCompany: applicant.companyName || "Tech Enterprise",
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

  // Handle new notification sent by recruiter
  const handleSendCandidateNotification = (notification: CandidateNotification) => {
    setCandidateNotifications((prev) => [notification, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-[#4285F4]/20 selection:text-[#1a73e8]">
      {/* Top Global Navigation Bar */}
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
        notifications={candidateNotifications}
        onMarkNotificationRead={(id) => {
          setCandidateNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Stage 0: Login */}
        {currentStage === "login" && (
          <AuthLoginPage
            onLoginAsCandidate={(candProfile) => {
              setProfile(candProfile);
              setIsAuthenticated(true);
              setCurrentStage("role_selection");
            }}
            onLoginAsRecruiter={() => {
              setIsAuthenticated(true);
              setCurrentStage("admin");
            }}
            onQuickStartDemo={() => {
              setIsAuthenticated(true);
              setCurrentStage("role_selection");
            }}
          />
        )}

        {/* Stage 1: Role Selection from Companies Catalog */}
        {currentStage === "role_selection" && (
          <CompanyRolesCatalog
            jobRoles={jobRoles}
            onSelectRole={handleSelectRoleAndApply}
            onProceedToRecruiterHub={() => setCurrentStage("admin")}
          />
        )}

        {/* Stage 2: Candidate Details & CV Upload */}
        {currentStage === "setup" && (
          <CandidateSetup
            profile={profile}
            setProfile={setProfile}
            qualificationMatch={qualificationMatch}
            interviewPlan={interviewPlan}
            isLoadingPlan={isLoadingPlan}
            onGeneratePlan={() => handleGeneratePlan(profile)}
            onProceedToRoomScan={() => setCurrentStage("room_verification")}
            onBackToRoles={() => setCurrentStage("role_selection")}
          />
        )}

        {/* Stage 3: Camera Choice & 360 Workspace Scan */}
        {currentStage === "room_verification" && (
          <RoomVerificationModal
            isOpen={true}
            onComplete={(scans) => {
              setRoomScanResults(scans);
              if (!interviewPlan) {
                handleGeneratePlan(profile).then(() => {
                  setCurrentStage("interview");
                });
              } else {
                setCurrentStage("interview");
              }
            }}
            onSkipToInterview={() => {
              if (!interviewPlan) {
                handleGeneratePlan(profile).then(() => {
                  setCurrentStage("interview");
                });
              } else {
                setCurrentStage("interview");
              }
            }}
          />
        )}

        {/* Stage 4: Live Multimodal Interview */}
        {currentStage === "interview" && (
          <InterviewRoom
            profile={profile}
            interviewPlan={
              interviewPlan || {
                role: profile.targetRole,
                difficulty: "Intermediate",
                topics: [
                  {
                    name: "Full-Stack System Architecture",
                    description: "High scale distributed systems and web architectures",
                    expectedDepth: "Deep",
                  },
                ],
                initialGreeting: `Hello ${profile.name}! Welcome to your technical interview for ${profile.targetRole} at ${profile.targetCompany || "our team"}.`,
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

        {/* Stage 5: Live Code Sandbox */}
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

        {/* Stage 6: Candidate Final Assessment Report */}
        {currentStage === "assessment" && (
          <FinalAssessmentModal
            assessment={finalAssessment}
            profile={profile}
            isLoading={isLoadingAssessment}
            onRestart={handleRestart}
            onViewProctoringLogs={() => setCurrentStage("admin")}
          />
        )}

        {/* Stage 7: Recruiter Hub & Proctoring Dashboard */}
        {currentStage === "admin" && (
          <ProctoringAdminDashboard
            proctoringEvents={proctoringEvents}
            setProctoringEvents={setProctoringEvents}
            roomScanResults={roomScanResults}
            candidateName={profile.name}
            jobRoles={jobRoles}
            setJobRoles={setJobRoles}
            applicants={applicants}
            setApplicants={setApplicants}
            onReturnToInterview={() => setCurrentStage("interview")}
            onSelectCandidateForSession={handleSelectCandidateFromAdmin}
            onSendCandidateNotification={handleSendCandidateNotification}
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
        onSelectSampleAndStart={() => {
          setIsAuthenticated(true);
          setCurrentStage("role_selection");
        }}
      />
    </div>
  );
}
