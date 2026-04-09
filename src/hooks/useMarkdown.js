import { useMemo } from "react";
import { renderMarkdown } from "../utils/markdownParser";

export function useMarkdown(markdown) {
  return useMemo(() => renderMarkdown(markdown), [markdown]);
}
