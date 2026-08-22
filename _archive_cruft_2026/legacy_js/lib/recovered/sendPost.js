/**
 * @file sendPost.ts
 * @description Wrapper universal para peticiones POST asíncronas.
 */
export const sendPost = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error en POST: ${response.status}`);
    }
    return response.json();
};
