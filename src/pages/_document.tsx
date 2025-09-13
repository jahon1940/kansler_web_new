import Document, { Head, Html, Main, NextScript } from 'next/document'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

import { DEFAULT_THEME, defaultLocale } from '@/config'
import { mediaStyles } from '../config/media-styles-config'

import type { DocumentContext } from 'next/document'

interface MyDocumentProps {
  locale?: string
  theme: 'light' | 'dark'
}

const MyDocument = ({ locale, theme }: MyDocumentProps) => {
  return (
    <Html lang={locale || defaultLocale} className={theme === 'dark' ? 'dark' : ''}>
      <Head>
        <style type="text/css" dangerouslySetInnerHTML={{ __html: mediaStyles }} />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = document.cookie.match(/theme=(dark|light)/)?.[1] || ${DEFAULT_THEME};
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    })

  const initialProps = await Document.getInitialProps(ctx)
  const style = extractStyle(cache, true)

  const theme = ctx.req?.headers.cookie?.match(/theme=(dark|light)/)?.[1] || DEFAULT_THEME

  return {
    ...initialProps,
    theme,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  }
}

export default MyDocument
