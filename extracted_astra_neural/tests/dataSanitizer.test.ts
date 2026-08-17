import { describe, it, expect } from 'vitest';
import { sanitizeData } from '../utils/dataSanitizer';

describe('Forensic Data Sanitizer', () => {
    it('removes React synthetic events', () => {
        const maliciousPayload = {
            id: '123',
            // Simulación de un evento de click capturado por error
            onClick: { _reactName: 'onClick', target: {} }, 
            validData: 'Keep me'
        };

        const clean = sanitizeData(maliciousPayload);
        
        expect(clean.onClick).toBeUndefined();
        expect(clean.validData).toBe('Keep me');
    });

    it('handles circular references without crashing', () => {
        const circular: any = { name: 'Loop' };
        circular.self = circular; // Referencia circular

        const clean = sanitizeData(circular);
        
        expect(clean.name).toBe('Loop');
        expect(clean.self).toBeUndefined(); // Debe haber cortado el ciclo
    });
});