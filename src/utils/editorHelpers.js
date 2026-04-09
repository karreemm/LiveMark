export const DEFAULT_SAMPLE_MARKDOWN = `# Welcome to LiveMark

LiveMark is a fast and clean Markdown editor that updates your preview in real time.

## Features

- Real-time Markdown preview
- Editor toolbar for quick formatting
- Click from preview to jump to matching source

## Made by Kareem Abdel Nabi

Portfolio: [https://kareem-abdelnabi.vercel.app/](https://kareem-abdelnabi.vercel.app/)

---

Start editing on the left to see your changes live.`;

function restoreSelection(textarea, start, end) {
  window.requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(start, end);
  });
}

function getLineStart(value, index) {
  const previousBreak = value.lastIndexOf("\n", index - 1);
  return previousBreak === -1 ? 0 : previousBreak + 1;
}

function getLineEnd(value, index) {
  const nextBreak = value.indexOf("\n", index);
  return nextBreak === -1 ? value.length : nextBreak;
}

function getSelectedLines(value, start, end) {
  const selectionStart = getLineStart(value, start);
  const selectionEnd =
    end > start ? getLineEnd(value, end) : getLineEnd(value, start);
  return { selectionStart, selectionEnd };
}

export function wrapSelection(
  textarea,
  content,
  setContent,
  before,
  after = before,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.slice(start, end) || "text";
  const nextValue = `${content.slice(0, start)}${before}${selected}${after}${content.slice(end)}`;
  const nextStart = start + before.length;
  const nextEnd = nextStart + selected.length;

  setContent(nextValue);
  restoreSelection(textarea, nextStart, nextEnd);
}

export function insertMarkdownTemplate(
  textarea,
  content,
  setContent,
  template,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.slice(start, end);
  const replacement = selected || template;
  const nextValue = `${content.slice(0, start)}${replacement}${content.slice(end)}`;
  const nextSelectionStart = start;
  const nextSelectionEnd = start + replacement.length;

  setContent(nextValue);
  restoreSelection(textarea, nextSelectionStart, nextSelectionEnd);
}

export function insertHorizontalRule(
  textarea,
  content,
  setContent,
  onFlashLine,
) {
  const start = textarea.selectionStart;
  const insertText = content.length ? "\n\n---\n\n" : "---\n";
  const nextValue = `${content.slice(0, start)}${insertText}${content.slice(textarea.selectionEnd)}`;
  const nextCursor = start + insertText.length;

  setContent(nextValue);
  restoreSelection(textarea, nextCursor, nextCursor);
  if (onFlashLine) {
    onFlashLine(content.slice(0, start).split("\n").length);
  }
}

export function insertLinePrefix(
  textarea,
  content,
  setContent,
  prefix,
  onFlashLine,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const hasSelection = start !== end;
  const lines = content.split("\n");

  if (!hasSelection) {
    const lineStart = getLineStart(content, start);
    const lineEnd = getLineEnd(content, start);
    const currentLine = content.slice(lineStart, lineEnd);
    const nextLine = `${prefix}${currentLine}`;
    const nextValue = `${content.slice(0, lineStart)}${nextLine}${content.slice(lineEnd)}`;
    const nextCursor = lineStart + prefix.length;

    setContent(nextValue);
    restoreSelection(textarea, nextCursor, nextCursor);
    if (onFlashLine) {
      onFlashLine(
        currentLine ? content.slice(0, lineStart).split("\n").length : 1,
      );
    }
    return;
  }

  const { selectionStart, selectionEnd } = getSelectedLines(
    content,
    start,
    end,
  );
  const block = content.slice(selectionStart, selectionEnd);
  const transformed = block
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
  const nextValue = `${content.slice(0, selectionStart)}${transformed}${content.slice(selectionEnd)}`;
  const nextStart = selectionStart + prefix.length;
  const nextEnd = nextStart + transformed.length;

  setContent(nextValue);
  restoreSelection(textarea, nextStart, nextEnd);
  if (onFlashLine) {
    onFlashLine(
      lines.slice(0, content.slice(0, selectionStart).split("\n").length)
        .length || 1,
    );
  }
}

export function downloadMarkdown(content) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "document.md";
  anchor.click();
  URL.revokeObjectURL(url);
}
