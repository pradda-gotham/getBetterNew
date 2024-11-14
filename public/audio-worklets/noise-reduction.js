class NoiseReductionProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.noiseProfile = new Float32Array(this.bufferSize);
    this.calibrationCount = 0;
    this.isCalibrating = true;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (!input || !output) return true;

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      if (this.isCalibrating) {
        // Build noise profile during first few frames
        for (let i = 0; i < inputChannel.length; i++) {
          this.noiseProfile[i] += Math.abs(inputChannel[i]);
        }
        this.calibrationCount++;

        if (this.calibrationCount >= 10) {
          // Average the noise profile
          for (let i = 0; i < this.bufferSize; i++) {
            this.noiseProfile[i] /= this.calibrationCount;
          }
          this.isCalibrating = false;
        }

        // Pass through audio during calibration
        outputChannel.set(inputChannel);
      } else {
        // Apply noise reduction
        for (let i = 0; i < inputChannel.length; i++) {
          const sample = inputChannel[i];
          const noiseMagnitude = this.noiseProfile[i];
          
          // Simple noise gate with smoothing
          if (Math.abs(sample) > noiseMagnitude * 1.5) {
            outputChannel[i] = sample;
          } else {
            outputChannel[i] = sample * 0.1; // Reduce noise by 90%
          }
        }
      }
    }

    return true;
  }
}

registerProcessor('noise-reduction-processor', NoiseReductionProcessor);