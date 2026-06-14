"use client";

import { CheckIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { MemosConnectionForm } from "@/features/memos/components/memos-connection-form";
import type { SafeMemosSettings } from "@/shared/settings/memos-settings";

const primaryButtonClassName =
  "inline-flex h-9 items-center rounded-md bg-teal-600 px-4 text-sm font-medium text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400";

const linkButtonClassName =
  "text-sm font-medium text-stone-500 transition hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200";

type StepKey = "intro" | "setup" | "done";

// The guide is data-driven so future onboarding steps can be slotted in here
// without touching the stepper UI.
const STEPS: { key: StepKey; title: string }[] = [
  { key: "intro", title: "Introduction" },
  { key: "setup", title: "Set up instance" },
  { key: "done", title: "Done" },
];

type ConnectOnboardingProps = {
  /** Connection settings from the dashboard's useMemosConnection hook; null until loaded. */
  settings: SafeMemosSettings | null;
  /** Called when the user finishes the congrats step and enters the live dashboard. */
  onComplete: () => void;
  /** When provided, the intro step offers a "Maybe later" escape (setup is optional). */
  onCancel?: () => void;
};

function Stepper({ activeIndex }: { activeIndex: number }) {
  return (
    <ol className="mb-8 flex items-center">
      {STEPS.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;
        const isLast = index === STEPS.length - 1;
        return (
          <li key={step.key} className="flex flex-1 items-center last:flex-none" aria-current={isActive ? "step" : undefined}>
            <div className="flex items-center gap-2">
              <span
                className={
                  isComplete
                    ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white dark:bg-teal-500 dark:text-stone-950"
                    : isActive
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-teal-600 text-sm font-semibold text-teal-700 dark:border-teal-400 dark:text-teal-300"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-stone-300 text-sm font-semibold text-stone-400 dark:border-stone-700 dark:text-stone-500"
                }
              >
                {isComplete ? <CheckIcon className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={
                  isActive
                    ? "text-sm font-medium text-stone-900 dark:text-stone-100"
                    : "text-sm font-medium text-stone-400 dark:text-stone-500"
                }
              >
                {step.title}
              </span>
            </div>
            {!isLast ? (
              <div
                className={
                  isComplete ? "mx-3 h-px flex-1 bg-teal-500/70 dark:bg-teal-400/60" : "mx-3 h-px flex-1 bg-stone-200 dark:bg-stone-700"
                }
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Panel({ activeIndex, children }: { activeIndex: number; children: ReactNode }) {
  return (
    <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-900">
      <Stepper activeIndex={activeIndex} />
      {children}
    </div>
  );
}

export function ConnectOnboarding({ settings, onComplete, onCancel }: ConnectOnboardingProps) {
  const [step, setStep] = useState<StepKey>("intro");
  const [saved, setSaved] = useState(false);
  // Local override seeded from the saved response so the form reflects the new
  // token state without triggering the dashboard's stats reload.
  const [savedSettings, setSavedSettings] = useState<SafeMemosSettings | null>(null);

  const activeIndex = step === "intro" ? 0 : step === "setup" ? 1 : 2;

  if (step === "intro") {
    return (
      <Panel activeIndex={activeIndex}>
        <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Welcome to your dashboard</h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Your dashboard turns your Memos into an activity heatmap and writing stats. Connect a self-hosted instance to bring it to life —
          more insights are on the way.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <button type="button" className={primaryButtonClassName} onClick={() => setStep("setup")}>
            Get started
          </button>
          {onCancel ? (
            <button type="button" className={linkButtonClassName} onClick={onCancel}>
              Maybe later
            </button>
          ) : null}
        </div>
      </Panel>
    );
  }

  if (step === "setup") {
    if (saved) {
      return (
        <Panel activeIndex={activeIndex}>
          <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Connection saved</h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Your Memos instance is connected. Continue to finish setup.</p>
          <button type="button" className={`${primaryButtonClassName} mt-6`} onClick={() => setStep("done")}>
            Continue
          </button>
        </Panel>
      );
    }
    return (
      <Panel activeIndex={activeIndex}>
        <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Connect your Memos instance</h1>
        <p className="mt-1 mb-4 text-sm text-stone-500 dark:text-stone-400">
          Enter your instance URL and an access token. Your token is stored server-side and never sent to the browser.
        </p>
        <MemosConnectionForm settings={savedSettings ?? settings} onSettingsChange={setSavedSettings} onSaved={() => setSaved(true)} />
        <button type="button" className={`${linkButtonClassName} mt-4`} onClick={() => setStep("intro")}>
          Back
        </button>
      </Panel>
    );
  }

  return (
    <Panel activeIndex={activeIndex}>
      <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">You're all set 🎉</h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        Your Memos instance is connected. Head to your dashboard to see your activity heatmap and stats.
      </p>
      <button type="button" className={`${primaryButtonClassName} mt-6`} onClick={onComplete}>
        Go to dashboard
      </button>
    </Panel>
  );
}
