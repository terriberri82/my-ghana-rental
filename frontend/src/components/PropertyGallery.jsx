import { useState } from "react";
import PropertyPlaceholder from "./PropertyPlaceholder";
import { cloudinaryThumb } from "../utils/cloudinaryUrl";

export default function PropertyGallery({ images = [], name, type }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <PropertyPlaceholder
        type={type}
        className="aspect-[16/9] w-full max-w-3xl rounded-md border border-pearl mb-8"
      />
    );
  }

  // If a photo was removed and the selected one no longer exists, fall back to the cover.
  const current = images[selected] || images[0];

  return (
    <div className="max-w-3xl mb-8">
      <div className="aspect-[16/9] w-full bg-paper rounded-md border border-pearl overflow-hidden">
        <img
          src={cloudinaryThumb(current.url, 1200, 675, "fit")}
          alt={`${name}, photo ${selected + 1} of ${images.length}`}
          className="h-full w-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img.id || img.publicId}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show photo ${index + 1}`}
              className={`shrink-0 rounded-sm overflow-hidden border-2 transition-colors ${
                index === selected
                  ? "border-bayou"
                  : "border-transparent hover:border-pearl"
              }`}
            >
              <img
                src={cloudinaryThumb(img.url, 160, 160)}
                alt=""
                loading="lazy"
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
