import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Send,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Code2,
  PhoneOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Zap,
  Sliders,
  ChevronRight,
  User,
  Bot,
  Eye,
  Activity,
  Layers,
  CheckCircle,
  Radio,
  Download,
  Square,
  Play,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  CandidateProfile,
  InterviewPlan,
  ConversationTurn,
  ProctoringEvent,
  DetectedObject,
  QualificationMatch,
} from "../types";
import { sendInterviewTurn, analyzeCameraFrame } from "../services/api";
import { SpeechRecognitionService, speakAIResponse, stopAISpeech } from "../utils/speech";
import { SystemAudioListener, InterviewSessionRecorder, AudioVisualizerData } from "../utils/audioSystem";

interface InterviewRoomProps {
  profile: CandidateProfile;
  interviewPlan: InterviewPlan;
  qualificationMatch?: QualificationMatch | null;
  conversationHistory: ConversationTurn[];
  setConversationHistory: React.Dispatch<React.SetStateAction<ConversationTurn[]>>;
  proctoringEvents: ProctoringEvent[];
  setProctoringEvents: React.Dispatch<React.SetStateAction<ProctoringEvent[]>>;
  currentDifficulty: "Beginner" | "Intermediate" | "Advanced";
  setCurrentDifficulty: (diff: "Beginner" | "Intermediate" | "Advanced") => void;
  detectedLanguage: string;
  setDetectedLanguage: (lang: string) => void;
  onNavigateToCoding: () => void;
  onEndInterview: () => void;
  onOpenRoomScan?: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  profile,
  interviewPlan,
  qualificationMatch,
  conversationHistory,
  setConversationHistory,
  proctoringEvents,
  setProctoringEvents,
  currentDifficulty,
  setCurrentDifficulty,
  detectedLanguage,
  setDetectedLanguage,
  onNavigateToCoding,
  onEndInterview,
  onOpenRoomScan,
}) => {
  // Voice & Input States
  const [inputText, setInputText] = useState("");
  const [liveInterimSpeech, setLiveInterimSpeech] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  // System Audio Listener & Visualizer States
  const [audioData, setAudioData] = useState<AudioVisualizerData>({
    volume: 0,
    decibels: -60,
    frequencies: [0.1, 0.2, 0.15, 0.3, 0.2, 0.1, 0.15, 0.2],
    isSpeaking: false,
  });

  // Session Recording States
  const [isRecordingSession, setIsRecordingSession] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  // Vision Proctoring States
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [monocularDepth, setMonocularDepth] = useState<{
    closestObject: string | null;
    distanceFeet: number;
    within3Feet: boolean;
  }>({
    closestObject: null,
    distanceFeet: 3.2,
    within3Feet: false,
  });
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  // Dynamic skill evaluation meters
  const [skillScores, setSkillScores] = useState({
    technicalDepth: 82,
    problemSolving: 74,
    communication: 91,
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const speechRecognizerRef = useRef<SpeechRecognitionService | null>(null);
  const audioListenerRef = useRef<SystemAudioListener | null>(null);
  const sessionRecorderRef = useRef<InterviewSessionRecorder | null>(null);

  // Recording Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isRecordingSession) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecordingSession]);

  const DEMO_TOTAL_SECONDS = 600; // 10-minute demo representing 60-minute technical interview
  const remainingSeconds = Math.max(0, DEMO_TOTAL_SECONDS - recordingSeconds);
  const currentPhase: 1 | 2 | 3 = recordingSeconds < 210 ? 1 : recordingSeconds < 480 ? 2 : 3;

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Progress Calculation
  const progressPercent = Math.min(
    100,
    Math.max(25, Math.round(((conversationHistory.filter((t) => t.sender === "candidate").length + 1) / 8) * 100))
  );

  // Latest AI Question/Turn for Subtitle display
  const latestAiTurn = [...conversationHistory].reverse().find((t) => t.sender === "ai");
  const subtitleText =
    latestAiTurn?.text ||
    `Hello ${profile.name}! Welcome to your 10-minute technical demo interview for ${profile.targetRole}. We will explore your personal engineering experience and production systems, transition to live code solving, and synthesize your performance report.`;

  // Initialize Speech Recognizer, Audio Listener, and Webcam on Mount
  useEffect(() => {
    speechRecognizerRef.current = new SpeechRecognitionService();
    audioListenerRef.current = new SystemAudioListener();
    sessionRecorderRef.current = new InterviewSessionRecorder();

    startWebcam();

    // Add initial greeting if history is empty
    if (conversationHistory.length === 0 && interviewPlan) {
      const initialTurn: ConversationTurn = {
        id: "turn_init",
        sender: "ai",
        text:
          interviewPlan.initialGreeting ||
          `Hello ${profile.name}! Welcome to your 10-minute technical demo interview for ${profile.targetRole} (condensed from our standard 60-minute technical session). We'll start with your personal engineering experience and production projects, move directly into our interactive Code Sandbox for live problem solving, and conclude with automated performance synthesis. To kick things off, could you walk me through your personal engineering background and the most challenging technical project you've built?`,
        language: "English",
        timestamp: Date.now(),
        eventTag: "greeting",
      };
      setConversationHistory([initialTurn]);
      if (!audioMuted) {
        speakAIResponse(initialTurn.text, {
          language: "English",
          onStart: () => setIsAiSpeaking(true),
          onEnd: () => setIsAiSpeaking(false),
        });
      }
    }

    return () => {
      stopAISpeech();
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stop();
      }
      if (audioListenerRef.current) {
        audioListenerRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Periodic Talview Live Video & Suspicious Event Detection Loop
  useEffect(() => {
    const talviewInterval = setInterval(async () => {
      if (!cameraActive) return;
      try {
        const frameBase64 = captureFrameBase64();
        if (!frameBase64) return;
        const result = await analyzeCameraFrame(frameBase64);

        if (result.monocularDepthEstimate) {
          setMonocularDepth({
            closestObject: result.monocularDepthEstimate.closestSuspiciousObject,
            distanceFeet: result.monocularDepthEstimate.estimatedDistanceFeet || 3.2,
            within3Feet: result.monocularDepthEstimate.within3FeetZone,
          });
        }

        // Check if suspicious events need silent logging
        if (
          result.overallRiskLevel === "high" ||
          result.overallRiskLevel === "medium" ||
          result.multiplePeopleDetected ||
          result.monocularDepthEstimate?.within3FeetZone ||
          (result.detectedObjects && result.detectedObjects.some((o: any) => o.label === "cell phone" || o.label === "notes/paper"))
        ) {
          const firstSuspicious = result.detectedObjects?.find((o: any) => o.label === "cell phone" || o.label === "notes/paper" || o.proximityWarning);
          const newEvent: ProctoringEvent = {
            id: `evt_talview_${Date.now()}`,
            timestamp: Date.now(),
            timeFormatted: new Date().toLocaleTimeString(),
            eventType: result.multiplePeopleDetected
              ? "multiple_people"
              : result.monocularDepthEstimate?.within3FeetZone
              ? "monocular_depth_proximity"
              : "device_detected",
            objectName: firstSuspicious?.label || (result.multiplePeopleDetected ? "additional person" : "proximity alert"),
            confidence: Math.round((firstSuspicious?.confidence || 0.92) * 100),
            proximityScore: result.monocularDepthEstimate?.within3FeetZone ? "close (<3ft)" : "medium (3-6ft)",
            snapshotBase64: frameBase64,
            severity: result.overallRiskLevel === "high" ? "high" : "medium",
            reviewed: false,
            notes: result.summaryNotes || "Talview AI detected unauthorized device or proximity event silently.",
          };

          setProctoringEvents((prev) => {
            // Avoid duplicate log within 8 seconds
            if (prev.length > 0 && Date.now() - prev[0].timestamp < 8000) {
              return prev;
            }
            return [newEvent, ...prev];
          });
        }
      } catch (err) {
        // Silent recovery without disturbing candidate
      }
    }, 12000);

    return () => clearInterval(talviewInterval);
  }, [cameraActive]);

  // Auto-scroll transcript container internally to bottom (without shifting page scroll position)
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, isAiThinking, liveInterimSpeech]);

  // Webcam Starter
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);

      // Start System Audio Listener with the live stream
      if (audioListenerRef.current) {
        audioListenerRef.current.start(stream, (data) => {
          setAudioData(data);
        });
      }

      // Start media recorder
      if (sessionRecorderRef.current) {
        sessionRecorderRef.current.startRecording(stream);
        setIsRecordingSession(true);
      }
    } catch (err: any) {
      console.warn("Webcam/Mic setup notice:", err);
      // Fallback audio listener without hardware stream
      if (audioListenerRef.current) {
        audioListenerRef.current.start(undefined, (data) => {
          setAudioData(data);
        });
      }
    }
  };

  // Toggle Recording
  const handleToggleRecording = async () => {
    if (isRecordingSession) {
      if (sessionRecorderRef.current) {
        await sessionRecorderRef.current.stopRecording();
      }
      setIsRecordingSession(false);
      setShowRecordingModal(true);
    } else {
      if (streamRef.current && sessionRecorderRef.current) {
        sessionRecorderRef.current.startRecording(streamRef.current);
      }
      setIsRecordingSession(true);
    }
  };

  const handleDownloadRecording = () => {
    if (sessionRecorderRef.current) {
      sessionRecorderRef.current.downloadRecording(
        `${profile.name.toLowerCase().replace(/\s+/g, "_")}_interview_recording.webm`
      );
    }
  };

  const handleExportTranscript = () => {
    const textData = conversationHistory
      .map(
        (t) =>
          `[${new Date(t.timestamp).toLocaleTimeString()}] ${
            t.sender === "candidate" ? profile.name : "AI Interviewer"
          } (${t.language || "EN"}):\n${t.text}\n`
      )
      .join("\n--------------------\n\n");

    const blob = new Blob([textData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name.toLowerCase().replace(/\s+/g, "_")}_interview_transcript.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Toggle Speech Input / Voice Recognition
  const toggleListening = () => {
    if (isListening) {
      speechRecognizerRef.current?.stop();
      setIsListening(false);
      setLiveInterimSpeech("");
    } else {
      setIsListening(true);
      speechRecognizerRef.current?.setLanguage(detectedLanguage);
      speechRecognizerRef.current?.start(
        (text, isFinal) => {
          setLiveInterimSpeech(text);
          if (isFinal) {
            setInputText(text);
            setLiveInterimSpeech("");
            handleSendMessage(text);
            setIsListening(false);
          } else {
            setInputText(text);
          }
        },
        (error) => {
          console.warn("Speech recognition notice:", error);
          setIsListening(false);
        }
      );
    }
  };

  // Capture frame for vision analysis
  const captureFrameBase64 = (): string => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 360;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.6);
      }
    }
    // Synthetic fallback frame
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 480, 360);
      ctx.fillStyle = "#38BDF8";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Candidate Video Stream: ${profile.name}`, 30, 180);
    }
    return canvas.toDataURL("image/jpeg", 0.6);
  };

  // Send candidate answer to AI backend
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiThinking) return;

    // Add candidate turn to history
    const candidateTurn: ConversationTurn = {
      id: `turn_${Date.now()}`,
      sender: "candidate",
      text,
      language: detectedLanguage,
      timestamp: Date.now(),
    };

    const updatedHistory = [...conversationHistory, candidateTurn];
    setConversationHistory(updatedHistory);
    setInputText("");
    setLiveInterimSpeech("");
    setIsAiThinking(true);

    try {
      const res = await sendInterviewTurn({
        candidateName: profile.name,
        role: profile.targetRole,
        conversationHistory: updatedHistory,
        candidateInput: text,
        currentTopic: interviewPlan.topics[currentTopicIndex]?.name || "Technical Core",
        currentDifficulty,
        targetLanguage: detectedLanguage,
        progressPercent,
        flaggedDiscrepancies: qualificationMatch?.discrepancies,
        areasForClarification: qualificationMatch?.areasForClarification,
      });

      if (res.detectedLanguage) {
        setDetectedLanguage(res.detectedLanguage);
      }

      if (res.adaptedDifficulty) {
        setCurrentDifficulty(res.adaptedDifficulty);
      }

      if (res.turnAssessment) {
        setSkillScores({
          technicalDepth: res.turnAssessment.technicalUnderstandingScore || 85,
          problemSolving: Math.round(((res.turnAssessment.technicalUnderstandingScore || 85) + (res.turnAssessment.communicationClarityScore || 85)) / 2),
          communication: res.turnAssessment.communicationClarityScore || 88,
        });
      }

      // Add AI turn
      const aiTurn: ConversationTurn = {
        id: `turn_${Date.now() + 1}`,
        sender: "ai",
        text: res.responseSpeechText,
        language: res.detectedLanguage || "English",
        timestamp: Date.now(),
        turnAssessment: res.turnAssessment,
        eventTag: res.adaptedDifficulty !== currentDifficulty ? "difficulty_change" : undefined,
      };

      setConversationHistory((prev) => [...prev, aiTurn]);

      // Speak response
      if (!audioMuted) {
        speakAIResponse(res.responseSpeechText, {
          language: res.detectedLanguage || "English",
          onStart: () => setIsAiSpeaking(true),
          onEnd: () => setIsAiSpeaking(false),
        });
      }

      // Auto advance topic if recommended
      if (res.turnAssessment?.suggestedNextStage === "switch_topic") {
        setCurrentTopicIndex((prev) =>
          Math.min(interviewPlan.topics.length - 1, prev + 1)
        );
      }
    } catch (err: any) {
      console.error("AI turn error:", err);
      const textLower = text.toLowerCase();
      let fallbackText = `Regarding your point on "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}", how would you approach the tradeoffs and edge cases when designing this in production?`;
      if (textLower.includes("hindi") || /[\u0900-\u097F]/.test(text)) {
        fallbackText = `Aapne jo point explain kiya regarding "${text.slice(0, 35)}...", usko production me implement karte waqt scale aur reliability ko kaise ensure karenge?`;
      } else if (textLower.includes("why") || textLower.includes("how") || textLower.includes("?")) {
        fallbackText = `Great question. When dealing with that scenario, the primary considerations are latency and data consistency. How would you balance those requirements?`;
      }

      const fallbackTurn: ConversationTurn = {
        id: `turn_${Date.now() + 1}`,
        sender: "ai",
        text: fallbackText,
        language: /[\u0900-\u097F]/.test(text) ? "Hindi" : "English",
        timestamp: Date.now(),
        eventTag: "adaptive_probe",
      };
      setConversationHistory((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Quick Simulation / Demo Buttons for Hackathon Judges
  const simulateCandidateAnswer = (type: "hindi" | "strong" | "phone_detected" | "clarify" | "personal_experience") => {
    if (type === "personal_experience") {
      handleSendMessage("In my previous role as Senior Engineer, I architected a distributed event ingestion pipeline in Go and Node.js that processed over 60,000 events/sec. We resolved database write bottlenecks by introducing Redis cache-aside sharding and asynchronous Kafka queues with automated retry backoffs.");
    } else if (type === "hindi") {
      handleSendMessage("Haan, REST APIs basically stateless hote hain jisme hum HTTP methods like GET, POST use karte hain data exchange ke liye.");
    } else if (type === "strong") {
      handleSendMessage("To guarantee idempotent updates, we assign a unique idempotency key per transaction in Redis with a 15-minute TTL and use database row locks during commit.");
    } else if (type === "clarify") {
      handleSendMessage("Could you clarify whether we are optimizing primarily for read throughput or write latency in this microservices setup?");
    } else if (type === "phone_detected") {
      const mockEvent: ProctoringEvent = {
        id: `evt_sim_${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: new Date().toLocaleTimeString(),
        eventType: "monocular_depth_proximity",
        objectName: "cell phone",
        confidence: 94,
        proximityScore: "close (<3ft)",
        snapshotBase64: captureFrameBase64(),
        severity: "high",
        reviewed: false,
        notes: "Silently detected smartphone at 2.1ft (proximity flag). Logged to HR proctoring audit without candidate disruption.",
      };
      setProctoringEvents((prev) => [mockEvent, ...prev]);
    }
  };

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 flex flex-col gap-5">
      {/* 10-Minute Demo Pacing & Round Roadmap Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: 10-Minute Session Timer & Round Indicator */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                10-Minute Technical Demo Interview
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                60m Condensed
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-gray-600">
              <span className="font-mono text-[#1a73e8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {formatRecTime(remainingSeconds)} Remaining (10:00 Total)
              </span>
              <span className="text-gray-400">•</span>
              <span className={currentPhase === 1 ? "text-[#1a73e8] font-bold" : currentPhase === 2 ? "text-indigo-600 font-bold" : "text-emerald-600 font-bold"}>
                {currentPhase === 1 ? "Round 1: Personal Experience & Systems" : currentPhase === 2 ? "Round 2: Live Code Sandbox" : "Round 3: AI Synthesis & Wrap-up"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Phased Round Progress Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentPhase === 1
              ? "bg-white text-[#1a73e8] shadow-2xs"
              : "text-gray-500"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>1. Experience</span>
          </div>

          <button
            type="button"
            onClick={onNavigateToCoding}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentPhase === 2
                ? "bg-white text-indigo-600 shadow-2xs"
                : "text-gray-600 hover:text-indigo-600"
            }`}
            title="Jump directly to Round 2: Code Sandbox"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>2. Live Coding</span>
            <Code2 className="w-3 h-3 text-indigo-500 ml-0.5" />
          </button>

          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentPhase === 3
              ? "bg-white text-emerald-600 shadow-2xs"
              : "text-gray-500"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>3. Synthesis</span>
          </div>
        </div>

        {/* Right: Recording & Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* Recording Control Button */}
          <button
            onClick={handleToggleRecording}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
              isRecordingSession
                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Toggle interview audio and video session recording"
          >
            {isRecordingSession ? (
              <>
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span>REC {formatRecTime(recordingSeconds)}</span>
                <Square className="w-3 h-3 text-red-600 fill-red-600 ml-0.5" />
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-gray-600" />
                <span>Record Session</span>
              </>
            )}
          </button>

          <button
            onClick={onNavigateToCoding}
            className="px-3.5 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Sandbox</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Demo Triggers Bar for Fast-Track Testing */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Demo Quick Triggers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => simulateCandidateAnswer("personal_experience")}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Simulate candidate answering with production architecture experience"
          >
            💼 Personal Experience ("Ingestion pipeline in Go & Node...")
          </button>
          <button
            onClick={() => simulateCandidateAnswer("hindi")}
            className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            🇮🇳 Hindi / Hinglish
          </button>
          <button
            onClick={() => simulateCandidateAnswer("strong")}
            className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            💡 Redis & Idempotency
          </button>
          <button
            onClick={() => simulateCandidateAnswer("phone_detected")}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            📱 Silent Phone Log &lt;3ft
          </button>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Hero Video Stage + Bottom Metric Bar */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Main Cinematic Video Hero Card */}
          <div className="relative min-h-[440px] sm:min-h-[480px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white flex flex-col justify-between p-6">
            {/* Ambient Pulsing Glow Halo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-64 h-64 rounded-full bg-gradient-to-tr from-[#4285F4] via-[#9B51E0] to-[#EA4335] blur-3xl transition-opacity duration-700 ${
                  isAiSpeaking ? "opacity-80 scale-110 animate-pulse" : "opacity-40 scale-95"
                }`}
              />
            </div>

            {/* Top Left Vision & System Audio Badges */}
            <div className="relative z-10 flex flex-col gap-2 self-start">
              <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#9B51E0] rounded-full shadow-[0_0_8px_#9B51E0]"></div>
                <span className="text-xs text-white font-medium">Vision: Clear</span>
              </div>
              <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4285F4] rounded-full shadow-[0_0_8px_#4285F4]"></div>
                <span className="text-xs text-white font-medium font-mono">
                  Depth: {monocularDepth.distanceFeet.toFixed(1)}ft
                </span>
              </div>
            </div>

            {/* Top Right Floating PiP Candidate Stream */}
            <div className="absolute top-6 right-6 w-48 h-32 bg-gray-800 rounded-xl border-2 border-white/20 overflow-hidden shadow-lg z-10">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Candidate Camera
                  </span>
                </div>
              )}
              {/* Video Active Status */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] text-white font-bold uppercase">Video Active</span>
              </div>
              {/* Bottom Stream Status */}
              <div className="absolute bottom-0 inset-x-0 h-6 bg-black/70 flex items-center px-2 justify-between">
                <span className="text-[8px] text-white font-bold uppercase">YOLO v8 active</span>
                <span className="text-[8px] text-green-400 font-bold">
                  Proximity: {(monocularDepth.distanceFeet * 0.3048).toFixed(1)}m
                </span>
              </div>
            </div>

            {/* Center AI Interviewer Avatar */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-inner">
                <div className="w-16 h-16 text-white flex items-center justify-center">
                  <Bot
                    className={`w-12 h-12 text-white transition-transform duration-300 ${
                      isAiSpeaking ? "scale-110" : ""
                    }`}
                  />
                </div>
                {/* Real-time speaking waves */}
                {isAiSpeaking && (
                  <div className="absolute -bottom-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                    <span className="w-1 h-2.5 bg-[#4285F4] rounded-full animate-bounce" />
                    <span className="w-1 h-3.5 bg-[#9B51E0] rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-2 bg-[#EA4335] rounded-full animate-bounce delay-150" />
                  </div>
                )}
              </div>
              <span className="mt-4 text-white font-medium tracking-wide text-sm sm:text-base">
                AI Senior Interviewer: Sarah
              </span>
              <span className="text-xs text-gray-400 mt-0.5 font-mono">
                {isAiThinking ? "Evaluating technical response..." : isAiSpeaking ? "Speaking..." : "Listening to candidate audio"}
              </span>
            </div>

            {/* Floating Subtitle / Live Question Card with Real-Time Subtitles */}
            <div className="relative z-10 p-4 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-left mt-4">
              {/* Show Live Candidate Spoken Subtitle if active, else AI Question */}
              {liveInterimSpeech ? (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></div>
                    Candidate Spoken Input (Live Transcription):
                  </span>
                  <p className="text-amber-100 text-base font-medium italic">
                    "{liveInterimSpeech}"
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-white text-base sm:text-lg font-medium leading-snug">
                    "{subtitleText}"
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-bold uppercase">
                      {latestAiTurn?.eventTag === "difficulty_change"
                        ? "Difficulty Adjusted"
                        : "Technical Follow-up"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {latestAiTurn?.language || "English"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Metric Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 w-full sm:w-auto">
              {/* Technical Depth */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Technical Depth
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${skillScores.technicalDepth}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{skillScores.technicalDepth}%</span>
                </div>
              </div>

              {/* Problem Solving */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Problem Solving
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${skillScores.problemSolving}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{skillScores.problemSolving}%</span>
                </div>
              </div>

              {/* Communication */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Communication
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${skillScores.communication}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{skillScores.communication}%</span>
                </div>
              </div>
            </div>

            {/* Assessment Mode Status */}
            <div className="flex items-center gap-4 sm:border-l sm:border-gray-200 sm:pl-8 self-end sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">
                  Assessment Mode
                </span>
                <span className="text-sm font-bold text-blue-600">Active Voice Interview</span>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interaction Transcript & Dark Navigation Controls */}
        <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6">
          {/* Live Interaction Card */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm overflow-hidden min-h-[460px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Live Interaction
                </h3>
                <span className="text-[10px] text-green-600 font-bold px-2 py-0.5 bg-green-100 rounded-md">
                  EN/HI Auto
                </span>
              </div>

              {/* Speech Mute Toggle */}
              <button
                onClick={() => {
                  setAudioMuted(!audioMuted);
                  if (!audioMuted) stopAISpeech();
                }}
                className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors cursor-pointer"
                title={audioMuted ? "Unmute AI Voice" : "Mute AI Voice"}
              >
                {audioMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-gray-600" />}
              </button>
            </div>

            {/* Message Bubbles Body */}
            <div
              ref={transcriptContainerRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto text-sm max-h-[380px]"
            >
              {conversationHistory.map((turn) => (
                <div
                  key={turn.id}
                  className={`flex flex-col gap-1 ${
                    turn.sender === "candidate" ? "items-end" : "items-start"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      turn.sender === "candidate" ? "text-gray-400" : "text-blue-600"
                    }`}
                  >
                    {turn.sender === "candidate" ? `${profile.name}` : "AI Interviewer (Sarah)"}
                  </span>
                  <p
                    className={`p-3 text-xs leading-relaxed ${
                      turn.sender === "candidate"
                        ? "bg-gray-100 text-gray-800 rounded-xl rounded-tr-none"
                        : "bg-blue-50 text-gray-800 rounded-xl rounded-tl-none border border-blue-100"
                    }`}
                  >
                    {turn.text}
                  </p>
                </div>
              ))}

              {/* Silent Vision Log Alert Box */}
              {proctoringEvents.length > 0 && (
                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-yellow-800 text-xs italic leading-relaxed">
                    <span className="font-bold uppercase text-[9px] mb-1 block not-italic text-yellow-900">
                      Silent Vision Log
                    </span>
                    {proctoringEvents[0].notes ||
                      "Mobile device detected briefly. Logged to admin audit without candidate disruption."}
                  </div>
                </div>
              )}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-gray-500 text-xs py-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span>Sarah is formulating response...</span>
                </div>
              )}
            </div>

            {/* Progress Footer & Audio/Text Input */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
              <div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full mb-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-400">
                  <span>Interview Progress</span>
                  <span className="text-blue-600">{progressPercent}% Complete</span>
                </div>
              </div>

              {/* Push to Talk & Text Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white border-red-600 animate-pulse shadow-xs"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                  title={isListening ? "Stop Microphone" : "Start Real-Time Voice Input"}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening to speech in real time..."
                      : "Type answer or click mic to speak..."
                  }
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isAiThinking}
                  className="p-2.5 bg-[#4285F4] hover:bg-[#3367D6] disabled:bg-gray-200 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Dark Navigation Controls Hub */}
          <div className="bg-gray-900 text-white rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Session Navigation & Tools
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {/* Room Scan */}
              <button
                onClick={() => {
                  if (onOpenRoomScan) {
                    onOpenRoomScan();
                  } else {
                    startWebcam();
                  }
                }}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl flex flex-col items-center gap-1 border border-white/5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider">360° Room Check</span>
              </button>

              {/* Code Lab */}
              <button
                onClick={onNavigateToCoding}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl flex flex-col items-center gap-1 border border-white/5 transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Code Sandbox</span>
              </button>

              {/* Transcript Export */}
              <button
                onClick={handleExportTranscript}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl flex flex-col items-center gap-1 border border-white/5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Export Text Log</span>
              </button>

              {/* End Session */}
              <button
                onClick={onEndInterview}
                className="bg-red-500/20 hover:bg-red-500/30 p-2.5 rounded-xl flex flex-col items-center gap-1 border border-red-500/30 text-red-300 transition-colors cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-wider">End Interview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recording Complete Modal */}
      {showRecordingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full p-6 space-y-4 text-[#202124]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Interview Session Recording
                </h3>
                <p className="text-xs text-gray-500">
                  Total Recorded Duration: {formatRecTime(recordingSeconds)}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Your audio and video recording chunks have been processed. You can download the full media recording file or resume recording anytime.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleDownloadRecording}
                className="w-full py-2.5 px-4 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Video Recording (.webm)</span>
              </button>

              <button
                onClick={handleExportTranscript}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Verbatim Transcript (.txt)</span>
              </button>

              <button
                onClick={() => setShowRecordingModal(false)}
                className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
