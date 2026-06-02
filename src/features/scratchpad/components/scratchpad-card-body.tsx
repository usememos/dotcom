"use client";

import type { ChangeEvent, KeyboardEvent, PointerEvent, RefObject } from "react";
import { CARD_TEXT_CLASS_NAME } from "../lib/card-style";

interface ScratchpadCardBodyProps {
  body: string;
  isEditing: boolean;
  textClassName: string;
  placeholderClassName: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onBlur: () => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLTextAreaElement>) => void;
}

export function ScratchpadCardBody({
  body,
  isEditing,
  textClassName,
  placeholderClassName,
  textareaRef,
  onBlur,
  onChange,
  onKeyDown,
  onPointerDown,
}: ScratchpadCardBodyProps) {
  const hasBody = body.trim().length > 0;

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={body}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        placeholder="Add a note..."
        className={`block w-full min-h-[150px] resize-none border-none bg-transparent px-0 pt-0 pb-1.5 outline-none cursor-text placeholder:text-stone-400 dark:placeholder:text-stone-500 ${textClassName} ${CARD_TEXT_CLASS_NAME}`}
      />
    );
  }

  return (
    <div
      className={`min-h-[150px] px-0 pt-0 pb-1.5 ${CARD_TEXT_CLASS_NAME} ${
        hasBody ? `whitespace-pre-wrap break-words ${textClassName}` : `select-none ${placeholderClassName}`
      }`}
    >
      {hasBody ? body : "Double-click to add a note"}
    </div>
  );
}
