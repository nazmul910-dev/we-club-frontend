import { UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";





export const fieldClass =
  "h-11 rounded-lg border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 " +
  "backdrop-blur-sm transition-colors focus-visible:border-gold/60 " +
  "focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:ring-offset-0";

export const fileFieldClass =
  "h-auto rounded-lg border border-dashed border-white/15 bg-white/[0.03] text-white/70 " +
  "backdrop-blur-sm py-3 px-3 cursor-pointer transition-colors hover:border-gold/50 " +
  "file:mr-3 file:rounded-full file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 " +
  "file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-gold " +
  "hover:file:bg-gold/25";



// Creates (and cleans up) a blob preview URL for a single File.
 function useObjectUrl(file: File | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

export function CoverImageField({
  value,
  onChange,
}: {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
}) {
  const previewUrl = useObjectUrl(value);

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90 transition"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          className={`${fileFieldClass} flex items-center justify-center gap-2 text-sm cursor-pointer`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0])}
          />
          <UploadCloud size={16} className="text-gold" />
          Click to choose a cover image
        </label>
      )}
    </div>
  );
}

export function GalleryImagesField({
  value,
  onChange,
}: {
  value: File[];
  onChange: (files: File[]) => void;
}) {
  function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    onChange([...value, ...newFiles]);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <label
        className={`${fileFieldClass} flex items-center justify-center gap-2 text-sm cursor-pointer`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleAdd}
        />
        <UploadCloud size={16} className="text-gold" />
        {value.length > 0
          ? `${value.length} image${value.length > 1 ? "s" : ""} selected — add more`
          : "Click to select images (multiple allowed)"}
      </label>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((file, i) => (
            <GalleryThumb
              key={`${file.name}-${i}`}
              file={file}
              onRemove={() => handleRemove(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GalleryThumb({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const previewUrl = useObjectUrl(file);

  return (
    <div className="group relative aspect-square rounded-md overflow-hidden border border-white/10">
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={file.name}
          className="h-full w-full object-cover"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 transition"
      >
        <X size={12} />
      </button>
    </div>
  );
}
