const fs = require('fs');

// Generate a valid 44100Hz 16-bit PCM WAV file with a warm melodic chord (A4 440Hz + C#5 554Hz + E5 659Hz)
const sampleRate = 44100;
const durationSeconds = 15; // 15 seconds warm intro preview
const numSamples = sampleRate * durationSeconds;
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = numSamples * blockAlign;

const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);

// fmt subchunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size
buffer.writeUInt16LE(1, 20); // AudioFormat PCM = 1
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(bytesPerSample * 8, 34);

// data subchunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Generate gentle melodic synth arpeggio for introduction
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  // Chord frequencies: A3 (220), E4 (330), A4 (440), C#5 (554.37)
  const freq1 = 220;
  const freq2 = 330;
  const freq3 = 440;
  const freq4 = 554.37;
  
  // Envelope: gentle fade in and smooth sound
  const envelope = Math.min(1, t / 0.5) * Math.min(1, (durationSeconds - t) / 0.5);
  
  const sample = (
    Math.sin(2 * Math.PI * freq1 * t) * 0.25 +
    Math.sin(2 * Math.PI * freq2 * t) * 0.25 +
    Math.sin(2 * Math.PI * freq3 * t) * 0.25 +
    Math.sin(2 * Math.PI * freq4 * t) * 0.25
  ) * envelope * 0.4;
  
  const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
  
  const offset = 44 + i * blockAlign;
  buffer.writeInt16LE(intSample, offset);     // Left
  buffer.writeInt16LE(intSample, offset + 2); // Right
}

fs.writeFileSync('public/media/dani-aragon-vault/masterclass_preview_01.wav', buffer);
console.log('Saved valid WAV masterclass_preview_01.wav, size:', buffer.length);

