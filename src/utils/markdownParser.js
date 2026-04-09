import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import footnote from "markdown-it-footnote";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import xml from "highlight.js/lib/languages/xml";
import markdown from "highlight.js/lib/languages/markdown";
import { withSourceLineAttributes } from "./lineAnnotator";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("markdown", markdown);

function createMarkdownIt() {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true,
    typographer: true,
    highlight(code, language) {
      if (language && hljs.getLanguage(language)) {
        const highlighted = hljs.highlight(code, {
          language,
          ignoreIllegals: true,
        }).value;
        return `<pre class="hljs"><code class="language-${language}">${highlighted}</code></pre>`;
      }

      const highlighted = hljs.highlightAuto(code, [
        "javascript",
        "json",
        "bash",
        "xml",
        "markdown",
      ]).value;
      return `<pre class="hljs"><code>${highlighted}</code></pre>`;
    },
  });

  md.use(footnote);

  withSourceLineAttributes(md.renderer, [
    "heading_open",
    "paragraph_open",
    "blockquote_open",
    "bullet_list_open",
    "ordered_list_open",
    "list_item_open",
    "table_open",
    "thead_open",
    "tbody_open",
    "tr_open",
    "th_open",
    "td_open",
    "hr",
  ]);

  const fenceRenderer = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const rendered = fenceRenderer
      ? fenceRenderer(tokens, index, options, env, self)
      : self.renderToken(tokens, index, options, env, self);
    if (!token || !token.map) {
      return rendered;
    }

    return rendered.replace(
      /^<pre(\s|>)/i,
      `<pre data-source-line="${token.map[0] + 1}"$1`,
    );
  };

  const hrRenderer = md.renderer.rules.hr;
  md.renderer.rules.hr = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const rendered = hrRenderer
      ? hrRenderer(tokens, index, options, env, self)
      : self.renderToken(tokens, index, options, env, self);
    if (!token || !token.map) {
      return rendered;
    }

    return rendered.replace(
      /^<hr(\s|>)/i,
      `<hr data-source-line="${token.map[0] + 1}"$1`,
    );
  };

  return md;
}

const markdownIt = createMarkdownIt();

export function renderMarkdown(markdown) {
  const html = markdownIt.render(markdown || "");
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["data-source-line"],
  });
}
