const DATA_ATTRIBUTE = "data-source-line";

function injectLineAttribute(html, line) {
  if (!html || line == null) {
    return html;
  }

  return html.replace(
    /^<([a-z0-9-]+)(\s|>)/i,
    `<$1 ${DATA_ATTRIBUTE}="${line}"$2`,
  );
}

export function withSourceLineAttributes(renderer, tokenNames) {
  tokenNames.forEach((tokenName) => {
    const previousRule = renderer.rules[tokenName];
    renderer.rules[tokenName] = (...args) => {
      const [tokens, index, options, env, self] = args;
      const token = tokens[index];
      const rendered = previousRule
        ? previousRule(...args)
        : self.renderToken(tokens, index, options, env, self);
      if (!token || !token.map) {
        return rendered;
      }

      return injectLineAttribute(rendered, token.map[0] + 1);
    };
  });
}
