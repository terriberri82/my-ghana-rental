import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const MAX_SIZE_MB = 10;

export default function PhotoUploader({
  images,
  onChange,
  onUploadingChange,
  max = 10,
}) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [errors, setErrors] = useState([]);

  const remaining = max - images.length;
  const isUploading = uploadingCount > 0;

  const setUploading = (count) => {
    setUploadingCount(count);
    onUploadingChange?.(count > 0);
  };

  const handleFiles = async (e) => {
    const picked = Array.from(e.target.files);
    e.target.value = ""; // lets the same file be picked again later
    if (picked.length === 0) return;

    const messages = [];

    if (picked.length > remaining) {
      messages.push(
        `You can add ${remaining} more photo${remaining === 1 ? "" : "s"}. Extra photos were skipped.`
      );
    }

    const withinLimit = picked.slice(0, remaining);
    const files = withinLimit.filter(
      (file) => file.size <= MAX_SIZE_MB * 1024 * 1024
    );

    if (files.length < withinLimit.length) {
      messages.push(`Photos over ${MAX_SIZE_MB}MB were skipped.`);
    }

    setErrors(messages);
    if (files.length === 0) return;

    setUploading(files.length);

    const results = await Promise.allSettled(files.map(uploadToCloudinary));
    const uploaded = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    const failedCount = results.length - uploaded.length;
    if (failedCount > 0) {
      setErrors((prev) => [
        ...prev,
        `${failedCount} photo${failedCount === 1 ? "" : "s"} didn't upload. Please try again.`,
      ]);
    }

    onChange([...images, ...uploaded]);
    setUploading(0);
  };

  const handleRemove = (publicId) => {
    onChange(images.filter((img) => img.publicId !== publicId));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-ebony">
          Photos <span className="font-normal text-ebony/45">(optional)</span>
        </span>
        <span className="text-xs text-ebony/50">
          {images.length} of {max}
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.publicId}
              className="relative aspect-square overflow-hidden rounded-sm border border-pearl"
            >
              <img
                src={img.url}
                alt={`Property photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded-sm bg-ebony/70 px-1.5 py-0.5 text-xs text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(img.publicId)}
                disabled={isUploading}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute right-1 top-1 rounded-full bg-ebony/70 px-2 text-white hover:bg-ebony disabled:opacity-50"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <label
          className={`inline-block rounded-full border border-pearl bg-white px-5 py-2 text-sm text-ebony ${
            isUploading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-bayou hover:text-bayou"
          }`}
        >
          {isUploading
            ? `Uploading ${uploadingCount} photo${uploadingCount === 1 ? "" : "s"}…`
            : "Add photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      <p className="text-xs text-ebony/50">
        Up to {max} photos. The first one is the cover.
      </p>

      {errors.map((msg) => (
        <p key={msg} className="text-sm text-red-600">
          {msg}
        </p>
      ))}
    </div>
  );
}