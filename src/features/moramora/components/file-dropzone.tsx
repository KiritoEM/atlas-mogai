"use client";

import { useId, useState, type ComponentType, type DragEvent } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  accept: string;
  label: string;
  hint: string;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  disabled?: boolean;
  onFile: (file: File) => void;
};

/**
 * A real file input behind a large label: keyboard, screen reader and touch
 * users get the native picker; mouse users can also drop a file.
 */
export function FileDropzone({
  accept,
  label,
  hint,
  icon: Icon = Upload,
  disabled,
  onFile,
}: FileDropzoneProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && !disabled) {
      onFile(file);
    }
  }

  return (
    <div>
      <input
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        aria-describedby={`${id}-hint`}
        className="peer sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFile(file);
          }
          event.target.value = "";
        }}
      />
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDragging(true);
          }
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex min-h-[15rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-[14px] border border-dashed px-6 py-10 text-center transition-colors duration-150",
          "peer-focus-visible:border-ember/70 peer-focus-visible:ring-2 peer-focus-visible:ring-ember/40",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          dragging
            ? "border-ember bg-ember/[0.06]"
            : "border-divider bg-ground hover:border-fg-3 hover:bg-surface",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-raised text-fg-2">
          <Icon aria-hidden className="size-5" />
        </span>
        <span>
          <span className="block text-[15px] font-medium text-fg">{label}</span>
          <span className="mt-1 block text-sm text-fg-2">
            Glissez-déposez un fichier ou{" "}
            <span className="text-fg underline decoration-ember/60 underline-offset-4">
              parcourez vos fichiers
            </span>
          </span>
        </span>
      </label>
      <p id={`${id}-hint`} className="mt-2.5 text-[13px] text-fg-3">
        {hint}
      </p>
    </div>
  );
}
