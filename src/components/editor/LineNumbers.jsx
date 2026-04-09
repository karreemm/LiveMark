export default function LineNumbers({ gutterRef, highlightedLine, lineCount }) {
  return (
    <div
      ref={gutterRef}
      className="editor-scroll min-w-[3rem] overflow-y-auto border-r border-surface-2 bg-editor-gutter py-0.5 text-right text-xs text-ink-muted select-none"
    >
      {Array.from({ length: lineCount }, (_, index) => {
        const lineNumber = index + 1;
        return (
          <div
            key={lineNumber}
            className={`px-3 leading-[1.6rem] ${highlightedLine === lineNumber ? "line-highlight text-accent" : ""}`}
            style={{ height: "1.6rem" }}
          >
            {lineNumber}
          </div>
        );
      })}
    </div>
  );
}
