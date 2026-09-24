import { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const MAX_SIZE_MB = 10;

export default function DocumentUploader({
  value,
  onChange,
  onUploadingChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const setBusy = (busy) => {
    setUploading(busy);
    onUploadingChange?.(busy);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // lets the same file be picked again
    if (!file) return;

    setError("");

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`That file is over ${MAX_SIZE_MB}MB. Try a smaller one.`);
      return;
    }

    setBusy(true);
    try {
      const { url } = await uploadToCloudinary(file);
      setFileName(file.name);
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const buttonClass =
    "inline-block rounded-full border border-pearl bg-white px-5 py-2 text-sm text-ebony cursor-pointer hover:border-bayou hover:text-bayou";

  const Tag = "a";

  if (value) {
    return (
      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-ebony">
          Lease agreement
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Tag
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-bayou underline break-all"
          >
            {fileName || "View uploaded agreement"}
          </Tag>
          <button
            type="button"
            onClick={() => {
              setFileName("");
              onChange("");
            }}
            className="text-sm text-brick hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-ebony">
        Lease agreement{" "}
        <span className="font-normal text-ebony/45">(optional)</span>
      </span>

      <div className="flex flex-wrap gap-2">
        <label className={uploading ? `${buttonClass} opacity-50` : buttonClass}>
          {uploading ? "Uploading…" : "Upload file"}
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <label
          className={`sm:hidden ${uploading ? `${buttonClass} opacity-50` : buttonClass}`}
        >
          Take photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-xs text-ebony/50">
        A PDF or a photo of the signed agreement, up to {MAX_SIZE_MB}MB.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}