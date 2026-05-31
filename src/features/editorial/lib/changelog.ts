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

export function compareChangelogVersions(a: string, b: string) {
  const versionA = getChangelogVersionParts(a);
  const versionB = getChangelogVersionParts(b);

  for (let index = 0; index < 3; index += 1) {
    if (versionA[index] !== versionB[index]) {
      return versionB[index] - versionA[index];
    }
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
