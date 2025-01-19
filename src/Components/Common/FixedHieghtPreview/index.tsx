"use client";

import DOMPurify from "dompurify";

interface PreviewProps {
  value: string;
}

export const FixedLengthPreview = ({ value }: PreviewProps) => {
  const sanitizedValue = DOMPurify.sanitize(value);

  return (
    <div
      className="line-clamp-4 text-slate-600 overflow-hidden"
      dangerouslySetInnerHTML={{ __html: sanitizedValue }}
    />
  );
};
