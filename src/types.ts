export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface QualificationMatch {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  experienceAlignment: string;
  discrepancies?: string[];
  areasForClarification?: string[];
}

export interface InterviewTopic {
  name: string;
  description: string;
  expectedDepth: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingChallenge {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCodeJs: string;
  starterCodePy: string;
  testCases: TestCase[];
  hints: string[];
  optimalComplexity: {
    time: string;
    space: string;
  };
}

export interface InterviewPlan {
  role: string;
  difficulty: DifficultyLevel;
  topics: InterviewTopic[];
  initialGreeting: string;
  codingChallenge: CodingChallenge;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
}

export interface CandidateProfile {
  name: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  avatarUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  targetRole: string;
  targetCompany?: string;
  skills: string;
  experienceYears: number;
  expectedSalary?: string;
  noticePeriod?: string;
  workAuthorization?: string;
  resumeText: string;
  jobDescription: string;
  preferredLanguages: string[];
  education?: EducationItem[];
  workExperience?: WorkExperienceItem[];
  certifications?: string[];
}

export interface ConversationTurn {
  id: string;
  sender: "ai" | "candidate" | "system";
  text: string;
  language: string;
  timestamp: number;
  audioUrl?: string;
  eventTag?: "question" | "clarification" | "adaptive_probe" | "code_review" | "greeting" | "difficulty_change";
  turnAssessment?: {
    technicalUnderstandingScore: number;
    communicationClarityScore: number;
    evidenceNote: string;
    suggestedNextStage: string;
  };
}

export interface DetectedObject {
  label: "cell phone" | "laptop" | "tablet" | "headphones" | "additional person" | "notes/paper" | "extra monitor" | "gaze drift" | string;
  confidence: number;
  boundingBox?: { ymin: number; xmin: number; ymax: number; xmax: number };
  estimatedDistance?: "near (<3ft)" | "medium (3-6ft)" | "far (>6ft)";
  proximityWarning?: boolean;
}

export interface MultimodalInterviewStepResponse {
  candidate_verbal_response: string;
  silent_proctoring_log: {
    suspicious_activity_detected: boolean;
    evidence_description: string;
    confidence_score: number;
  };
  performance_analysis: {
    communication_clarity: string;
    technical_understanding: string;
    running_score_out_of_10: number;
  };
}

export interface CameraFrameAnalysisResponse {
  personDetected: boolean;
  multiplePeopleDetected: boolean;
  detectedObjects: {
    label: string;
    confidence: number;
    boundingBox?: { ymin: number; xmin: number; ymax: number; xmax: number };
    location?: string;
    estimatedDistance?: string;
    proximityWarning?: boolean;
  }[];
  eyeGazeAnalysis?: {
    lookingAtScreen: boolean;
    gazeDirection: string;
    frequentGazeDeviationDetected: boolean;
    confidence: number;
  };
  monocularDepthEstimate: {
    closestSuspiciousObject: string | null;
    estimatedDistanceFeet: number;
    within3FeetZone: boolean;
  };
  overallRiskLevel: "safe" | "low" | "medium" | "high";
  incidentDescription?: string;
  summaryNotes: string;
}

export interface ProctoringEvent {
  id: string;
  timestamp: number;
  timeFormatted: string;
  eventType: "device_detected" | "multiple_people" | "no_face" | "monocular_depth_proximity" | "unauthorized_screen" | "suspicious_audio" | "talview_gaze_drift" | "gaze_deviation" | "tab_blur";
  objectName: string;
  confidence: number;
  proximityScore: "close (<3ft)" | "medium (3-6ft)" | "far (>6ft)";
  snapshotBase64?: string;
  severity: "low" | "medium" | "high";
  reviewed: boolean;
  notes?: string;
  category?: "Talview Gaze" | "Talview Object" | "Talview Voice" | "Workspace 360" | "Browser Integrity";
}

export interface RoomScanStep {
  angle: "Front Workspace" | "Left Angle" | "Right Angle" | "Desk & Keyboard" | "Behind View";
  status: "pending" | "scanning" | "clear" | "flagged";
  imageBase64?: string;
  feedbackMessage?: string;
  riskRating?: string;
  detectedItems?: string[];
}

export interface TestResultItem {
  testIndex: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
  executionTimeMs?: number;
}

export interface CodeExecutionResponse {
  passed: number;
  total: number;
  results: TestResultItem[];
  consoleOutput: string;
  runtimeError?: string;
  aiAnalysis?: {
    correctness: string;
    timeComplexity: string;
    spaceComplexity: string;
    codeQualityScore: number;
    edgeCasesHandled: boolean;
    feedback: string;
    suggestedFollowUp: string;
  };
}

export interface DimensionScore {
  score: number;
  evidence: string[];
}

export interface FinalAssessment {
  overallScore: number;
  recommendation: "Strong Hire" | "Hire" | "Proceed with Review" | "Needs Further Evaluation" | "Do Not Hire";
  dimensions: {
    technicalKnowledge: DimensionScore;
    problemSolving: DimensionScore;
    codingSkill: DimensionScore;
    debuggingAbility: DimensionScore;
    communication: DimensionScore;
    roleSpecificFit: DimensionScore;
  };
  candidateStrengths: string[];
  areasForImprovement: string[];
  constructiveFeedback: string;
  proctoringSummary: {
    integrityIndex: number;
    flagsCount: number;
    riskLevel: "Low" | "Moderate" | "High";
    evidenceItems: string[];
    recommendation: string;
    silentObservations?: {
      gazeIntegrityScore: number;
      focusRetentionRate: string;
      proximityIncidents: number;
      audioNoiseFlags: number;
      tabSwitchesCount: number;
      workspaceVerificationSummary: string;
      keyObservations: string[];
    };
  };
}

export interface UserFeedback {
  id: string;
  name: string;
  email: string;
  rating: number; // 1-5
  category: "Interview Experience" | "AI Accuracy & Voice" | "Talview Proctoring" | "Coding Sandbox" | "UI & UX" | "Other";
  comment: string;
  submittedAt: string;
}

export interface ProductUpdate {
  version: string;
  date: string;
  title: string;
  tag: "Feature" | "Enhancement" | "Security" | "Talview AI";
  description: string;
  highlights: string[];
}

export interface CompanyJobRole {
  id: string;
  companyName: string;
  companyLogo?: string;
  companyIndustry?: string;
  title: string;
  department: string;
  location: string;
  employmentType?: "Full-time" | "Contract" | "Remote" | "Hybrid";
  experienceRequired: string;
  skillsRequired: string[];
  minMatchThreshold: number;
  salaryRange?: string;
  jobDescription: string;
  createdAt: string;
  applicantsCount: number;
  status: "active" | "closed" | "draft";
}

export type ApplicantDecision = "accepted" | "rejected" | "under_review" | "completed";

export interface CandidateNotification {
  id: string;
  candidateEmail: string;
  candidateName: string;
  companyName: string;
  roleName: string;
  status: "fit_offer" | "unfit_rejected" | "under_review";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ApplicantRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  companyName?: string;
  targetRoleId: string;
  targetRoleName: string;
  department: string;
  interviewDate: string;
  interviewDuration: string;
  experienceYears: number;
  matchPercentage: number;
  fitStatus: "Strong Fit" | "Fit" | "Borderline" | "Not Fit";
  overallScore: number;
  integrityScore: number;
  decision: ApplicantDecision;
  decisionNotes?: string;
  decisionTimestamp?: string;
  recruiterFitEvaluation?: "Fit" | "Unfit" | "Pending Decision";
  notificationSent?: boolean;
  notificationTimestamp?: string;
  notificationContent?: string;
  proctoringFlags: number;
  skills: string[];
  resumeSummary: string;
  matchedRequirements: string[];
  unmetRequirements: string[];
  aiRecommendation: string;
  aiReasoning: string;
  appliedJobDescription?: string;
  finalAssessment?: FinalAssessment;
  conversationHistory?: ConversationTurn[];
}

export interface JobFitAnalysisResult {
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
}
