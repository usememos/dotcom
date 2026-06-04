type JsonLdValue = Record<string, unknown> | readonly Record<string, unknown>[];

interface JsonLdScriptProps {
  data: JsonLdValue;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
