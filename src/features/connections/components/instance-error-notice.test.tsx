import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { describeInstanceError } from "@/shared/memos/errors";
import { InstanceErrorNotice } from "./instance-error-notice";

describe("InstanceErrorNotice", () => {
  it("renders title, why, and each how-to-fix step", () => {
    const detail = describeInstanceError("cors", { origin: "https://www.usememos.com" });
    render(<InstanceErrorNotice detail={detail} />);
    expect(screen.getByText(detail.title)).toBeInTheDocument();
    expect(screen.getByText(detail.why)).toBeInTheDocument();
    for (const step of detail.howToFix) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
  });
});
