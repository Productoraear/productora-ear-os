
// Simulating a backend challenge for WebAuthn
const generateChallenge = () => {
    return Uint8Array.from(window.crypto.getRandomValues(new Uint8Array(32)));
};

export const registerCredential = async (username: string): Promise<boolean> => {
    // Simulated fallback for sandboxed environments
    if (!window.PublicKeyCredential || window.location.protocol === 'http:') {
        console.warn("WebAuthn is not supported or blocked. Using simulated registration.");
        localStorage.setItem('astra_auth_registered', 'true');
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    }

    try {
        const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
            challenge: generateChallenge(),
            rp: {
                name: "Astra OS",
                id: window.location.hostname,
            },
            user: {
                id: Uint8Array.from(username, c => c.charCodeAt(0)),
                name: username,
                displayName: username,
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
            },
            timeout: 60000,
            attestation: "direct"
        };

        const credential = await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
        });

        if (credential) {
            localStorage.setItem('astra_auth_registered', 'true');
            return true;
        }
    } catch (err: any) {
        if (err.name === 'SecurityError' || err.name === 'NotAllowedError') {
            console.error("Biometric registration blocked by security policy or user refusal:", err.message);
        } else {
            console.error("Biometric registration failed:", err);
        }
    }
    return false;
};

export const loginWithCredential = async (): Promise<boolean> => {
    // Simulated fallback for sandboxed environments
    if (!window.PublicKeyCredential || window.location.protocol === 'http:') {
        console.warn("WebAuthn is not supported or blocked. Using simulated login.");
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    }

    try {
        const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
            challenge: generateChallenge(),
            timeout: 60000,
            userVerification: "required",
        };

        const assertion = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions
        });

        if (assertion) {
            return true;
        }
    } catch (err: any) {
        console.error("Biometric login failed or blocked:", err.message);
    }
    return false;
};

export const isDeviceRegistered = (): boolean => {
    // Check if we are in a context that even allows checking
    if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
    return !!localStorage.getItem('astra_auth_registered');
};
