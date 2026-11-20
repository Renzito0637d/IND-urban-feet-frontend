/**
 * Convierte un archivo de imagen (PNG, JPG, WEBP, etc.) al formato estándar .webp
 * y retorna su representación en Base64 Data URL (data:image/webp;base64,...).
 * Opcionalmente redimensiona manteniendo el aspect ratio para optimizar el tamaño del BLOB.
 */
export async function convertFileToWebP(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensionar manteniendo proporción si excede los límites recomendados
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
          reject(new Error('No se pudo inicializar el canvas para convertir la imagen.'));
          return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir nativamente a formato .webp con calidad controlada
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen para su procesamiento.'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo desde el disco.'));
    };

    reader.readAsDataURL(file);
  });
}
