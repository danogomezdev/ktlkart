/**
 * Transforma una URL de Supabase Storage para pedir la imagen
 * redimensionada desde el servidor — sin recalidad visible.
 * 
 * Supabase soporta: /storage/v1/render/image/public/...?width=X&quality=Y
 */
export function getResizedUrl(url, { width = 800, quality = 75 } = {}) {
  if (!url || !url.includes('supabase')) return url;
  // Reemplaza /object/public/ por /render/image/public/ y agrega params
  return url
    .replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
    + `?width=${width}&quality=${quality}&resize=contain`;
}

// Para thumbnails chicos
export function getThumbUrl(url) {
  return getResizedUrl(url, { width: 200, quality: 60 });
}

// Para imagen principal del producto
export function getMainUrl(url) {
  return getResizedUrl(url, { width: 1200, quality: 80 });
}

// Para galería general
export function getGalleryUrl(url) {
  return getResizedUrl(url, { width: 800, quality: 70 });
}
