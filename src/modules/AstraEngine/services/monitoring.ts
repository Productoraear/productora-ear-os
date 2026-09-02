
import * as Sentry from "@sentry/react";

/**
 * Initializes error monitoring and analytics.
 */
export const initMonitoring = () => {
    try {
        // Critical Safety Check for Read-Only Environments
        // Sentry attempts to wrap window.fetch for breadcrumbs. If the environment (like some webviews or sandboxes)
        // makes fetch read-only, the app crashes immediately upon Sentry.init.
        let fetchIsWritable = true;
        try {
            // Test if we can write to fetch
            const originalFetch = window.fetch;
            window.fetch = originalFetch; 
        } catch (e) {
            fetchIsWritable = false;
        }

        if (!fetchIsWritable) {
            console.warn("Astra OS Monitoring: 'window.fetch' is read-only. Skipping Sentry initialization to prevent crash.");
            return;
        }

        // Standard Initialization
        // FIX: Replaced BrowserTracing and Replay classes with functional integrations (browserTracingIntegration and replayIntegration)
        // to resolve TypeScript property existence errors and follow modern Sentry SDK best practices.
        Sentry.init({
            dsn: "https://examplePublicKey@o0.ingest.sentry.io/0", 
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
            // Performance Monitoring
            tracesSampleRate: 1.0, 
            // Session Replay
            replaysSessionSampleRate: 0.1, 
            replaysOnErrorSampleRate: 1.0, 
            
            // Filter out noise
            beforeSend(event) {
                if (event.exception?.values?.[0].value?.includes('ResizeObserver loop')) {
                    return null;
                }
                return event;
            }
        });
        console.log("Astra OS Monitoring Initialized: Sentry Active");

    } catch (e) {
        console.error("Failed to initialize monitoring:", e);
    }
};

/**
 * Custom Event Tracking for Plausible (Privacy-friendly)
 */
export const trackEvent = (eventName: string, props?: Record<string, any>) => {
    // @ts-ignore
    if (window.plausible) {
        // @ts-ignore
        window.plausible(eventName, { props });
    } else {
        // console.debug(`[Analytics] ${eventName}`, props);
    }
};
