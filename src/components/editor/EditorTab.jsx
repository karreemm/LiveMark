import { useEffect, useRef, useState } from "react";
import { useMarkdown } from "../../hooks/useMarkdown";
import { useEditorSync } from "../../hooks/useEditorSync";
import EditorPanel from "./EditorPanel";
import PreviewPanel from "./PreviewPanel";

export default function EditorTab({ content, setContent, onUndo }) {
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth >= 768,
  );
  const [mobileView, setMobileView] = useState("edit");
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const html = useMarkdown(content);

  const {
    cursor,
    highlightedLine,
    flashLine,
    navigateToLine,
    readCursor,
    syncGutterScroll,
    lineCount,
  } = useEditorSync({ content, textareaRef, gutterRef });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = (event) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setMobileView("edit");
    }
  }, [isDesktop]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (!dragging || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const nextSplit = ((event.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.max(25, Math.min(75, nextSplit)));
    };

    const onPointerUp = () => {
      if (!dragging) {
        return;
      }

      setDragging(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging]);

  const handleDragStart = (event) => {
    event.preventDefault();
    setDragging(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const desktopLayout = (
    <div
      ref={containerRef}
      className="grid h-full min-h-0 overflow-hidden"
      style={{ gridTemplateColumns: `${split}fr 4px ${100 - split}fr` }}
    >
      <EditorPanel
        content={content}
        cursor={cursor}
        dragging={dragging}
        highlightedLine={highlightedLine}
        lineCount={lineCount}
        onCursorChange={readCursor}
        onScroll={syncGutterScroll}
        onUpdate={setContent}
        onFlashLine={flashLine}
        onUndo={onUndo}
        gutterRef={gutterRef}
        textareaRef={textareaRef}
      />

      <button
        type="button"
        aria-label="Resize panels"
        aria-orientation="vertical"
        role="separator"
        onPointerDown={handleDragStart}
        className={`drag-handle h-full w-1 transition-colors ${dragging ? "dragging" : "bg-surface-2 hover:bg-accent"}`}
      />

      <PreviewPanel html={html} onNavigate={navigateToLine} />
    </div>
  );

  const mobileLayout = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex gap-2 border-b border-surface-2 bg-surface-1 px-4 py-2">
        <button
          type="button"
          onClick={() => setMobileView("edit")}
          aria-label="Edit"
          className={`inline-flex items-center justify-center px-4 py-2 rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:h-auto md:w-auto md:px-4 md:py-2 ${mobileView === "edit" ? "bg-accent-light text-accent" : "bg-surface-0 text-ink-secondary hover:bg-surface-2 hover:text-ink"}`}
        >
          <span className="">✏ Edit</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          aria-label="Preview"
          className={`inline-flex items-center justify-center px-4 py-2 rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:h-auto md:w-auto md:px-4 md:py-2 ${mobileView === "preview" ? "bg-accent-light text-accent" : "bg-surface-0 text-ink-secondary hover:bg-surface-2 hover:text-ink"}`}
        >
          <span className="">👁 Preview</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {mobileView === "edit" ? (
          <EditorPanel
            content={content}
            cursor={cursor}
            dragging={dragging}
            highlightedLine={highlightedLine}
            lineCount={lineCount}
            onCursorChange={readCursor}
            onScroll={syncGutterScroll}
            onUpdate={setContent}
            onFlashLine={flashLine}
            onUndo={onUndo}
            gutterRef={gutterRef}
            textareaRef={textareaRef}
          />
        ) : (
          <PreviewPanel html={html} onNavigate={navigateToLine} />
        )}
      </div>
    </div>
  );

  return (
    <section className="h-[calc(100dvh-3rem)] min-h-0 overflow-hidden bg-surface-0">
      {isDesktop ? desktopLayout : mobileLayout}
    </section>
  );
}
