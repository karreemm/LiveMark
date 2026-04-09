import { useEffect, useRef, useState } from "react";
import TopNav from "./components/TopNav";
import EditorTab from "./components/editor/EditorTab";
import {
  DEFAULT_SAMPLE_MARKDOWN,
  downloadMarkdown,
} from "./utils/editorHelpers";

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-full border border-surface-2 bg-surface-0 px-4 py-2 text-sm text-ink shadow-lg transition-all duration-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export default function App() {
  const [content, setContentState] = useState(DEFAULT_SAMPLE_MARKDOWN);
  const [undoCount, setUndoCount] = useState(0);
  const [toast, setToast] = useState({ message: "", visible: false, id: 0 });
  const historyRef = useRef([]);
  const toastTimers = useRef([]);

  useEffect(
    () => () => {
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const setContent = (nextContent) => {
    setContentState((currentContent) => {
      if (nextContent === currentContent) {
        return currentContent;
      }

      historyRef.current.push(currentContent);
      setUndoCount((count) => count + 1);
      return nextContent;
    });
  };

  const showToast = (message) => {
    toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    toastTimers.current = [];
    const toastId = window.setTimeout(() => {
      setToast((current) =>
        current.id === toastId ? { ...current, visible: false } : current,
      );
    }, 1700);
    const removeId = window.setTimeout(() => {
      setToast((current) =>
        current.id === toastId
          ? { message: "", visible: false, id: 0 }
          : current,
      );
    }, 2000);
    toastTimers.current.push(toastId, removeId);
    setToast({ message, visible: true, id: toastId });
  };

  const handleUndo = () => {
    const previousContent = historyRef.current.pop();

    if (previousContent === undefined) {
      showToast("Nothing to undo");
      return;
    }

    setUndoCount((count) => Math.max(0, count - 1));
    setContentState(previousContent);
    showToast("Undo applied");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      showToast("Markdown copied");
    } catch {
      showToast("Copy failed");
    }
  };

  const handleClear = () => {
    setContent("");
    showToast("Document cleared");
  };

  const handleDownload = () => {
    downloadMarkdown(content);
    showToast("Download started");
  };

  return (
    <div className="min-h-screen bg-surface-0 text-ink">
      <TopNav
        onUndo={handleUndo}
        onCopy={handleCopy}
        onClear={handleClear}
        onDownload={handleDownload}
        canUndo={undoCount > 0}
      />

      <main className="pt-12">
        <EditorTab
          content={content}
          setContent={setContent}
          onUndo={handleUndo}
        />
      </main>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
