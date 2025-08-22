import { useState } from "react";

export type ImageItem = { id?: string; url: string; alt?: string };
type Props = { images?: ImageItem[] };

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='100%' height='100%' fill='%23f2f2f2'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24'>Sem imagem</text></svg>";

export default function ProductGallery({ images = [] }: Props) {
  const safe = images.filter(Boolean).map((img, i) => ({
    ...img,
    url: img.url || PLACEHOLDER,
    alt: img.alt || `Imagem ${i + 1}`,
  }));

  const hasAny = safe.length > 0;
  const mainIndexDefault = 0;
  const [idx, setIdx] = useState(mainIndexDefault);

  const main = hasAny ? safe[idx] : { url: PLACEHOLDER, alt: "Sem imagem" };
  const thumbs = hasAny ? safe : [];

  return (
    <div
      className={`grid h-full w-full max-w-7xl gap-4 overflow-hidden ${thumbs.length > 1 ? "grid-cols-1 lg:grid-cols-[1fr_120px]" : "grid-cols-1"}`}
    >
      {/* Imagem principal com ratio consistente */}
      <div className="h-full w-full">
        <div className="aspect-square h-auto w-full overflow-hidden rounded-xl">
          <img
            src={main.url}
            alt={main.alt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      {/* Thumbs: esconda quando só houver 1 */}
      <div className="relative h-full w-full">
        {thumbs.length > 1 ? (
          <div
            className="flex gap-3 overflow-y-auto lg:max-h-[480px] lg:flex-col"
            aria-label="Galeria de miniaturas"
          >
            {thumbs.map((t, i) => (
              <button
                key={t.id ?? i}
                onClick={() => setIdx(i)}
                className={[
                  "h-24 w-24 cursor-pointer overflow-hidden rounded-lg border",
                  i === idx ? "border-3 border-neutral-500" : "border-zinc-200",
                ].join(" ")}
                aria-current={i === idx}
              >
                <img
                  src={t.url}
                  alt={t.alt ?? ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
            {/* Opcional: contador quando houver várias */}
            {/* {thumbs.length > 1 && (
              <div className="hidden text-sm lg:mt-2 lg:block">
                Foto {idx + 1} de {thumbs.length}
              </div>
            )} */}
          </div>
        ) : (
          <div className="w-24" />
        )}
      </div>
    </div>
  );
}
