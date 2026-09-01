import Image from "next/image";

export type RetreatGalleryProps = {
  title: string;
  images: string[];
};

export function RetreatGallery({ title, images }: RetreatGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className="">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
          {title} Gallery
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-7 sm:gap-2.5 sm:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={src}
            className="group relative aspect-square overflow-hidden bg-line rounded-2xl"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Image
              src={src}
              alt={`${title} photo ${i + 1}`}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
