import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        // Initialize AudioContext on mount
        // FIX: Property 'webkitAudioContext' does not exist on type 'Window & typeof globalThis'. Cast to any to fix.
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        return () => {
            // Cleanup on unmount
            audioCtxRef.current?.close();
        };
    }, []);

    const play = useCallback((audioBuffer: AudioBuffer, onEnd?: () => void) => {
        if (!audioCtxRef.current || isPlaying) return;

        // Stop any currently playing audio
        if (currentSourceRef.current) {
            currentSourceRef.current.stop();
        }

        const source = audioCtxRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtxRef.current.destination);
        
        source.onended = () => {
            setIsPlaying(false);
            currentSourceRef.current = null;
            if (onEnd) onEnd();
        };
        
        source.start(0);
        setIsPlaying(true);
        currentSourceRef.current = source;
    }, [isPlaying]);

    const stop = useCallback(() => {
        if (currentSourceRef.current) {
            currentSourceRef.current.stop();
            // onended will handle the state cleanup
        }
    }, []);

    return { play, stop, isPlaying };
};