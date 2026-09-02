import { useState, useCallback } from 'react';
import { sanitizeData } from '../utils/dataSanitizer';

// FIX: Added robust error handling, sanitization, and try-catch blocks to prevent app crashes.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            // If parsing fails (corruption), return initial value to prevent app crash
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            
            // Critical Step: Sanitize data before state update and persistence
            const safeData = sanitizeData(valueToStore);

            setStoredValue(safeData);
            
            if (typeof window !== 'undefined') {
                 if (safeData === null || safeData === undefined) {
                    window.localStorage.removeItem(key);
                } else {
                    // Extra protection against circular structures
                    try {
                        const json = JSON.stringify(safeData);
                        window.localStorage.setItem(key, json);
                        
                        // Dispatch storage event for cross-tab sync if needed
                        window.dispatchEvent(new StorageEvent('storage', {
                            key,
                            newValue: json
                        }));
                    } catch (serializationError) {
                        console.error(`Error serializing localStorage key "${key}":`, serializationError);
                    }
                }
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}