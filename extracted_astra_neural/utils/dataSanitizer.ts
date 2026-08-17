/**
 * Forensic utility to clean data before persistence.
 * Removes React Synthetic Events, DOM nodes, and circular references.
 * Essential for preventing 'JSON.stringify' crashes in localStorage.
 */
export const sanitizeData = <T>(data: T): T => {
    if (data === null || data === undefined) return data;

    const seen = new WeakSet();

    const cleaner = (key: string, value: any) => {
        // 1. Remove circular references
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
        }

        // 2. Remove React Events and DOM Nodes (Common crash causes)
        if (
            value &&
            (value._reactName || // React Synthetic Events
             value.nativeEvent || 
             value instanceof Event || 
             value instanceof Node ||
             key === 'view' ||   // Window references
             key === 'sourceCapabilities' || 
             key === 'target' || 
             key === 'currentTarget')
        ) {
            return undefined;
        }

        return value;
    };

    try {
        // Use JSON stringify/parse with replacer to deep clean
        return JSON.parse(JSON.stringify(data, cleaner));
    } catch (error) {
        console.error("Forensic Error: Data could not be sanitized", error);
        // Fallback: return empty object if complex object fails, or original if primitive
        return (typeof data === 'object' ? {} : data) as T; 
    }
};