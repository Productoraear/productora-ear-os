'use server';

import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOADS_BASE_DIR = path.join(process.cwd(), 'public', 'uploads', 'providers');

export interface MediaActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * 🛡️ Ingesta Multimedia S-Class con Compresión WebP en Servidor y Control de Cuotas
 */
export async function uploadProviderMediaAction(
  providerId: string, 
  formData: FormData
): Promise<MediaActionResult> {
  let writtenFilePath: string | null = null;

  try {
    const file = formData.get('file') as File | null;
    if (!file || typeof file === 'string') {
      return { success: false, error: 'NO_FILE_DETECTED', code: 400 };
    }

    // 1. Verificación o Auto-Inicialización de Cuota del Tenant
    let quota = await prisma.providerQuota.findUnique({
      where: { providerId },
    });

    if (!quota) {
      // Inicializar Cuota Free por defecto (15 MB, 10 fotos)
      quota = await prisma.providerQuota.create({
        data: {
          providerId,
          tier: 'FREE',
          maxStorageMB: 15,
          currentStorageBytes: 0,
          maxPhotos: 10,
        },
      });
    }

    const maxBytes = quota.maxStorageMB * 1024 * 1024;
    if (quota.currentStorageBytes >= maxBytes) {
      return { 
        success: false, 
        error: 'STORAGE_QUOTA_EXCEEDED', 
        code: 413 
      };
    }

    // 2. Extracción a Memoria y Verificación de Integridad Binaria
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Validador de Formato con Sharp (Rechaza scripts .php, .exe, .sh disfrazados)
    const metadata = await sharp(rawBuffer).metadata();
    if (!metadata.format) {
      return { success: false, error: 'INVALID_IMAGE_BINARY', code: 415 };
    }

    // 3. Procesamiento Asíncrono C++ (sharp a WebP S-Class)
    const optimizedBuffer = await sharp(rawBuffer)
      .resize({ 
        width: 1920, 
        height: 1080, 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ 
        quality: 82, 
        effort: 4 
      })
      .toBuffer();

    const finalSizeBytes = optimizedBuffer.byteLength;

    // Validación matemática residual
    if (quota.currentStorageBytes + finalSizeBytes > maxBytes) {
      return { 
        success: false, 
        error: 'INSUFFICIENT_STORAGE_SPACE_FOR_IMAGE', 
        code: 413 
      };
    }

    // 4. Persistencia en Disco con Aislamiento por Tenant
    const tenantDir = path.join(UPLOADS_BASE_DIR, providerId);
    await fs.mkdir(tenantDir, { recursive: true });

    const fileUuid = crypto.randomUUID();
    const fileName = `${fileUuid}.webp`;
    writtenFilePath = path.join(tenantDir, fileName);
    const publicUrl = `/uploads/providers/${providerId}/${fileName}`;

    await fs.writeFile(writtenFilePath, optimizedBuffer);

    // 5. Transacción Atómica ACID en PostgreSQL
    const result = await prisma.$transaction(async (tx) => {
      const asset = await tx.mediaAsset.create({
        data: {
          providerId,
          url: publicUrl,
          type: 'IMAGE',
          sizeBytes: finalSizeBytes,
        },
      });

      await tx.providerQuota.update({
        where: { providerId },
        data: {
          currentStorageBytes: { increment: finalSizeBytes },
        },
      });

      return asset;
    });

    return { 
      success: true, 
      data: {
        id: result.id,
        url: result.url,
        sizeBytes: result.sizeBytes,
        sizeFormatted: `${(result.sizeBytes / 1024).toFixed(1)} KB`,
        createdAt: result.createdAt,
      } 
    };

  } catch (error: any) {
    // 🛡️ Rollback Físico: Eliminar archivo residual en disco si la DB aborta
    if (writtenFilePath) {
      try {
        await fs.unlink(writtenFilePath);
      } catch (unlinkErr) {
        console.warn('Rollback unlink warning:', unlinkErr);
      }
    }

    console.error('❌ Error en uploadProviderMediaAction:', error);
    return { 
      success: false, 
      error: error.message || 'INTERNAL_SERVER_ERROR', 
      code: 500 
    };
  }
}

/**
 * 🗑️ Eliminación Segura de Activo Multimedia con Aislamiento Tenant
 */
export async function deleteProviderMediaAction(
  providerId: string, 
  assetId: string
): Promise<MediaActionResult> {
  try {
    const asset = await prisma.mediaAsset.findFirst({
      where: {
        id: assetId,
        providerId, // 🛡️ Tenant boundary check estricto
      },
    });

    if (!asset) {
      return { success: false, error: 'ASSET_NOT_FOUND_OR_UNAUTHORIZED', code: 404 };
    }

    // 1. Transacción ACID en Base de Datos
    await prisma.$transaction(async (tx) => {
      await tx.mediaAsset.delete({
        where: { id: asset.id },
      });

      await tx.providerQuota.update({
        where: { providerId },
        data: {
          currentStorageBytes: { 
            decrement: Math.min(asset.sizeBytes, (await tx.providerQuota.findUnique({ where: { providerId } }))?.currentStorageBytes || 0) 
          },
        },
      });
    });

    // 2. Eliminación Física en Disco
    const relativePath = asset.url.replace(/^\//, '');
    const fullDiskPath = path.join(process.cwd(), 'public', relativePath);
    
    try {
      await fs.unlink(fullDiskPath);
    } catch (e) {
      console.warn(`[MEDIA_DELETE] Archivo no encontrado en disco: ${fullDiskPath}`);
    }

    return { success: true };

  } catch (error: any) {
    console.error('❌ Error en deleteProviderMediaAction:', error);
    return { success: false, error: error.message || 'INTERNAL_SERVER_ERROR', code: 500 };
  }
}

/**
 * 📊 Consulta de Galería y Cuota en Tiempo Real
 */
export async function getProviderMediaAction(providerId: string): Promise<MediaActionResult> {
  try {
    const [assets, quota] = await Promise.all([
      prisma.mediaAsset.findMany({
        where: { providerId },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.providerQuota.findUnique({
        where: { providerId },
      }),
    ]);

    const maxMB = quota?.maxStorageMB || 15;
    const currentBytes = quota?.currentStorageBytes || 0;
    const currentMB = currentBytes / (1024 * 1024);
    const percentage = Math.min(100, Math.round((currentBytes / (maxMB * 1024 * 1024)) * 100));

    return {
      success: true,
      data: {
        assets: assets.map(a => ({
          id: a.id,
          url: a.url,
          sizeBytes: a.sizeBytes,
          sizeKB: Math.round(a.sizeBytes / 1024),
          createdAt: a.createdAt,
        })),
        quota: {
          tier: quota?.tier || 'FREE',
          maxMB,
          currentMB: parseFloat(currentMB.toFixed(2)),
          currentBytes,
          percentage,
          maxPhotos: quota?.maxPhotos || 10,
          currentPhotos: assets.length,
        },
      },
    };
  } catch (error: any) {
    console.error('❌ Error en getProviderMediaAction:', error);
    return { success: false, error: error.message || 'INTERNAL_SERVER_ERROR', code: 500 };
  }
}
