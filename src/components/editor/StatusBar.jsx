function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function countWords(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function StatusBar({ cursor, content }) {
  return (
    <div className="flex h-auto flex-col gap-1 border-t border-surface-2 bg-surface-1 px-3 py-1 text-xs text-ink-muted sm:h-6 sm:flex-row sm:items-center sm:justify-between sm:py-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Line {formatNumber(cursor.line)}, Col {formatNumber(cursor.col)}
        </span>
        <span className="hidden sm:inline">|</span>
        <span>Word count: {formatNumber(countWords(content))}</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">
          Characters: {formatNumber(content.length)}
        </span>
      </div>
    </div>
  );
}
