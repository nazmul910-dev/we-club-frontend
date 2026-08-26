export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  return match ? match[1] : null;
}

export function youTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export function youTubeEmbed(id: string): string {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}