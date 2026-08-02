import type { InstanceErrorDetail } from "@/shared/memos/errors";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";

/** Renders a classified instance error with its remediation steps. */
export function InstanceErrorNotice({ detail }: { detail: InstanceErrorDetail }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{detail.title}</AlertTitle>
      <AlertDescription>
        <p>{detail.why}</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {detail.howToFix.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
