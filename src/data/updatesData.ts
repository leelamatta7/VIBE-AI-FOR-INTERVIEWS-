import { ProductUpdate } from "../types";

export const PRODUCT_UPDATES: ProductUpdate[] = [
  {
    version: "v2.4.0",
    date: "August 2026",
    title: "VIBE AI Talview-Grade Proctoring & Live Session Recording",
    tag: "Talview AI",
    description:
      "Major release introducing silent Talview-style Computer Vision monitoring, on-demand session audio/video recording, interactive candidate profiles with resume parsing, and restructured executive assessment reports.",
    highlights: [
      "Talview Multi-Tier Proctoring: Eye-gaze deviation tracking, monocular <3ft device proximity detection, multi-person alert system, and background voice anomaly logging.",
      "Live Interview Video Recording: Start and stop live meeting recording with real-time timers and direct .webm video downloads.",
      "VIBE AI Brand Identity: Refreshed high-contrast display styling with streamlined modern typography.",
      "Interactive User Profile Portal: Dedicated CV/resume viewer, phone number, personal credentials, work history, and 1-click field autofill.",
      "Evidence-Based Silent Observation Report: Highlighted proctoring summaries with exact timeline timestamps and printable PDF exports.",
      "Direct Support & Feedback Channel: Embedded Contact Us desk and user rating collector.",
    ],
  },
  {
    version: "v2.3.1",
    date: "July 2026",
    title: "Multilingual Code-Switching & Real-Time Audio Listener",
    tag: "Feature",
    description:
      "Enhanced voice recognition supporting mixed Hindi-English (Hinglish), Telugu, Tamil, and Spanish with instantaneous subtitle transcription.",
    highlights: [
      "Sub-500ms voice synthesis with natural interviewer inflection.",
      "WebAudio frequency visualizer with real-time decibel metering.",
      "Dynamic difficulty adaptation based on candidate technical depth scores.",
    ],
  },
  {
    version: "v2.2.0",
    date: "June 2026",
    title: "360° Workspace Verification & Algorithmic Code Sandbox",
    tag: "Enhancement",
    description:
      "Pre-interview 5-angle workspace inspection and integrated JavaScript/Python coding environment with automated unit testing.",
    highlights: [
      "5-step workspace perimeter scan (Front, Left, Right, Desk, Behind).",
      "In-browser sandbox with test-case validation and O(N) algorithmic complexity analysis.",
      "Discrepancy flag engine comparing candidate resumes against job descriptions.",
    ],
  },
];
