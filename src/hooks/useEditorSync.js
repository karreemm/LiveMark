import { useEffect, useMemo, useRef, useState } from "react";

const LINE_HEIGHT = 26;

function getCursorPosition(value, selectionStart) {
  const beforeCursor = value.slice(0, selectionStart);
  const lines = beforeCursor.split("\n");
  return {
    line: lines.length,
    col: lines[lines.length - 1].length + 1,
  };
}

export function useEditorSync({ content, gutterRef, textareaRef }) {
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [flashedLine, setFlashedLine] = useState(null);
  const [trackedLine, setTrackedLine] = useState(null);
  const highlightTimer = useRef(null);

  const lines = useMemo(() => content.split("\n"), [content]);

  useEffect(
    () => () => {
      if (highlightTimer.current) {
        window.clearTimeout(highlightTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!trackedLine) {
      return;
    }

    const currentLineText = lines[trackedLine.line - 1];
    if (currentLineText !== trackedLine.text) {
      setTrackedLine(null);
    }
  }, [lines, trackedLine]);

  const readCursor = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    setCursor(getCursorPosition(textarea.value, textarea.selectionStart));
  };

  const syncGutterScroll = () => {
    const textarea = textareaRef.current;
    const gutter = gutterRef.current;
    if (!textarea || !gutter) {
      return;
    }

    gutter.scrollTop = textarea.scrollTop;
  };

  const flashLine = (lineNumber) => {
    setFlashedLine(lineNumber);
    if (highlightTimer.current) {
      window.clearTimeout(highlightTimer.current);
    }

    highlightTimer.current = window.setTimeout(() => {
      setFlashedLine(null);
    }, 600);
  };

  const navigateToLine = (lineNumber) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const safeLine = Math.max(1, Math.min(lineNumber, lines.length));
    const charIndex =
      lines.slice(0, safeLine - 1).join("\n").length + (safeLine > 1 ? 1 : 0);

    setTrackedLine({ line: safeLine, text: lines[safeLine - 1] ?? "" });
    if (highlightTimer.current) {
      window.clearTimeout(highlightTimer.current);
      setFlashedLine(null);
    }

    textarea.focus();
    textarea.setSelectionRange(charIndex, charIndex);
    textarea.scrollTop = (safeLine - 1) * LINE_HEIGHT;
    syncGutterScroll();
    setCursor(getCursorPosition(textarea.value, charIndex));
    flashLine(safeLine);
  };

  return {
    cursor,
    highlightedLine: trackedLine?.line ?? flashedLine,
    flashLine,
    navigateToLine,
    readCursor,
    syncGutterScroll,
    lineCount: Math.max(1, lines.length),
  };
}
