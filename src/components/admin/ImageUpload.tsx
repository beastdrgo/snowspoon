"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";
import { uploadImage } from "@/lib/admin/api";
import { toast } from "./Toast";

export function ImageUpload({
  value,
  onChange,
  folder = "menu",
  aspect = "aspect-[4/3]",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file.", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast("Image must be under 8MB.", "error");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast("Image uploaded.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        className={`relative ${aspect} w-full overflow-hidden rounded-2xl border-2 border-dashed border-line bg-cloud`}
      >
        {value ? (
          <>
            <Image src={value} alt="Preview" fill sizes="320px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-ink shadow-soft hover:text-brand"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <ImageIcon className="size-8" />
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="size-6 animate-spin text-brand" />
          </div>
        )}
      </div>

      <label className="btn btn-ghost mt-2 w-full cursor-pointer py-2.5 text-sm">
        <Upload className="size-4" />
        {value ? "Replace image" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </label>
      <p className="mt-1.5 text-center text-xs text-muted">
        Or paste an image URL in the field below.
      </p>
    </div>
  );
}
