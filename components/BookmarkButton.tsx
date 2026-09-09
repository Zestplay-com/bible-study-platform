"use client";

import { useEffect, useState } from "react";
import { addBookmark, BOOKMARKS_STORAGE_KEY, bookmarkId, removeBookmark, type Bookmark } from "@/lib/bookmarks";

type Props = {
  reference: string;
  text: string;
  translationId?: string;
  compact?: boolean;
};

function readBookmarks(): Bookmark[] {
  try {
    const value = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function BookmarkButton({ reference, text, translationId = "kjv", compact = false }: Props) {
  const [saved, setSaved] = useState(false);
  const bookmark = { reference, text, translationId };

  useEffect(() => {
    setSaved(readBookmarks().some((item) => bookmarkId(item.reference, item.translationId) === bookmarkId(reference, translationId)));
  }, [reference, translationId]);

  function toggle() {
    const current = readBookmarks();
    const next = saved
      ? removeBookmark(current, bookmark)
      : addBookmark(current, { ...bookmark, savedAt: Date.now() });
    try {
      window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
      setSaved(!saved);
      window.dispatchEvent(new Event("bible-bookmarks-changed"));
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }

  return (
    <button type="button" className="bookmark-button" onClick={toggle} aria-pressed={saved} title={saved ? "Remove bookmark" : "Save verse"}>
      {saved ? "Saved" : compact ? "Save" : "Save verse"}
    </button>
  );
}
