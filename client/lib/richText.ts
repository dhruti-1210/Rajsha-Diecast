import DOMPurify, { addHook, removeHook } from 'isomorphic-dompurify';
import type { Config, UponSanitizeAttributeHookEvent } from 'dompurify';

const richTextOptions: Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
    'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'pre', 'code', 'table', 'thead', 'tbody', 'tfoot',
    'tr', 'th', 'td', 'img', 'iframe',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'style', 'src', 'alt', 'width', 'height',
    'colspan', 'rowspan', 'scope', 'allow', 'allowfullscreen', 'frameborder',
    'loading', 'referrerpolicy',
  ],
};

const safeColor = /^color:\s*(?:#[\da-f]{3,8}|[a-z]{3,20}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\))\s*;?$/i;
const safeEmbedSrc = /^https:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com\/embed\/|player\.vimeo\.com\/video\/)[a-z\d_-]+(?:[/?#?][^\s]*)?$/i;

function uponSanitizeAttribute(node: Element, data: UponSanitizeAttributeHookEvent): void {
  if (data.attrName === 'style' && !safeColor.test(data.attrValue)) {
    data.keepAttr = false;
  }
  if (
    node.nodeName === 'IFRAME' &&
    data.attrName === 'src' &&
    !safeEmbedSrc.test(data.attrValue)
  ) {
    data.keepAttr = false;
  }
}

export function sanitizeRichText(html: string): string {
  addHook('uponSanitizeAttribute', uponSanitizeAttribute);
  try {
    return DOMPurify.sanitize(html, richTextOptions);
  } finally {
    removeHook('uponSanitizeAttribute', uponSanitizeAttribute);
  }
}

export function richTextToPlainText(html: string): string {
  const withLineBreaks = html
    .replace(/<br\b[^>]*>/gi, '\n')
    .replace(/<\/(?:p|div|li|h[1-6]|tr|blockquote|pre)>/gi, '\n');
  return DOMPurify.sanitize(withLineBreaks, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\n[ \t]*\n+/g, '\n')
    .trim();
}
