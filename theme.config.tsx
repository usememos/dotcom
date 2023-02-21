import { DocsThemeConfig } from 'nextra-theme-docs';
import Footer from "./components/Footer";

const themeConfig: DocsThemeConfig = {
  project: {
    link: 'https://github.com/usememos/memos',
  },
  sidebar: {
    toggleButton: true,
  },
  darkMode: true,
  docsRepositoryBase: "https://github.com/usememos/dotcom/",
  logo: <><img className="w-6 h-auto mr-1 mt-1" src="/logo.png" alt="logo" /><strong>memos</strong></>,
  useNextSeoProps() {
    return {
      titleTemplate: "%s - memos",
    }
  },
  footer: {
    component: Footer,
  }
}

export default themeConfig;