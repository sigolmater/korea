/**
 * Simple markdown parser for chat messages
 * Supports: bold, italic, code blocks, inline code, links, lists
 */

export function parseMarkdown(text: string): string {
  if (!text) return '';

  let html = text;

  // Escape HTML to prevent XSS
  html = html.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');

  // Code blocks (```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || 'plaintext';
    return `<pre class="bg-gray-900 rounded-lg p-4 my-3 overflow-x-auto"><code class="language-${language} text-sm text-gray-300">${code.trim()}</code></pre>`;
  });

  // Inline code (`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-cyan-400 px-2 py-1 rounded text-sm">$1</code>');

  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

  // Italic (*text*)
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">$1</a>');

  // Headers (# ## ###)
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-100 mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-100 mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-100 mt-4 mb-2">$1</h1>');

  // Unordered lists (-)
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
  html = html.replace(/(<li class="ml-4">[\s\S]*?<\/li>)/g, '<ul class="my-2 space-y-1">$1</ul>');

  // Ordered lists (1. 2. 3.)
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n/g, '<br/>');

  return html;
}

/**
 * Strip markdown formatting to plain text
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';

  return text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^#{1,6}\s+(.+)$/gm, '$1') // Remove headers
    .replace(/^[-*]\s+/gm, '') // Remove list markers
    .replace(/^\d+\.\s+/gm, '') // Remove numbered lists
    .trim();
}

/**
 * Detect if text contains code blocks
 */
export function hasCodeBlocks(text: string): boolean {
  return /```[\s\S]*?```/.test(text);
}

/**
 * Extract code blocks from markdown
 */
export function extractCodeBlocks(text: string): Array<{ language: string; code: string }> {
  const blocks: Array<{ language: string; code: string }> = [];
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'plaintext',
      code: match[2].trim(),
    });
  }

  return blocks;
}
