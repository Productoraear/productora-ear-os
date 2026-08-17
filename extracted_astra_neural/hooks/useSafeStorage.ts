import { useState, useCallback } from 'react';
import { sanitizeData } from '../utils/dataSanitizer';

// Safe wrapper to avoid Main Thread bottlenecks and circular reference crashes
export function useSafeStorage<T>(key: string, initialValue: T) {
    // Lazy initialization to avoid blocking first render
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Async-like setter with automatic sanitization
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            // CRITICAL STEP: Sanitize before saving
            const safeData = sanitizeData(valueToStore);
            
            setStoredValue(safeData);
            
            if (typeof window !== 'undefined') {
                try {
                    const json = JSON.stringify(safeData);
                    window.localStorage.setItem(key, json);
                    
                    // Dispatch event to sync tabs
                    window.dispatchEvent(new StorageEvent('storage', {
                        key,
                        newValue: json
                    }));
                } catch (serializationError) {
                    console.error(`Error serializing key "${key}":`, serializationError);
                }
            }
        } catch (error) {
            console.error(`Error saving localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue] as const;
}