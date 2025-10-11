/**
 * Parse and extract embed URLs from various inputs (iframe codes or direct URLs)
 * Supports Hearthis.at, YouTube, and Mixcloud platforms
 */

export const parseEmbedUrl = (
  input: string,
  platform: 'hearthis' | 'youtube' | 'mixcloud'
): string | null => {
  const trimmedInput = input.trim();

  // First, check if input is an iframe and extract the src
  if (trimmedInput.includes('<iframe')) {
    const srcMatch = trimmedInput.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
    return null;
  }

  // Platform-specific URL handling
  switch (platform) {
    case 'hearthis':
      // Direct embed URL: https://app.hearthis.at/embed/12807924/...
      if (trimmedInput.includes('app.hearthis.at/embed/')) {
        return trimmedInput.split('?')[0]; // Remove query params for consistency
      }
      // Public page URL: https://hearthis.at/username/track-name/
      const hearthisPublicMatch = trimmedInput.match(/hearthis\.at\/([^\/]+)\/([^\/\?]+)/);
      if (hearthisPublicMatch) {
        // Note: We can't extract the track ID from the public URL without API access
        // So we return null and ask user to provide the embed URL or iframe
        return null;
      }
      return null;

    case 'youtube':
      // Direct embed URL
      if (trimmedInput.includes('youtube.com/embed/')) {
        return trimmedInput.split('?')[0];
      }
      // Public URLs: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
      const youtubePublicMatch = trimmedInput.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
      );
      if (youtubePublicMatch && youtubePublicMatch[1]) {
        return `https://www.youtube.com/embed/${youtubePublicMatch[1]}`;
      }
      return null;

    case 'mixcloud':
      // Direct widget URL
      if (trimmedInput.includes('mixcloud.com/widget/iframe')) {
        return trimmedInput.split('&')[0]; // Keep basic URL
      }
      // Public URL: mixcloud.com/artist/mix-name/
      const mixcloudPublicMatch = trimmedInput.match(/mixcloud\.com\/([^\/]+\/[^\/\?]+)/);
      if (mixcloudPublicMatch && mixcloudPublicMatch[1]) {
        return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2F${encodeURIComponent(mixcloudPublicMatch[1])}%2F`;
      }
      return null;

    default:
      return null;
  }
};

/**
 * Validate if the embed URL is valid for the given platform
 */
export const isValidEmbedUrl = (url: string, platform: 'hearthis' | 'youtube' | 'mixcloud'): boolean => {
  switch (platform) {
    case 'hearthis':
      return url.includes('app.hearthis.at/embed/');
    case 'youtube':
      return url.includes('youtube.com/embed/');
    case 'mixcloud':
      return url.includes('mixcloud.com/widget/iframe');
    default:
      return false;
  }
};
