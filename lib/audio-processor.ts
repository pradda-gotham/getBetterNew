import { AssemblyAI } from 'assemblyai';

export class AudioProcessor {
  private audioContext: AudioContext;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private analyserNode: AnalyserNode;
  private gainNode: GainNode;
  private assemblyai: AssemblyAI;
  private onVolumeChange: (volume: number) => void;
  private onNoiseLevel: (level: number) => void;
  private onQualityIssue: (issue: string) => void;

  constructor(
    assemblyApiKey: string,
    onVolumeChange: (volume: number) => void,
    onNoiseLevel: (level: number) => void,
    onQualityIssue: (issue: string) => void
  ) {
    this.audioContext = new AudioContext();
    this.analyserNode = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    this.assemblyai = new AssemblyAI({ apiKey: assemblyApiKey });
    this.onVolumeChange = onVolumeChange;
    this.onNoiseLevel = onNoiseLevel;
    this.onQualityIssue = onQualityIssue;

    // Configure analyser node
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.8;

    // Initialize audio processing chain
    this.initializeProcessingChain();
  }

  private async initializeProcessingChain() {
    try {
      // Connect nodes
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);

      // Start audio quality monitoring
      this.startQualityMonitoring();
    } catch (error) {
      console.error('Failed to initialize audio processing chain:', error);
    }
  }

  private startQualityMonitoring() {
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const checkQuality = () => {
      this.analyserNode.getFloatFrequencyData(dataArray);

      // Calculate average volume
      const volume = this.calculateVolume(dataArray);
      this.onVolumeChange(volume);

      // Calculate noise level
      const noiseLevel = this.calculateNoiseLevel(dataArray);
      this.onNoiseLevel(noiseLevel);

      // Check for quality issues
      this.checkQualityIssues(volume, noiseLevel, dataArray);

      // Continue monitoring
      requestAnimationFrame(checkQuality);
    };

    checkQuality();
  }

  private calculateVolume(dataArray: Float32Array): number {
    const sum = dataArray.reduce((acc, val) => acc + Math.abs(val), 0);
    return sum / dataArray.length;
  }

  private calculateNoiseLevel(dataArray: Float32Array): number {
    // Focus on high-frequency components (typically noise)
    const highFreqData = dataArray.slice(Math.floor(dataArray.length * 0.7));
    const sum = highFreqData.reduce((acc, val) => acc + Math.abs(val), 0);
    return sum / highFreqData.length;
  }

  private checkQualityIssues(volume: number, noiseLevel: number, dataArray: Float32Array) {
    // Check for low volume
    if (volume < -50) {
      this.onQualityIssue('Low volume detected');
    }

    // Check for high noise
    if (noiseLevel > -30) {
      this.onQualityIssue('High background noise detected');
    }

    // Check for clipping
    if (dataArray.some(val => val > -1)) {
      this.onQualityIssue('Audio clipping detected');
    }
  }

  public async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Connect stream to audio context
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.gainNode);

      // Create and configure media recorder
      const mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder = mediaRecorder;
      this.audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  public stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
    });
  }

  public async analyzeAudio(audioBlob: Blob): Promise<any> {
    try {
      const transcript = await this.assemblyai.transcripts.create({
        audio: audioBlob,
        language_detection: true,
        sentiment_analysis: true,
        entity_detection: true,
      });

      return transcript;
    } catch (error) {
      console.error('Failed to analyze audio:', error);
      throw error;
    }
  }
}