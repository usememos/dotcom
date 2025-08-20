import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-fd-background/50 mt-auto">
      <div className="mx-auto max-w-fd-container px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-4">Memos</h3>
            <p className="text-sm text-fd-muted-foreground leading-relaxed">
              Open source, self-hosted note-taking platform that puts your privacy first.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/docs" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <a
                  href="https://demo.usememos.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  Live Demo
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-4">Community</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/supporters" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
                  Supporters
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/usememos/memos/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  Discussions
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/brand" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
                  Brand Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
