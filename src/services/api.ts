import {
  CandidateProfile,
  QualificationMatch,
  InterviewPlan,
  ConversationTurn,
  CodeExecutionResponse,
  FinalAssessment,
  ProctoringEvent,
  RoomScanStep,
  CameraFrameAnalysisResponse,
  MultimodalInterviewStepResponse,
} from "../types";

export async function sendMultimodalInterviewStep(payload: {
  base64Frame?: string;
  candidateInput?: string;
  candidateName?: string;
  role?: string;
  conversationHistory?: any[];
  contents?: any[];
}): Promise<MultimodalInterviewStepResponse> {
  const res = await fetch("/api/interview-step", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to process multimodal interview step");
  }

  return res.json();
}

export async function parseResumeAndPlanInterview(profile: CandidateProfile): Promise<{
  qualificationMatch: QualificationMatch;
  interviewPlan: InterviewPlan;
}> {
  const res = await fetch("/api/resume/parse-and-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      candidateName: profile.name,
      targetRole: profile.targetRole,
      skills: profile.skills,
      experienceYears: profile.experienceYears,
      resumeText: profile.resumeText,
      jobDescription: profile.jobDescription,
      preferredLanguages: profile.preferredLanguages,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to analyze resume and plan interview");
  }

  return res.json();
}

export async function sendInterviewTurn(payload: {
  candidateName: string;
  role: string;
  conversationHistory: ConversationTurn[];
  candidateInput: string;
  currentTopic: string;
  currentDifficulty: string;
  targetLanguage: string;
  progressPercent: number;
  flaggedDiscrepancies?: string[];
  areasForClarification?: string[];
}): Promise<{
  detectedLanguage: string;
  responseSpeechText: string;
  adaptedDifficulty: "Beginner" | "Intermediate" | "Advanced";
  turnAssessment: {
    technicalUnderstandingScore: number;
    communicationClarityScore: number;
    evidenceNote: string;
    suggestedNextStage: string;
  };
}> {
  const res = await fetch("/api/interview/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to get interview response");
  }

  return res.json();
}

export async function analyzeCameraFrame(imageBase64: string): Promise<CameraFrameAnalysisResponse> {
  const res = await fetch("/api/vision/analyze-frame", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze vision frame");
  }

  return res.json();
}

export async function analyzeRoomScanAngle(angle: string, imageBase64: string): Promise<{
  angle: string;
  status: "clear" | "flagged";
  detectedItems: string[];
  riskRating: string;
  feedbackMessage: string;
  passed: boolean;
}> {
  const res = await fetch("/api/vision/room-scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ angle, imageBase64 }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze room angle");
  }

  return res.json();
}

export async function executeCandidateCode(payload: {
  language: string;
  code: string;
  testCases: any[];
}): Promise<CodeExecutionResponse> {
  const res = await fetch("/api/code/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to execute candidate code");
  }

  return res.json();
}

export async function evaluateCandidateCode(payload: {
  code: string;
  language: string;
  problemTitle: string;
  executionResults: any;
  candidateExplanation?: string;
}): Promise<{
  correctness: string;
  timeComplexity: string;
  spaceComplexity: string;
  codeQualityScore: number;
  edgeCasesHandled: boolean;
  feedback: string;
  suggestedFollowUp: string;
}> {
  const res = await fetch("/api/code/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to evaluate candidate code");
  }

  return res.json();
}

export async function generateFinalAssessment(payload: {
  candidateProfile: CandidateProfile;
  interviewPlan?: InterviewPlan | null;
  conversationHistory: ConversationTurn[];
  codingState?: any;
  code?: string;
  executionResults?: CodeExecutionResponse | null;
  proctoringEvents: ProctoringEvent[];
  roomVerification?: any;
}): Promise<FinalAssessment> {
  const res = await fetch("/api/assessment/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate final assessment");
  }

  return res.json();
}

export async function submitFeedback(payload: {
  name?: string;
  email?: string;
  rating: number;
  category: string;
  comment: string;
}): Promise<{ success: boolean; feedback: any }> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to submit feedback");
  }

  return res.json();
}

export async function fetchFeedbackList(): Promise<{ feedbackList: any[] }> {
  const res = await fetch("/api/feedback");
  if (!res.ok) {
    return { feedbackList: [] };
  }
  return res.json();
}

export async function analyzeJobFit(payload: {
  candidateProfile: Partial<CandidateProfile>;
  jobRole: {
    title: string;
    department?: string;
    experienceRequired?: string;
    skillsRequired?: string[] | string;
    jobDescription: string;
  };
}): Promise<{
  candidateName: string;
  roleTitle: string;
  matchPercentage: number;
  fitLevel: "Exceptional Fit" | "Strong Fit" | "Moderate Fit" | "Low Fit" | "Unfit";
  summary: string;
  matchedRequirements: string[];
  unmetOrMissingRequirements: string[];
  competencyScores: {
    technicalSkills: number;
    domainExperience: number;
    seniorityLevel: number;
    problemSolving: number;
    communication: number;
  };
  aiRecommendation: "Accept / Fast-track" | "Schedule Final Round" | "Needs Technical Deep-dive" | "Reject";
  reasoning: string;
  recommendedQuestions: string[];
}> {
  const res = await fetch("/api/recruiter/analyze-job-fit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to analyze candidate against job description");
  }

  return res.json();
}

