import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

/**
 * Generic CSS families and OS font stacks are never loaded from Google Fonts.
 * Hyphens are part of the captured name so `system-ui` is matched whole instead
 * of being truncated to `system`.
 */
const SYSTEM_FAMILIES: Record<string, true> = {
  "system-ui": true,
  "ui-monospace": true,
  "ui-sans-serif": true,
  "ui-serif": true,
  "ui-rounded": true,
  "-apple-system": true,
  blinkmacsystemfont: true,
  "segoe ui": true,
  roboto: true,
  "oxygen-sans": true,
  ubuntu: true,
  cantarell: true,
  "helvetica neue": true,
  arial: true,
  "sans-serif": true,
  serif: true,
  monospace: true,
  cursive: true,
  fantasy: true,
};

/**
 * Build a Google Fonts stylesheet URL for a `--ks-brand-font-family-*` value,
 * but only for a single, non-generic family name — stacks resolve locally and
 * through next/font.
 */
const googleFontUrl = (
  css: string,
  property: string,
): string | undefined => {
  const family = css
    .match(new RegExp(`${property}\\s*:\\s*"?([a-zA-Z0-9_, -]+)"?`))?.[1]
    ?.trim();
  if (!family || family.includes(",") || family.includes('"')) return undefined;
  if (SYSTEM_FAMILIES[family.toLowerCase()]) return undefined;
  return `https://fonts.googleapis.com/css2?${new URLSearchParams({ family })}`;
};

class KsDocument extends Document<any> {
  static async getInitialProps(ctx: DocumentContext) {
    let pageProps = null;

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => {
          pageProps = props.pageProps;
          return <App {...props} />;
        },
        enhanceComponent: (Component) => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, pageProps };
  }

  render() {
    const { pageProps } = this.props;

    // Combine theme CSS and manual token overrides for font detection
    const themeCss =
      pageProps?.story?.content.themeCss || pageProps?.settings?.themeCss || "";
    const tokenOverrides =
      pageProps?.story?.content.token || pageProps?.settings?.token || "";
    const appliedToken = [themeCss, tokenOverrides].filter(Boolean).join("\n");

    const displayFontFamilyUrl = googleFontUrl(
      appliedToken,
      "ks-brand-font-family-display",
    );
    const copyFontFamilyUrl = googleFontUrl(
      appliedToken,
      "ks-brand-font-family-copy",
    );
    const interfaceFontFamilyUrl = googleFontUrl(
      appliedToken,
      "ks-brand-font-family-interface",
    );
    const monoFontFamilyUrl = googleFontUrl(
      appliedToken,
      "ks-brand-font-family-mono",
    );

    const fontsWereApplied =
      displayFontFamilyUrl ||
      copyFontFamilyUrl ||
      interfaceFontFamilyUrl ||
      monoFontFamilyUrl;

    return (
      <Html
        className={!fontsWereApplied ? pageProps?.fontClassNames : ""}
        lang={pageProps?.language || "en"}
      >
        <Head />
        <body>
          {displayFontFamilyUrl && (
            <link href={displayFontFamilyUrl} rel="stylesheet" />
          )}
          {copyFontFamilyUrl && (
            <link href={copyFontFamilyUrl} rel="stylesheet" />
          )}
          {interfaceFontFamilyUrl && (
            <link href={interfaceFontFamilyUrl} rel="stylesheet" />
          )}
          {monoFontFamilyUrl && (
            <link href={monoFontFamilyUrl} rel="stylesheet" />
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default KsDocument;
