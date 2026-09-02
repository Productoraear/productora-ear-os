
import { useState, useCallback } from 'react';
import { streamGeminiResponse } from '../services/geminiService';

export const useAIAssistant = () => {
    const [response, setResponse] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const generateResponse = useCallback(async (query: string) => {
        setIsStreaming(true);
        setResponse(""); 
        
        try {
            const stream = streamGeminiResponse(query);
            for await (const chunk of stream) {
                setResponse(prev => prev + chunk); 
            }
        } catch (err) {
            setResponse("Error al generar respuesta.");
        } finally {
            setIsStreaming(false);
        }
    }, []);

    return { response, isStreaming, generateResponse };
};
