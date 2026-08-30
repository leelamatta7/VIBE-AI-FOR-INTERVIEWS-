// Web Speech API wrapper for real-time speech-to-text and text-to-speech

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US"; // default, can switch

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullText = (finalTranscript || interimTranscript).trim();
        if (fullText && this.onResultCallback) {
          this.onResultCallback(fullText, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error !== "no-speech" && this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Already started or terminated
          }
        }
      };
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public setLanguage(langCode: string) {
    if (!this.recognition) return;
    if (langCode === "hi" || langCode.toLowerCase().includes("hindi")) {
      this.recognition.lang = "hi-IN";
    } else if (langCode === "te" || langCode.toLowerCase().includes("telugu")) {
      this.recognition.lang = "te-IN";
    } else if (langCode === "ta" || langCode.toLowerCase().includes("tamil")) {
      this.recognition.lang = "ta-IN";
    } else if (langCode === "es" || langCode.toLowerCase().includes("spanish")) {
      this.recognition.lang = "es-ES";
    } else {
      this.recognition.lang = "en-US";
    }
  }

  public start(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ) {
    if (!this.recognition) return;
    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    this.isListening = true;
    try {
      this.recognition.start();
    } catch (e) {
      // Ignored if already started
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
    }
  }
}

// Text-to-Speech synthesizer
export function speakAIResponse(
  text: string,
  options?: {
    language?: string;
    onStart?: () => void;
    onEnd?: () => void;
  }
) {
  if (!("speechSynthesis" in window)) {
    if (options?.onEnd) options.onEnd();
    return;
  }

  // Cancel ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown symbols for natural speech
  const cleanText = text
    .replace(/[*#`_~[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Language auto selection
  const lang = options?.language?.toLowerCase() || "english";
  if (lang.includes("hindi") || lang === "hi") {
    utterance.lang = "hi-IN";
  } else if (lang.includes("telugu") || lang === "te") {
    utterance.lang = "te-IN";
  } else if (lang.includes("spanish") || lang === "es") {
    utterance.lang = "es-ES";
  } else {
    utterance.lang = "en-US";
  }

  // Try to pick natural Google voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith(utterance.lang.substring(0, 2)) &&
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Neural"))
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  utterance.onerror = () => {
    if (options?.onEnd) options.onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopAISpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
