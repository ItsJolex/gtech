export interface OptimizedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  savedPercent: number;
  width: number;
  height: number;
  format: 'image/webp';
  filename: string;
}

/**
 * Automatically converts any JPG, JPEG, or PNG image into an optimized WebP format
 * directly in the browser using HTML5 Canvas / OffscreenCanvas.
 */
export async function convertToWebP(
  file: File,
  quality = 0.85,
  maxWidth = 1600,
  maxHeight = 1600
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    // If it's already webp, we still optimize dimensions/quality if needed
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file or format'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio safe resizing if image is larger than max bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to WebP Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('WebP canvas conversion failed'));
              return;
            }

            const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
            const newFilename = `${cleanBaseName}.webp`;

            const webpFile = new File([blob], newFilename, { type: 'image/webp' });
            const dataUrl = canvas.toDataURL('image/webp', quality);

            const originalSize = file.size;
            const optimizedSize = blob.size;
            const savedPercent = Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100));

            resolve({
              file: webpFile,
              dataUrl,
              originalSize,
              optimizedSize,
              savedPercent,
              width,
              height,
              format: 'image/webp',
              filename: newFilename,
            });
          },
          'image/webp',
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human readable format (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
