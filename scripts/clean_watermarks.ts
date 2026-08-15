import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * 🖼️ ANTI-WATERMARK PIPELINE (SHARP CROPPING INFORMATICO)
 * Recorta la franja inferior (6%) donde se alojan marcas de agua de portales de terceros
 * y optimiza el buffer a formato WebP S-Class.
 */
export async function sanitizeImageBuffer(imageBuffer: Buffer, outputPath?: string): Promise<Buffer | null> {
  try {
    const metadata = await sharp(imageBuffer).metadata();

    if (!metadata.width || !metadata.height) return null;

    // Cropping Inteligente: Recortar el 6% inferior donde reside la marca de agua
    const cropHeight = Math.floor(metadata.height * 0.94);

    let pipeline = sharp(imageBuffer)
      .extract({ left: 0, top: 0, width: metadata.width, height: cropHeight })
      .webp({ quality: 85 });

    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      await pipeline.toFile(outputPath);
      console.log(`🖼️ Imagen purgada y guardada libre de marcas: ${outputPath}`);
    }

    return await pipeline.toBuffer();
  } catch (error) {
    console.error(`❌ Error limpiando imagen:`, error);
    return null;
  }
}
