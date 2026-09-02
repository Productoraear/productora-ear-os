import paypal from '@paypal/checkout-server-sdk';

/**
 * 🅿️ EAR OS PayPal Engine - Nexus Layer
 * Integración de Pasarelas de Pago de Grado Militar (Producción)
 */

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

// Configuración del entorno (Sandbox o Live)
const environment = process.env.NODE_ENV === 'production' 
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

export const client = new paypal.core.PayPalHttpClient(environment);

/**
 * Crea una orden en PayPal
 */
export const createPayPalOrder = async (amount: number, orderId: string) => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            reference_id: orderId,
            amount: {
                currency_code: 'USD',
                value: amount.toFixed(2)
            }
        }]
    });

    try {
        const response = await client.execute(request);
        return response.result;
    } catch (error: any) {
        console.error("❌ PAYPAL ERROR:", error.message);
        throw error;
    }
};

/**
 * Captura un pago autorizado de PayPal
 */
export const capturePayPalPayment = async (paypalOrderId: string) => {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    try {
        const response = await client.execute(request);
        return response.result;
    } catch (error: any) {
        console.error("❌ PAYPAL CAPTURE ERROR:", error.message);
        throw error;
    }
};

export const PAYPAL_CONFIG = {
    clientId,
    currency: 'USD'
};
