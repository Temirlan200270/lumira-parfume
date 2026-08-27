export function isRenderableProductImage(src: string | undefined): boolean {
  if (!src) return false
  return /^https?:\/\//i.test(src)
}
