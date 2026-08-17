
import { v4 as uuidv4 } from 'uuid'; // We'll use a simple random string generator if uuid isn't available, or polyfill it.

// Simple UUID generator if package not present
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export interface TelemetryEvent {
    id: string;
    timestamp: number;
    type: 'AI_REQUEST' | 'SYSTEM_ERROR' | 'USER_ACTION' | 'PERFORMANCE_METRIC';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    details: any;
    duration?: number;
}

export interface SystemHealth {
    status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
    latency: number; // Average ms
    errorRate: number; // Percentage
    totalRequests: number;
    tokensProcessed: number; // Simulated
}

class TelemetryService {
    private eventLog: TelemetryEvent[] = [];
    private maxLogSize = 100;

    constructor() {
        // Load from storage if available
        try {
            const stored = localStorage.getItem('astra_telemetry_logs');
            if (stored) {
                this.eventLog = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load telemetry logs');
        }
    }

    private saveLogs() {
        if (this.eventLog.length > this.maxLogSize) {
            this.eventLog = this.eventLog.slice(-this.maxLogSize);
        }
        try {
            localStorage.setItem('astra_telemetry_logs', JSON.stringify(this.eventLog));
        } catch (e) {
            // Ignore storage errors
        }
    }

    public log(type: TelemetryEvent['type'], details: any, severity: TelemetryEvent['severity'] = 'INFO', duration?: number) {
        const event: TelemetryEvent = {
            id: generateId(),
            timestamp: Date.now(),
            type,
            severity,
            details,
            duration
        };
        
        this.eventLog.push(event);
        this.saveLogs();
        
        if (severity === 'CRITICAL') {
            console.error('[ASTRA FORENSIC LOG]', event);
        } else {
            // console.debug('[ASTRA LOG]', event);
        }
    }

    public getSystemHealth(): SystemHealth {
        const recentLogs = this.eventLog.slice(-50); // Analyze last 50 events
        const errors = recentLogs.filter(e => e.severity === 'CRITICAL' || e.type === 'SYSTEM_ERROR').length;
        const aiRequests = recentLogs.filter(e => e.type === 'AI_REQUEST' && e.duration);
        
        const totalLatency = aiRequests.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const avgLatency = aiRequests.length > 0 ? Math.round(totalLatency / aiRequests.length) : 0;
        const errorRate = recentLogs.length > 0 ? (errors / recentLogs.length) * 100 : 0;

        let status: SystemHealth['status'] = 'OPTIMAL';
        if (errorRate > 5) status = 'DEGRADED';
        if (errorRate > 20) status = 'CRITICAL';

        return {
            status,
            latency: avgLatency,
            errorRate: parseFloat(errorRate.toFixed(2)),
            totalRequests: this.eventLog.filter(e => e.type === 'AI_REQUEST').length,
            tokensProcessed: this.eventLog.length * 150 // Simulated token count
        };
    }

    public getRecentEvents(limit = 10): TelemetryEvent[] {
        return [...this.eventLog].reverse().slice(0, limit);
    }
}

export const telemetry = new TelemetryService();
