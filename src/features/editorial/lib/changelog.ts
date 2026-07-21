export const CHANGELOG_COLUMN_CLASS = "mx-auto max-w-[48rem]";
export const CHANGELOG_ARTICLE_COLUMN_CLASS = "mx-auto min-w-0 max-w-[46rem] sm:max-w-[48rem]";
export const CHANGELOG_DETAIL_LAYOUT_CLASS = "mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12";

export function getChangelogVersion(title: string) {
  return title.replace(/^Release\s+/i, "");
}

export function getChangelogVersionParts(title: string) {
  const match = getChangelogVersion(title).match(/v?(\d+)\.(\d+)\.(\d+)/);
  return match ? [Number.parseInt(match[1], 10), Number.parseInt(match[2], 10), Number.parseInt(match[3], 10)] : [0, 0, 0];
}

function getChangelogPrereleaseParts(title: string) {
  const match = getChangelogVersion(title).match(/v?\d+\.\d+\.\d+-([0-9A-Za-z.-]+)/);
  return match?.[1].split(".");
}

export function compareChangelogVersions(a: string, b: string) {
  const versionA = getChangelogVersionParts(a);
  const versionB = getChangelogVersionParts(b);

  for (let index = 0; index < 3; index += 1) {
    if (versionA[index] !== versionB[index]) {
      return versionB[index] - versionA[index];
    }
  }

  const prereleaseA = getChangelogPrereleaseParts(a);
  const prereleaseB = getChangelogPrereleaseParts(b);

  if (!prereleaseA || !prereleaseB) {
    if (!prereleaseA && prereleaseB) return -1;
    if (prereleaseA && !prereleaseB) return 1;
    return 0;
  }

  const identifierCount = Math.max(prereleaseA.length, prereleaseB.length);

  for (let index = 0; index < identifierCount; index += 1) {
    const identifierA = prereleaseA[index];
    const identifierB = prereleaseB[index];

    if (identifierA === identifierB) continue;
    if (identifierA === undefined) return 1;
    if (identifierB === undefined) return -1;

    const numericA = /^\d+$/.test(identifierA);
    const numericB = /^\d+$/.test(identifierB);

    if (numericA && numericB) {
      return Number.parseInt(identifierB, 10) - Number.parseInt(identifierA, 10);
    }

    if (numericA !== numericB) {
      return numericA ? 1 : -1;
    }

    return identifierB.localeCompare(identifierA);
  }

  return 0;
}

export function formatChangelogDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getChangelogDescription(version: string, description?: string) {
  return description || `Release notes for ${version}.`;
}

export function sortChangelogPages<T extends { data: { title: string } }>(pages: T[]) {
  return [...pages].sort((a, b) => compareChangelogVersions(a.data.title, b.data.title));
}
