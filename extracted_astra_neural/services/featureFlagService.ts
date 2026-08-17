
export const FEATURE_FLAGS = {
    ENABLE_OBFUSCATION: true,
    USE_VECTOR_DB: true,
    ENABLE_VOICE_INPUT: true,
    ENABLE_PAYMENTS: false, // Not ready
    USE_STREAMING_RESPONSES: true,
    ENABLE_AUTO_BACKUP: true
};

export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
    // In a real app, this could check an external config or user ID for A/B testing
    return FEATURE_FLAGS[feature];
};
