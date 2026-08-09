export function sanitizeText(input: string) {
  return input.trim().replace(/\s+/g, " ");
}
