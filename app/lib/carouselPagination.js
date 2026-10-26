export function getVisiblePhotoIndexes(total, active) {
  if (total <= 0) return [];
  const count = Math.min(3, total);
  const start = Math.max(0, Math.min(active, total - count));
  return Array.from({ length: count }, (_, offset) => start + offset);
}
