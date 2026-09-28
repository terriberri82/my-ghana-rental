import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { cloudinaryThumb } from "../utils/cloudinaryUrl";
import { api } from "../lib/api";

const MAX_SIZE_MB = 10;

export default function PropertyPhotoManager({
  propertyId,
  images,
  onChange,
  max = 10,
}) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState([]);
  const [confirmingId, setConfirmingId] = useState(null);

  const remaining = max - images.length;

  const handleFiles = async (e) => {
    const picked = Array.from(e.target.files);
    e.target.value = "";
    if (picked.length === 0) return;

    const messages = [];

    if (picked.length > remaining) {
      messages.push(
        `You can add ${remaining} more photo${remaining === 1 ? "" : "s"}. Extra photos were skipped.`,
      );
    }

    const withinLimit = picked.slice(0, remaining);
    const files = withinLimit.filter(
      (file) => file.size <= MAX_SIZE_MB * 1024 * 1024,
    );

    if (files.length < withinLimit.length) {
      messages.push(`Photos over ${MAX_SIZE_MB}MB were skipped.`);
    }

    setErrors(messages);
    if (files.length === 0) return;

    setBusy(true);

    try {
      const results = await Promise.allSettled(files.map(uploadToCloudinary));
      const uploaded = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      const failedCount = results.length - uploaded.length;
      if (failedCount > 0) {
        messages.push(
          `${failedCount} photo${failedCount === 1 ? "" : "s"} didn't upload. Please try again.`,
        );
        setErrors([...messages]);
      }

      if (uploaded.length > 0) {
        const data = await api(`/properties/${propertyId}/images`, {
          method: "POST",
          body: JSON.stringify({ images: uploaded }),
        });
        onChange(data.images);
      }
    } catch (err) {
      setErrors([...messages, err.message || "Couldn't save the photos."]);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (imageId) => {
    setBusy(true);
    setErrors([]);

    try {
      const data = await api(`/properties/${propertyId}/images/${imageId}`, {
        method: "DELETE",
      });
      onChange(data.images);
      setConfirmingId(null);
    } catch (err) {
      setErrors([err.message || "Couldn't remove the photo."]);
    } finally {
      setBusy(false);
    }
  };

  const handleSetCover = async (imageId) => {
    setBusy(true);
    setErrors([]);

    try {
      const data = await api(
        `/properties/${propertyId}/images/${imageId}/cover`,
        { method: "PATCH" },
      );
      onChange(data.images);
    } catch (err) {
      setErrors([err.message || "Couldn't set the cover photo."]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-ebony">Photos</span>
        <span className="text-xs text-ebony/50">
          {images.length} of {max}
        </span>
      </div>

      <p className="text-xs text-ebony/50">
        Photo changes save right away, separately from the fields above.
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-sm border border-pearl"
            >
              <img
                src={cloudinaryThumb(img.url)}
                alt={`Property photo ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {confirmingId === img.id ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ebony/80 p-2 text-center">
                  <span className="text-[10px] leading-tight text-white">
                    Remove this photo?
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRemove(img.id)}
                      disabled={busy}
                      className="rounded-sm bg-brick px-2 py-1 text-[10px] text-white hover:brightness-110 disabled:opacity-50"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      disabled={busy}
                      className="rounded-sm bg-white/90 px-2 py-1 text-[10px] text-ebony hover:bg-white disabled:opacity-50"
                    >
                      Keep
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {index === 0 ? (
                    <span className="absolute left-1 top-1 rounded-sm bg-ebony/70 px-1.5 py-0.5 text-[10px] text-white">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCover(img.id)}
                      disabled={busy}
                      className="absolute bottom-1 left-1 rounded-sm bg-ebony/70 px-1.5 py-0.5 text-[10px] text-white hover:bg-ebony disabled:opacity-50"
                    >
                      Make cover
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setConfirmingId(img.id)}
                    disabled={busy}
                    aria-label={`Remove photo ${index + 1}`}
                    className="absolute right-1 top-1 rounded-full bg-ebony/70 px-2 text-white hover:bg-ebony disabled:opacity-50"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <label
          className={`inline-block rounded-full border border-pearl bg-white px-5 py-2 text-sm text-ebony ${
            busy
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-bayou hover:text-bayou"
          }`}
        >
          {busy ? "Working…" : "Add photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={busy}
            className="hidden"
          />
        </label>
      )}

      {errors.map((msg) => (
        <p key={msg} className="text-sm text-brick">
          {msg}
        </p>
      ))}
    </div>
  );
}