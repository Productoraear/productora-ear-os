/**
 * @file sendForm.ts
 * @description Manejador de envíos de formularios multipart/form-data.
 */

export const sendForm = async (url: string, formData: FormData): Promise<any> => {
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    // Note: Fetch establece automáticamente el boundary para FormData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en Form Submission: ${response.status} - ${errorText}`);
  }

  return response.json();
};
