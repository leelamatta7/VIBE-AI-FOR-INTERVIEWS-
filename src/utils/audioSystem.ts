// System Audio Listener, Web Audio API Analyser, MediaRecorder, and WhisperFlow Transcription Engine

export interface AudioVisualizerData {
  volume: number; // 0 to 100
  decibels: number; // -100 to 0 dB
  frequencies: number[]; // Normalized frequency bins
  isSpeaking: boolean;
}

export class SystemAudioListener {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private onDataCallback: ((data: AudioVisualizerData) => void) | null = null;
  private isListening: boolean = false;

  public async start(
    existingStream?: MediaStream,
    onData?: (data: AudioVisualizerData) => void
  ): Promise<boolean> {
    if (onData) this.onDataCallback = onData;

    try {
      // Initialize AudioContext
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;

      this.audioContext = new AudioCtx();
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      // Use existing stream or request audio stream
      if (existingStream && existingStream.getAudioTracks().length > 0) {
        this.microphoneStream = existingStream;
      } else {
        this.microphoneStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.microphoneStream);
      this.sourceNode.connect(this.analyser);

      this.isListening = true;
      this.loop();
      return true;
    } catch (err) {
      console.warn("System audio listener initialization notice:", err);
      // Fallback synthetic animation loop if mic denied
      this.isListening = true;
      this.loopSynthetic();
      return false;
    }
  }

  private loop = () => {
    if (!this.isListening || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Compute average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const volume = Math.min(100, Math.round((avg / 255) * 100 * 1.5));
    const decibels = Math.round(20 * Math.log10(Math.max(avg / 255, 0.0001)));
    const isSpeaking = volume > 8;

    const frequencies = Array.from(dataArray.slice(0, 16)).map((val) => val / 255);

    if (this.onDataCallback) {
      this.onDataCallback({
        volume,
        decibels,
        frequencies,
        isSpeaking,
      });
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private loopSynthetic = () => {
    if (!this.isListening) return;

    if (this.onDataCallback) {
      const frequencies = [0.1, 0.2, 0.15, 0.3, 0.2, 0.1, 0.15, 0.2];
      this.onDataCallback({
        volume: 0,
        decibels: -60,
        frequencies,
        isSpeaking: false,
      });
    }
    this.animationFrameId = requestAnimationFrame(this.loopSynthetic);
  };

  public stop() {
    this.isListening = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}

// MediaRecorder Session Recorder (Audio & Video Recording for Interviews)
export class InterviewSessionRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordingStartTime: number = 0;
  private isRecording: boolean = false;
  private recordingBlob: Blob | null = null;

  public startRecording(stream: MediaStream): boolean {
    try {
      this.recordedChunks = [];
      this.recordingBlob = null;

      const mimeTypes = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
        "audio/webm",
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || "";

      const options = selectedMime ? { mimeType: selectedMime } : undefined;
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const type = selectedMime || "video/webm";
        this.recordingBlob = new Blob(this.recordedChunks, { type });
      };

      this.mediaRecorder.start(1000); // 1s slices
      this.recordingStartTime = Date.now();
      this.isRecording = true;
      return true;
    } catch (e) {
      console.warn("MediaRecorder start notice:", e);
      return false;
    }
  }

  public stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        this.isRecording = false;
        resolve(this.recordingBlob);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const type = this.mediaRecorder?.mimeType || "video/webm";
        this.recordingBlob = new Blob(this.recordedChunks, { type });
        this.isRecording = false;
        resolve(this.recordingBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public getElapsedTime(): number {
    if (!this.isRecording) return 0;
    return Math.floor((Date.now() - this.recordingStartTime) / 1000);
  }

  public downloadRecording(filename = "interview-session-recording.webm") {
    if (!this.recordingBlob) return;
    const url = URL.createObjectURL(this.recordingBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
