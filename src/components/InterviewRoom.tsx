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
  Cpu,
  Workflow,
  Sparkle,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  CandidateProfile,
  InterviewPlan,
  ConversationTurn,
  ProctoringEvent,
  DetectedObject,
  QualificationMatch,
} from "../types";
import { sendInterviewTurn, analyzeCameraFrame, sendMultimodalInterviewStep } from "../services/api";
import { SpeechRecognitionService, speakAIResponse, stopAISpeech } from "../utils/speech";
import { SystemAudioListener, InterviewSessionRecorder, AudioVisualizerData } from "../utils/audioSystem";
import {
  WebRTCStreamController,
  WebRTCStreamStats,
  LiveKitPipecatTransportManager,
  LiveKitAgentTransportStats,
  VapiRetellOrchestrator,
  VapiRetellOrchestrationStats,
} from "../utils/realtimeStreaming";
import {
  AvatarLipSyncEngine,
  AvatarProvider,
  AvatarState,
} from "../utils/avatarLipSync";

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

  // Real-Time Architecture Telemetry Drawer State
  const [showArchTelemetry, setShowArchTelemetry] = useState(false);
  const [selectedAvatarProvider, setSelectedAvatarProvider] = useState<AvatarProvider>("Anam AI");

  // System Audio Listener & Visualizer States
  const [audioData, setAudioData] = useState<AudioVisualizerData>({
    volume: 0,
    decibels: -60,
    frequencies: [0.1, 0.2, 0.15, 0.3, 0.2, 0.1, 0.15, 0.2],
    isSpeaking: false,
  });

  // Real-time Subsystem Stats
  const [webrtcStats, setWebrtcStats] = useState<WebRTCStreamStats>({
    connectionState: "connected",
    iceConnectionState: "connected",
    roundTripTimeMs: 38,
    bitrateKbps: 1920,
    packetLossPercentage: 0.0,
    frameRate: 30,
    resolution: "1280x720 (HD)",
    audioSampleRate: 48000,
    audioCodec: "Opus 64kbps",
  });

  const [transportStats, setTransportStats] = useState<LiveKitAgentTransportStats>({
    roomName: "vibeai_prod_room_live",
    participantId: `cand_${profile.name.toLowerCase().replace(/\s+/g, "_")}`,
    transportType: "WebRTC DataChannel + MediaStream",
    transportLatencyMs: 44,
    voiceActivityDetected: false,
    audioBufferMs: 20,
    interruptionHandledCount: 0,
    noiseSuppressionActive: true,
    echoCancellationActive: true,
  });

  const [orchestratorStats, setOrchestratorStats] = useState<VapiRetellOrchestrationStats>({
    pipelineStatus: "idle",
    sttProvider: "Deepgram Nova-2",
    llmModel: "Gemini 3.7 Flash",
    ttsProvider: "ElevenLabs Multilingual v2",
    endToEndLatencyMs: 268,
    sttLatencyMs: 88,
    llmFirstTokenMs: 135,
    ttsSynthesisMs: 45,
    activeSessionId: `ses_${Date.now().toString(36)}`,
  });

  const [avatarState, setAvatarState] = useState<AvatarState>({
    provider: "Anam AI",
    isSpeaking: false,
    isThinking: false,
    viseme: "silence",
    mouthOpenPercent: 0,
    mouthWidthPercent: 50,
    headTiltDeg: 0,
    eyeBlinkPercent: 0,
    expression: "focused",
  });

  // Session Recording States
  const [isRecordingSession, setIsRecordingSession] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  // Vision Proctoring States
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

  // Dynamic response-driven skill evaluation (evaluates candidate AFTER their responses)
  const [evaluatedTurnsCount, setEvaluatedTurnsCount] = useState<number>(0);
  const [latestEvidenceNote, setLatestEvidenceNote] = useState<string | null>(null);
  const [skillScores, setSkillScores] = useState({
    technicalDepth: 0,
    problemSolving: 0,
    communication: 0,
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const speechRecognizerRef = useRef<SpeechRecognitionService | null>(null);
  const audioListenerRef = useRef<SystemAudioListener | null>(null);
  const sessionRecorderRef = useRef<InterviewSessionRecorder | null>(null);
  const webrtcControllerRef = useRef<WebRTCStreamController | null>(null);
  const transportManagerRef = useRef<LiveKitPipecatTransportManager | null>(null);
  const orchestratorRef = useRef<VapiRetellOrchestrator | null>(null);
  const avatarEngineRef = useRef<AvatarLipSyncEngine | null>(null);

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

  const DEMO_TOTAL_SECONDS = 600;
  const remainingSeconds = Math.max(0, DEMO_TOTAL_SECONDS - recordingSeconds);
  const currentPhase: 1 | 2 | 3 = recordingSeconds < 210 ? 1 : recordingSeconds < 480 ? 2 : 3;

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(25, Math.round(((conversationHistory.filter((t) => t.sender === "candidate").length + 1) / 8) * 100))
  );

  const latestAiTurn = [...conversationHistory].reverse().find((t) => t.sender === "ai");
  const subtitleText =
    latestAiTurn?.text ||
    `Hello ${profile.name}! Welcome to your technical interview for ${profile.targetRole}. We will examine your architectural experience, transition to live code solving, and synthesize your comprehensive assessment.`;

  // Initialize WebRTC, LiveKit, Vapi/Retell, Avatar, and Audio on mount
  useEffect(() => {
    speechRecognizerRef.current = new SpeechRecognitionService();
    audioListenerRef.current = new SystemAudioListener();
    sessionRecorderRef.current = new InterviewSessionRecorder();
    webrtcControllerRef.current = new WebRTCStreamController();
    transportManagerRef.current = new LiveKitPipecatTransportManager();
    orchestratorRef.current = new VapiRetellOrchestrator();
    
    avatarEngineRef.current = new AvatarLipSyncEngine(selectedAvatarProvider, (state) => {
      setAvatarState(state);
    });

    transportManagerRef.current.connect(`vibeai_room_${profile.name.toLowerCase().replace(/\s+/g, "_")}`, (stats) => {
      setTransportStats(stats);
    });

    orchestratorRef.current.setCallback((stats) => {
      setOrchestratorStats(stats);
    });

    startWebcam();

    // Initial greeting
    if (conversationHistory.length === 0 && interviewPlan) {
      const initialTurn: ConversationTurn = {
        id: "turn_init",
        sender: "ai",
        text:
          interviewPlan.initialGreeting ||
          `Hello ${profile.name}! Welcome to your real-time technical interview for the ${profile.targetRole} role. We'll start with your personal engineering background and high-scale production systems, move into our interactive Code Sandbox for live problem solving, and conclude with automated performance synthesis. To kick things off, could you walk me through your engineering journey and the most challenging technical system you've architected?`,
        language: "English",
        timestamp: Date.now(),
        eventTag: "greeting",
      };
      setConversationHistory([initialTurn]);
      
      if (!audioMuted) {
        orchestratorRef.current?.setStatus("speaking", { ttsLatency: 42 });
        avatarEngineRef.current?.setSpeaking(true);
        speakAIResponse(initialTurn.text, {
          language: "English",
          onStart: () => {
            setIsAiSpeaking(true);
            avatarEngineRef.current?.setSpeaking(true);
            orchestratorRef.current?.setStatus("speaking");
          },
          onEnd: () => {
            setIsAiSpeaking(false);
            avatarEngineRef.current?.setSpeaking(false);
            orchestratorRef.current?.setStatus("idle");
          },
        });
      }
    }

    return () => {
      stopAISpeech();
      avatarEngineRef.current?.dispose();
      webrtcControllerRef.current?.dispose();
      transportManagerRef.current?.disconnect();
      speechRecognizerRef.current?.stop();
      audioListenerRef.current?.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (e) {}
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    };
  }, []);

  // Update avatar provider when user changes selection
  useEffect(() => {
    if (avatarEngineRef.current) {
      avatarEngineRef.current.setProvider(selectedAvatarProvider);
    }
  }, [selectedAvatarProvider]);

  // Feed audio analyzer to avatar lip sync engine
  useEffect(() => {
    if (avatarEngineRef.current && isAiSpeaking) {
      avatarEngineRef.current.feedAudioData(audioData.volume, audioData.frequencies);
    }
  }, [audioData, isAiSpeaking]);

  // Periodic Silent Vision & Depth Proctoring Loop (Passive Visual Auditor)
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

        const isGazeDeviation = result.eyeGazeAnalysis?.frequentGazeDeviationDetected || (result.eyeGazeAnalysis && result.eyeGazeAnalysis.lookingAtScreen === false);
        const hasSuspiciousObject = result.detectedObjects && result.detectedObjects.some((o: any) => 
          o.label === "cell phone" || 
          o.label === "tablet" || 
          o.label === "laptop" || 
          o.label === "smartwatch" || 
          o.label === "headphones" || 
          o.label === "notes/paper" || 
          o.label === "textbook" || 
          o.label === "extra monitor" ||
          o.proximityWarning
        );

        if (
          result.overallRiskLevel === "high" ||
          result.overallRiskLevel === "medium" ||
          result.multiplePeopleDetected ||
          result.monocularDepthEstimate?.within3FeetZone ||
          hasSuspiciousObject ||
          isGazeDeviation
        ) {
          const firstSuspicious = result.detectedObjects?.find((o: any) => 
            o.label === "cell phone" || 
            o.label === "tablet" || 
            o.label === "notes/paper" || 
            o.label === "textbook" || 
            o.label === "laptop" ||
            o.proximityWarning
          );

          const timeFormatted = new Date().toLocaleTimeString();
          let eventType: ProctoringEvent["eventType"] = "device_detected";
          let objectName = firstSuspicious?.label || "device detected";

          if (result.multiplePeopleDetected) {
            eventType = "multiple_people";
            objectName = "additional person in frame";
          } else if (isGazeDeviation && !hasSuspiciousObject) {
            eventType = "gaze_deviation";
            objectName = "off-screen eye-gaze deviation";
          } else if (result.monocularDepthEstimate?.within3FeetZone) {
            eventType = "monocular_depth_proximity";
            objectName = "object proximity (<3ft)";
          }

          const incidentDesc = result.incidentDescription || 
            (firstSuspicious ? `Candidate utilized or placed ${firstSuspicious.label} at [${timeFormatted}]` : 
            isGazeDeviation ? `Frequent off-screen eye-gaze deviation detected at [${timeFormatted}]` : 
            `Visual anomaly detected at [${timeFormatted}]`);

          const newEvent: ProctoringEvent = {
            id: `evt_proctor_${Date.now()}`,
            timestamp: Date.now(),
            timeFormatted,
            eventType,
            objectName,
            confidence: Math.round((firstSuspicious?.confidence || result.eyeGazeAnalysis?.confidence || 0.92) * 100),
            proximityScore: result.monocularDepthEstimate?.within3FeetZone ? "close (<3ft)" : "medium (3-6ft)",
            snapshotBase64: frameBase64,
            severity: result.overallRiskLevel === "high" || hasSuspiciousObject ? "high" : "medium",
            reviewed: false,
            notes: incidentDesc,
          };

          setProctoringEvents((prev) => {
            if (prev.length > 0 && Date.now() - prev[0].timestamp < 7000) {
              return prev;
            }
            return [newEvent, ...prev];
          });
        }
      } catch (err) {
        // Silent recovery without disturbing candidate
      }
    }, 8000);

    return () => clearInterval(talviewInterval);
  }, [cameraActive]);

  // Auto-scroll transcript container internally
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, isAiThinking, liveInterimSpeech]);

  // Webcam & WebRTC Starter
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

      // Connect WebRTC stream controller
      if (webrtcControllerRef.current) {
        webrtcControllerRef.current.initialize(stream, (stats) => {
          setWebrtcStats(stats);
        });
      }

      // Start System Audio Listener with the live stream
      if (audioListenerRef.current) {
        audioListenerRef.current.start(stream, (data) => {
          setAudioData(data);
          if (transportManagerRef.current) {
            transportManagerRef.current.setVoiceActivity(data.isSpeaking);
          }
        });
      }

      // Start media recorder
      if (sessionRecorderRef.current) {
        sessionRecorderRef.current.startRecording(stream);
        setIsRecordingSession(true);
      }
    } catch (err: any) {
      console.warn("Webcam/Mic setup notice:", err);
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
            t.sender === "candidate" ? profile.name : "AI Interviewer (VIBE AI)"
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

  // Turn off camera and media streams when ending interview
  const handleEndInterviewSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    stopAISpeech();
    speechRecognizerRef.current?.stop();
    audioListenerRef.current?.stop();
    webrtcControllerRef.current?.dispose();
    transportManagerRef.current?.disconnect();
    onEndInterview();
  };

  // Toggle Speech Input / Voice Recognition with Pipecat VAD
  const toggleListening = () => {
    if (isListening) {
      speechRecognizerRef.current?.stop();
      setIsListening(false);
      setLiveInterimSpeech("");
      orchestratorRef.current?.setStatus("idle");
    } else {
      // Interruption handling if AI is speaking
      if (isAiSpeaking) {
        stopAISpeech();
        setIsAiSpeaking(false);
        avatarEngineRef.current?.setSpeaking(false);
        transportManagerRef.current?.recordInterruption();
      }

      setIsListening(true);
      orchestratorRef.current?.setStatus("listening");
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
          orchestratorRef.current?.setStatus("idle");
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
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 480, 360);
      ctx.fillStyle = "#38BDF8";
      ctx.font = "16px sans-serif";
      ctx.fillText(`WebRTC Stream: ${profile.name}`, 30, 180);
    }
    return canvas.toDataURL("image/jpeg", 0.6);
  };

  // Send candidate answer to AI backend via Vapi/Retell Pipeline
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiThinking) return;

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
    avatarEngineRef.current?.setThinking(true);
    orchestratorRef.current?.setStatus("thinking", { sttLatency: 84, llmLatency: 140 });

    const startTime = Date.now();
    const currentFrame = captureFrameBase64();

    try {
      // Use Multimodal AI Interviewer, Technical Evaluator & Silent Proctor pipeline
      const multimodalRes = await sendMultimodalInterviewStep({
        base64Frame: currentFrame,
        candidateInput: text,
        candidateName: profile.name,
        role: profile.targetRole,
        conversationHistory: updatedHistory,
      });

      const llmLatency = Date.now() - startTime;
      const verbalResponse = multimodalRes.candidate_verbal_response;

      // Handle Silent Proctoring Dual Output
      if (multimodalRes.silent_proctoring_log?.suspicious_activity_detected) {
        const proctorLog = multimodalRes.silent_proctoring_log;
        const timeFormatted = new Date().toLocaleTimeString();
        const newEvent: ProctoringEvent = {
          id: `evt_multimodal_${Date.now()}`,
          timestamp: Date.now(),
          timeFormatted,
          eventType: "device_detected",
          objectName: proctorLog.evidence_description || "suspicious activity detected",
          confidence: Math.round((proctorLog.confidence_score || 0.9) * 100),
          proximityScore: "close (<3ft)",
          snapshotBase64: currentFrame,
          severity: proctorLog.confidence_score > 0.8 ? "high" : "medium",
          reviewed: false,
          notes: proctorLog.evidence_description || `Suspicious activity logged at [${timeFormatted}]`,
        };
        setProctoringEvents((prev) => [newEvent, ...prev]);
      }

      // Handle Performance Analysis Dual Output
      if (multimodalRes.performance_analysis) {
        const perf = multimodalRes.performance_analysis;
        const rawRunning = perf.running_score_out_of_10 || 8.0;
        const normalizedScore = Math.min(100, Math.max(30, Math.round(rawRunning * 10)));
        const commScore = perf.communication_clarity ? Math.min(100, Math.max(35, normalizedScore + 5)) : 80;

        setSkillScores((prev) => {
          if (evaluatedTurnsCount === 0) {
            return {
              technicalDepth: normalizedScore,
              problemSolving: normalizedScore,
              communication: commScore,
            };
          }
          return {
            technicalDepth: Math.round((prev.technicalDepth * 2 + normalizedScore) / 3),
            problemSolving: Math.round((prev.problemSolving * 2 + normalizedScore) / 3),
            communication: Math.round((prev.communication * 2 + commScore) / 3),
          };
        });

        setEvaluatedTurnsCount((prev) => prev + 1);
        if (perf.technical_understanding || perf.communication_clarity) {
          setLatestEvidenceNote(
            `${perf.technical_understanding || ""} ${perf.communication_clarity || ""}`.trim()
          );
        }
      }

      const aiTurn: ConversationTurn = {
        id: `turn_${Date.now() + 1}`,
        sender: "ai",
        text: verbalResponse,
        language: detectedLanguage || "English",
        timestamp: Date.now(),
        turnAssessment: {
          technicalUnderstandingScore: Math.round(multimodalRes.performance_analysis?.running_score_out_of_10 || 8),
          communicationClarityScore: 8,
          evidenceNote: multimodalRes.performance_analysis?.technical_understanding || "Evaluated response depth.",
          suggestedNextStage: "continue_topic",
        },
      };

      setConversationHistory((prev) => [...prev, aiTurn]);

      // Trigger TTS & Avatar Lip Sync
      if (!audioMuted) {
        orchestratorRef.current?.setStatus("synthesizing", { llmLatency, ttsLatency: 45 });
        avatarEngineRef.current?.setThinking(false);
        avatarEngineRef.current?.setSpeaking(true);

        speakAIResponse(verbalResponse, {
          language: detectedLanguage || "English",
          onStart: () => {
            setIsAiSpeaking(true);
            avatarEngineRef.current?.setSpeaking(true);
            orchestratorRef.current?.setStatus("speaking");
          },
          onEnd: () => {
            setIsAiSpeaking(false);
            avatarEngineRef.current?.setSpeaking(false);
            orchestratorRef.current?.setStatus("idle");
          },
        });
      }
    } catch (err: any) {
      console.error("AI turn error:", err);
      const fallbackText = `Regarding your point on "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}", how do you evaluate the scalability and failure recovery considerations in production?`;

      const fallbackTurn: ConversationTurn = {
        id: `turn_${Date.now() + 1}`,
        sender: "ai",
        text: fallbackText,
        language: "English",
        timestamp: Date.now(),
        eventTag: "adaptive_probe",
      };
      setConversationHistory((prev) => [...prev, fallbackTurn]);
    } finally {
      setIsAiThinking(false);
      avatarEngineRef.current?.setThinking(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F8F9FA] text-[#202124] p-4 sm:p-6 flex flex-col gap-5">
      
      {/* Top Header: 10-Minute Pacing, Live Subsystems & Architecture Telemetry Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Timer & Round Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                Live Technical Interview Session
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                WebRTC Active
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-gray-600">
              <span className="font-mono text-[#1a73e8] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {formatRecTime(remainingSeconds)} Remaining (10:00 Total)
              </span>
              <span className="text-gray-400">•</span>
              <span className={currentPhase === 1 ? "text-[#1a73e8] font-bold" : currentPhase === 2 ? "text-indigo-600 font-bold" : "text-emerald-600 font-bold"}>
                {currentPhase === 1 ? "Round 1: Personal Experience & Architecture" : currentPhase === 2 ? "Round 2: Live Coding Sandbox" : "Round 3: AI Synthesis"}
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

        {/* Right: Real-Time Architecture Telemetry & Actions */}
        <div className="flex items-center gap-2">
          {/* Telemetry Inspector Button */}
          <button
            onClick={() => setShowArchTelemetry(!showArchTelemetry)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showArchTelemetry
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
            title="Inspect real-time WebRTC, LiveKit, Avatar, and Vapi/Retell telemetry"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Streaming Telemetry</span>
            {showArchTelemetry ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Recording Control Button */}
          <button
            onClick={handleToggleRecording}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
              isRecordingSession
                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
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
                <span>Record</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-Time Architecture Telemetry Drawer (WebRTC, LiveKit/Pipecat, Anam/HeyGen/D-ID, Vapi/Retell) */}
      {showArchTelemetry && (
        <div className="bg-gray-900 text-white rounded-2xl p-5 border border-gray-800 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-[#4285F4]" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Real-Time Streaming & Orchestration Telemetry Stack
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">Avatar Engine:</span>
              <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
                {(["Anam AI", "HeyGen", "D-ID"] as AvatarProvider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedAvatarProvider(p)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                      selectedAvatarProvider === p
                        ? "bg-[#4285F4] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. WebRTC & Video SDK Stats */}
            <div className="p-3 bg-gray-800/80 rounded-xl border border-gray-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  WebRTC / Video SDK
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  {webrtcStats.connectionState}
                </span>
              </div>
              <div className="text-[11px] text-gray-300 space-y-0.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">RTT Latency:</span>
                  <span className="text-emerald-400 font-bold">{webrtcStats.roundTripTimeMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bitrate:</span>
                  <span>{webrtcStats.bitrateKbps} kbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Packet Loss:</span>
                  <span className="text-green-400">{webrtcStats.packetLossPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution:</span>
                  <span>{webrtcStats.resolution}</span>
                </div>
              </div>
            </div>

            {/* 2. LiveKit & Pipecat Stats */}
            <div className="p-3 bg-gray-800/80 rounded-xl border border-gray-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  LiveKit / Pipecat
                </span>
                <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800">
                  {transportStats.transportLatencyMs}ms
                </span>
              </div>
              <div className="text-[11px] text-gray-300 space-y-0.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">VAD Speech:</span>
                  <span className={transportStats.voiceActivityDetected ? "text-emerald-400 font-bold" : "text-gray-500"}>
                    {transportStats.voiceActivityDetected ? "Active Voice" : "Listening..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Audio Buffer:</span>
                  <span>{transportStats.audioBufferMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Interruptions:</span>
                  <span className="text-amber-400 font-bold">{transportStats.interruptionHandledCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transport:</span>
                  <span className="truncate text-gray-300">DataChannel</span>
                </div>
              </div>
            </div>

            {/* 3. Avatar & Lip-Sync Rendering Engine */}
            <div className="p-3 bg-gray-800/80 rounded-xl border border-gray-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                  <VideoIcon className="w-3.5 h-3.5" />
                  {avatarState.provider} Lip-Sync
                </span>
                <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800 uppercase">
                  Viseme: {avatarState.viseme}
                </span>
              </div>
              <div className="text-[11px] text-gray-300 space-y-0.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mouth Open:</span>
                  <span className="text-purple-300 font-bold">{avatarState.mouthOpenPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Head Tilt:</span>
                  <span>{avatarState.headTiltDeg.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expression:</span>
                  <span className="capitalize text-gray-200">{avatarState.expression}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eye Blink:</span>
                  <span>{avatarState.eyeBlinkPercent > 0 ? "Blinking" : "Open (Tracking)"}</span>
                </div>
              </div>
            </div>

            {/* 4. Vapi & Retell AI Pipeline Stats */}
            <div className="p-3 bg-gray-800/80 rounded-xl border border-gray-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  Vapi / Retell AI
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  {orchestratorStats.endToEndLatencyMs}ms E2E
                </span>
              </div>
              <div className="text-[11px] text-gray-300 space-y-0.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">STT (Deepgram):</span>
                  <span>{orchestratorStats.sttLatencyMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">LLM (Gemini):</span>
                  <span className="text-blue-300 font-bold">{orchestratorStats.llmFirstTokenMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TTS Synthesis:</span>
                  <span>{orchestratorStats.ttsSynthesisMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pipeline Status:</span>
                  <span className="capitalize text-emerald-400 font-bold">{orchestratorStats.pipelineStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Hero Video Stage + AI Viseme Avatar & Candidate WebRTC PiP */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative min-h-[440px] sm:min-h-[480px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white flex flex-col justify-between p-6">
            
            {/* Ambient Pulsing Glow Halo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-72 h-72 rounded-full bg-gradient-to-tr from-[#4285F4] via-[#9B51E0] to-[#34A853] blur-3xl transition-all duration-700 ${
                  isAiSpeaking ? "opacity-90 scale-115" : isAiThinking ? "opacity-60 scale-100 animate-pulse" : "opacity-30 scale-90"
                }`}
              />
            </div>

            {/* Top Left Vision & System Badges */}
            <div className="relative z-10 flex flex-col gap-2 self-start">
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#9B51E0] rounded-full shadow-[0_0_8px_#9B51E0]"></div>
                <span className="text-xs text-white font-medium">Vision: Clear</span>
              </div>
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4285F4] rounded-full shadow-[0_0_8px_#4285F4]"></div>
                <span className="text-xs text-white font-medium font-mono">
                  Depth: {monocularDepth.distanceFeet.toFixed(1)}ft
                </span>
              </div>
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10B981]"></div>
                <span className="text-xs text-white font-medium font-mono">
                  {selectedAvatarProvider} Active
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
                    Candidate Stream
                  </span>
                </div>
              )}
              {/* Video Active Status */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] text-white font-bold uppercase">Live WebRTC</span>
              </div>
              {/* Bottom Stream Status */}
              <div className="absolute bottom-0 inset-x-0 h-6 bg-black/70 flex items-center px-2 justify-between">
                <span className="text-[8px] text-white font-bold uppercase">Proctoring AI</span>
                <span className="text-[8px] text-green-400 font-bold">
                  {(monocularDepth.distanceFeet * 0.3048).toFixed(1)}m
                </span>
              </div>
            </div>

            {/* Center Photorealistic AI Avatar & Viseme Lip-Sync Matrix */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
              <div
                className="relative w-36 h-36 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-2xl transition-transform duration-300"
                style={{
                  transform: `rotate(${avatarState.headTiltDeg}deg)`,
                }}
              >
                {/* Visual Avatar Canvas with Real-Time Visemes */}
                <svg className="w-28 h-28" viewBox="0 0 100 100">
                  {/* Face Base */}
                  <circle cx="50" cy="50" r="42" fill="#1E293B" stroke="#4285F4" strokeWidth="2.5" />
                  
                  {/* Eyes with Dynamic Blink Cycle */}
                  <g>
                    {/* Left Eye */}
                    <ellipse
                      cx="36"
                      cy="42"
                      rx="4.5"
                      ry={Math.max(0.5, 4.5 * (1 - avatarState.eyeBlinkPercent / 100))}
                      fill="#FFFFFF"
                    />
                    <circle
                      cx="36"
                      cy="42"
                      r={Math.max(0.3, 2.2 * (1 - avatarState.eyeBlinkPercent / 100))}
                      fill="#38BDF8"
                    />

                    {/* Right Eye */}
                    <ellipse
                      cx="64"
                      cy="42"
                      rx="4.5"
                      ry={Math.max(0.5, 4.5 * (1 - avatarState.eyeBlinkPercent / 100))}
                      fill="#FFFFFF"
                    />
                    <circle
                      cx="64"
                      cy="42"
                      r={Math.max(0.3, 2.2 * (1 - avatarState.eyeBlinkPercent / 100))}
                      fill="#38BDF8"
                    />
                  </g>

                  {/* Eyebrows */}
                  <path
                    d={isAiThinking ? "M 30 35 Q 36 33 42 36" : "M 30 35 Q 36 32 42 35"}
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d={isAiThinking ? "M 58 36 Q 64 33 70 35" : "M 58 35 Q 64 32 70 35"}
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Nose */}
                  <path d="M 50 45 L 48 54 L 52 54" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                  {/* Real-Time Viseme Mouth Shape Mapping */}
                  <g>
                    {avatarState.mouthOpenPercent > 10 ? (
                      <ellipse
                        cx="50"
                        cy="68"
                        rx={Math.max(4, 14 * (avatarState.mouthWidthPercent / 50))}
                        ry={Math.max(2, 8 * (avatarState.mouthOpenPercent / 100))}
                        fill="#E11D48"
                        stroke="#FDA4AF"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <path
                        d={avatarState.expression === "smiling" ? "M 38 68 Q 50 74 62 68" : "M 40 68 Q 50 70 60 68"}
                        stroke="#FDA4AF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    )}
                  </g>
                </svg>

                {/* Pulsing Audio Viseme Ring */}
                {isAiSpeaking && (
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-60 pointer-events-none"></div>
                )}
              </div>

              <div className="mt-3">
                <span className="text-white font-bold text-sm tracking-wide block">
                  AI Technical Interviewer
                </span>
                <span className="text-xs text-blue-300 font-medium">
                  {isAiSpeaking ? `Speaking (${selectedAvatarProvider} Lip-Sync)` : isAiThinking ? "Reasoning & Analyzing..." : "Listening to Candidate"}
                </span>
              </div>
            </div>

            {/* Subtitle Teleprompter HUD */}
            <div className="relative z-10 bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center max-w-2xl mx-auto w-full">
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium line-clamp-3">
                "{subtitleText}"
              </p>
            </div>
          </div>

          {/* Bottom Live Metric Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            {evaluatedTurnsCount === 0 ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <span>Live Response-Driven Evaluation</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-mono">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    The AI dynamically assesses your technical depth, clarity, and architectural reasoning after each response.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
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
                      <span className="text-xs font-bold text-gray-700">{skillScores.technicalDepth}%</span>
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
                      <span className="text-xs font-bold text-gray-700">{skillScores.problemSolving}%</span>
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
                      <span className="text-xs font-bold text-gray-700">{skillScores.communication}%</span>
                    </div>
                  </div>
                </div>

                {latestEvidenceNote && (
                  <div className="text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 max-w-xl truncate">
                    <strong className="text-blue-700 font-semibold">Latest Evidence:</strong> {latestEvidenceNote}
                  </div>
                )}
              </div>
            )}

            {/* Assessment Mode Status */}
            <div className="flex items-center gap-4 sm:border-l sm:border-gray-200 sm:pl-8 self-end sm:self-auto shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">
                  Responses Analyzed
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {evaluatedTurnsCount > 0 ? `${evaluatedTurnsCount} Turn${evaluatedTurnsCount > 1 ? "s" : ""}` : "Listening"}
                </span>
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
                  EN / Multilingual
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
                    {turn.sender === "candidate" ? `${profile.name}` : "AI Interviewer (VIBE AI)"}
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

              {isAiThinking && (
                <div className="flex items-center gap-2 text-gray-500 text-xs py-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                  <span>Formulating technical response...</span>
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
                      ? "Listening in real time..."
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

              <button
                onClick={onNavigateToCoding}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl flex flex-col items-center gap-1 border border-white/5 transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Code Sandbox</span>
              </button>

              <button
                onClick={handleExportTranscript}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl flex flex-col items-center gap-1 border border-white/5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Export Text Log</span>
              </button>

              <button
                onClick={handleEndInterviewSession}
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
              Your audio and video recording chunks have been processed via WebRTC. You can download the media recording file or export the transcript.
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
