/**
 * Resolves uploaded media URLs properly across both local dev,
 * single-host deployments, and multi-host deployments (e.g. Vercel + Render).
 */
export const getUploadUrl = (filePathOrFilename) => {
  if (!filePathOrFilename) return '';
  const filename = filePathOrFilename.split('\\').pop().split('/').pop();
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  if (apiBase && (apiBase.startsWith('http://') || apiBase.startsWith('https://'))) {
    // Strip trailing /api or trailing slash to get origin
    const backendOrigin = apiBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
    return `${backendOrigin}/uploads/${filename}`;
  }

  return `/uploads/${filename}`;
};
