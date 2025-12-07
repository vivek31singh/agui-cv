declare module 'latex.js' {
  export class HtmlGenerator {
    constructor(options?: { hyphenate?: boolean });
  }

  export function parse(content: string, options?: { generator?: HtmlGenerator }): {
    htmlDocument: () => {
      styles: string;
      scripts: string;
      body: HTMLElement;
    };
  };
}
