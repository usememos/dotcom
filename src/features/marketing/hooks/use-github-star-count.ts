"use client";

import { useEffect, useState } from "react";
import { GITHUB_STAR_COUNT_PLACEHOLDER } from "@/shared/lib/seo";

const GITHUB_STARS_API_URL = "https://img.shields.io/github/stars/usememos/memos.json";
const GITHUB_STARS_CACHE_KEY = "memos:github-stars:v1";
const GITHUB_STARS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface GithubStarsResponse {
  message?: unknown;
  value?: unknown;
}

interface GithubStarsCacheEntry {
  count: number;
  fetchedAt: number;
}

function isValidCount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function parseCompactGithubStarCount(value: unknown): number | null {
  if (isValidCount(value)) return value;
  if (typeof value !== "string") return null;

  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*([KM]?)\+?$/i);
  if (!match) return null;

  const amount = Number(match[1]);
  const suffix = match[2]?.toUpperCase();
  const multiplier = suffix === "M" ? 1_000_000 : suffix === "K" ? 1_000 : 1;
  const count = amount * multiplier;

  return isValidCount(count) ? count : null;
}

export function formatGithubStarCount(count: number): string {
  if (count < 1_000) return Math.round(count).toString();

  const divisor = count < 1_000_000 ? 1_000 : 1_000_000;
  const suffix = count < 1_000_000 ? "K" : "M";
  const compact = Math.round((count / divisor) * 10) / 10;

  return `${compact}${suffix}`;
}

function readCachedGithubStars(): GithubStarsCacheEntry | null {
  try {
    const value = window.localStorage.getItem(GITHUB_STARS_CACHE_KEY);
    if (!value) return null;

    const parsed = JSON.parse(value) as Partial<GithubStarsCacheEntry>;
    if (!isValidCount(parsed.count) || !isValidCount(parsed.fetchedAt)) return null;

    return { count: parsed.count, fetchedAt: parsed.fetchedAt };
  } catch {
    return null;
  }
}

function writeCachedGithubStars(entry: GithubStarsCacheEntry) {
  try {
    window.localStorage.setItem(GITHUB_STARS_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function useGithubStarCount(): string {
  const [starCount, setStarCount] = useState(GITHUB_STAR_COUNT_PLACEHOLDER);

  useEffect(() => {
    const cached = readCachedGithubStars();
    if (cached) {
      setStarCount(formatGithubStarCount(cached.count));
      if (Date.now() - cached.fetchedAt < GITHUB_STARS_CACHE_TTL_MS) return;
    }

    const controller = new AbortController();

    void fetch(GITHUB_STARS_API_URL, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;

        const data = (await response.json()) as GithubStarsResponse;
        const count = parseCompactGithubStarCount(data.value ?? data.message);
        if (count === null) return;

        const entry = { count, fetchedAt: Date.now() };
        writeCachedGithubStars(entry);
        setStarCount(formatGithubStarCount(entry.count));
      })
      .catch(() => {
        // The cached value or static placeholder remains usable offline and
        // when the public star-count service cannot be reached.
      });

    return () => controller.abort();
  }, []);

  return starCount;
}
