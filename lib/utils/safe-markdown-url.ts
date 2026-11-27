const MAX_MARKDOWN_URL_LENGTH = 2048;

const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const SAFE_IMAGE_PROTOCOLS = new Set(["http:", "https:"]);

export type MarkdownUrlKind = "link" | "image";

/**
 * Returns a Markdown destination only when it cannot execute code or escape
 * through a protocol-relative URL. Relative paths are intentionally limited
 * to same-origin paths and anchors.
 */
export function getSafeMarkdownUrl(value: string, kind: MarkdownUrlKind): string | null {
  const candidate = value.trim();

  if (
    !candidate ||
    candidate.length > MAX_MARKDOWN_URL_LENGTH ||
    /[\u0000-\u001f\u007f]/.test(candidate) ||
    candidate.startsWith("//")
  ) {
    return null;
  }

  const isSameOriginPath = candidate.startsWith("/") || candidate.startsWith("#");
  if (isSameOriginPath) {
    return kind === "link" || candidate.startsWith("/") ? candidate : null;
  }

  try {
    const parsed = new URL(candidate);
    const allowedProtocols = kind === "image" ? SAFE_IMAGE_PROTOCOLS : SAFE_LINK_PROTOCOLS;
    return allowedProtocols.has(parsed.protocol.toLowerCase()) ? candidate : null;
  } catch {
    return null;
  }
}
