import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  SquareCheckBig,
} from "lucide-react";
import {
  insertHorizontalRule,
  insertLinePrefix,
  insertMarkdownTemplate,
  wrapSelection,
} from "../../utils/editorHelpers";

function ToolbarButton({ icon: Icon, label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-surface-2" aria-hidden="true" />;
}

export default function EditorToolbar({
  content,
  onCursorChange,
  onFlashLine,
  onUpdate,
  textareaRef,
}) {
  const mutate = (handler) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    handler(textarea, content, onUpdate);
    window.requestAnimationFrame(onCursorChange);
  };

  return (
    <div className="border-b border-surface-2 bg-surface-0 px-2 py-2">
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarButton
          icon={Bold}
          label="Bold"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              wrapSelection(textarea, value, setContent, "**"),
            )
          }
        >
        </ToolbarButton>
        <ToolbarButton
          icon={Strikethrough}
          label="Strikethrough"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              wrapSelection(textarea, value, setContent, "~~"),
            )
          }
        >
        </ToolbarButton>
        <ToolbarButton
          icon={Code2}
          label="Inline code"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              wrapSelection(textarea, value, setContent, "`"),
            )
          }
        >
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          icon={Heading1}
          label="Heading 1"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertLinePrefix(textarea, value, setContent, "# ", onFlashLine),
            )
          }
        >
        </ToolbarButton>
        <ToolbarButton
          icon={Heading2}
          label="Heading 2"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertLinePrefix(textarea, value, setContent, "## ", onFlashLine),
            )
          }
        >
        </ToolbarButton>
        <ToolbarButton
          icon={Heading3}
          label="Heading 3"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertLinePrefix(
                textarea,
                value,
                setContent,
                "### ",
                onFlashLine,
              ),
            )
          }
        >
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          icon={Link2}
          label="Insert link"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertMarkdownTemplate(
                textarea,
                value,
                setContent,
                "[text](url)",
                onFlashLine,
              ),
            )
          }
        />
        <ToolbarButton
          icon={Image}
          label="Insert image"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertMarkdownTemplate(
                textarea,
                value,
                setContent,
                "![alt](url)",
                onFlashLine,
              ),
            )
          }
        />
        <ToolbarButton
          icon={Minus}
          label="Horizontal rule"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertHorizontalRule(textarea, value, setContent, onFlashLine),
            )
          }
        >
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          icon={List}
          label="Bullet list"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertLinePrefix(textarea, value, setContent, "- ", onFlashLine),
            )
          }
        >
        </ToolbarButton>
        <ToolbarButton
          icon={ListOrdered}
          label="Numbered list"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertLinePrefix(textarea, value, setContent, "1. ", onFlashLine),
            )
          }
        >
        </ToolbarButton>
        <ToolbarButton
          icon={SquareCheckBig}
          label="Task list"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertLinePrefix(
                textarea,
                value,
                setContent,
                "- [ ] ",
                onFlashLine,
              ),
            )
          }
        >
        </ToolbarButton>
        <ToolbarButton
          icon={Quote}
          label="Blockquote"
          onClick={() =>
            mutate((textarea, value, setContent) =>
              insertLinePrefix(textarea, value, setContent, "> ", onFlashLine),
            )
          }
        >
        </ToolbarButton>
      </div>
    </div>
  );
}
