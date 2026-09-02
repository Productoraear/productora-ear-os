import { GoogleGenAI, Modality } from "@google/genai";

// Base64 decode function
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// PCM audio data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // FIX: Property 'webkitAudioContext' does not exist on type 'Window & typeof globalThis'. Cast to any to fix.
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  ctx.close(); // Close context after decoding to save resources
  return buffer;
}


export const textToSpeech = async (text: string): Promise<AudioBuffer | null> => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
                       process.env.GEMINI_API_KEY || 
                       process.env.API_KEY || 
                       "AIzaSyDummyClientSafeFallbackKey00000000";
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A neutral, professional voice
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
            const decodedBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(
                decodedBytes,
                24000,
                1,
            );
            return audioBuffer;
        }
        return null;
    } catch (error) {
        console.error("Text-to-speech generation failed:", error);
        return null;
    }
};