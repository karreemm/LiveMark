import { forwardRef } from "react";
import { LayoutPanelLeft, Type } from "lucide-react";
import EditorToolbar from "./EditorToolbar";
import LineNumbers from "./LineNumbers";
import StatusBar from "./StatusBar";

const EditorPanel = forwardRef(function EditorPanel(
  {
    content,
    cursor,
    highlightedLine,
    lineCount,
    onCursorChange,
    onScroll,
    onUpdate,
    onFlashLine,
    onUndo,
    gutterRef,
    textareaRef,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className="flex h-full min-h-0 flex-col border-r border-surface-2 bg-surface-0"
    >
      <div className="flex h-9 items-center justify-between border-b border-surface-2 bg-surface-1 px-3 text-sm text-ink-secondary">
        <div className="flex items-center gap-2 font-medium text-ink">
          <LayoutPanelLeft className="h-4 w-4 text-accent" />
          <span>Editor</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-surface-2 bg-surface-0 px-2 py-0.5">
            <Type className="h-3.5 w-3.5" />
            Markdown
          </span>
        </div>
      </div>

      <EditorToolbar
        content={content}
        onCursorChange={onCursorChange}
        onFlashLine={onFlashLine}
        onUpdate={onUpdate}
        textareaRef={textareaRef}
      />

      <div className="min-h-0 flex-1 overflow-hidden bg-editor-bg">
        <div className="editor-scroll flex h-full overflow-hidden">
          <LineNumbers
            gutterRef={gutterRef}
            highlightedLine={highlightedLine}
            lineCount={lineCount}
          />

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => onUpdate(event.target.value)}
            onKeyDown={(event) => {
              if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "z" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                onUndo();
              }
            }}
            onScroll={onScroll}
            onKeyUp={onCursorChange}
            onMouseUp={onCursorChange}
            onSelect={onCursorChange}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            wrap="off"
            className="editor-scroll min-h-0 flex-1 resize-none border-none bg-editor-bg px-0 py-0 pl-3 pr-4 font-editor text-sm leading-[1.6rem] text-ink outline-none"
          />
        </div>
      </div>

      <StatusBar cursor={cursor} content={content} />
    </div>
  );
});

export default EditorPanel;
