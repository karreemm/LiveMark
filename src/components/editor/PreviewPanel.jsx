import { Eye } from "lucide-react";

export default function PreviewPanel({ html, onNavigate }) {
  const handleClick = (event) => {
    const target = event.target.closest("[data-source-line]");
    if (!target) {
      return;
    }

    const line = Number.parseInt(target.dataset.sourceLine, 10);
    if (Number.isNaN(line)) {
      return;
    }

    onNavigate(line);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-surface-0">
      <div className="flex h-9 items-center justify-between border-b border-surface-2 bg-surface-1 px-3 text-sm text-ink-secondary">
        <div className="flex items-center gap-2 font-medium text-ink">
          <Eye className="h-4 w-4 text-accent" />
          <span className="">Preview</span>
        </div>
        <div className="hidden text-xs md:block">
          Click any block to jump to its source
        </div>
      </div>

      <div className="editor-scroll min-h-0 flex-1 overflow-y-auto bg-surface-0 p-4 sm:p-6">
        <article
          className="preview-content prose max-w-none"
          onClick={handleClick}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
