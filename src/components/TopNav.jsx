import { Copy, Download, Eraser, PencilLine, RotateCcw } from "lucide-react";

function IconButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-secondary"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default function TopNav({
  onUndo,
  onCopy,
  onClear,
  onDownload,
  canUndo,
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-12 border-b border-surface-2 bg-surface-0">
      <div className="mx-auto flex h-full items-center justify-between gap-4 px-3">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-ink max-[767px]:text-xs max-[767px]:tracking-[0.12em]">
          <PencilLine className="text-2xl text-accent" />
          <span className="text-2xl">LiveMark</span>
        </div>

        <div className="flex items-center gap-1 max-[767px]:hidden">
          <IconButton
            icon={RotateCcw}
            label="Undo"
            onClick={onUndo}
            disabled={!canUndo}
          />
          <IconButton icon={Copy} label="Copy markdown" onClick={onCopy} />
          <IconButton icon={Eraser} label="Clear document" onClick={onClear} />
          <IconButton
            icon={Download}
            label="Download markdown"
            onClick={onDownload}
          />
        </div>
      </div>
    </header>
  );
}
