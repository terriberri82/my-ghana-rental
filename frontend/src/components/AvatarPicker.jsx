import { useState } from "react";
import { User } from "lucide-react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { cloudinaryThumb } from "../utils/cloudinaryUrl";

const MAX_SIZE_MB = 5;

export default function AvatarPicker({ value, onChange, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const setBusy = (busy) => {
    setUploading(busy);
    onUploadingChange?.(busy);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setError("");

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`That photo is over ${MAX_SIZE_MB}MB. Try a smaller one.`);
      return;
    }

    setBusy(true);
    try {
      const uploaded = await uploadToCloudinary(file);
      onChange({ avatarUrl: uploaded.url, avatarPublicId: uploaded.publicId });
    } catch (err) {
      setError(err.message || "That photo didn't upload. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = () => {
    setError("");
    onChange({ avatarUrl: null, avatarPublicId: null });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-pearl bg-paper">
        {value ? (
          <img
            src={cloudinaryThumb(value)}
            alt="Your profile photo"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <User className="h-8 w-8 text-ebony/30" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <label
            className={`inline-block rounded-full border border-pearl bg-white px-5 py-2 text-sm text-ebony ${
              uploading
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:border-bayou hover:text-bayou"
            }`}
          >
            {uploading ? "Uploading…" : value ? "Change photo" : "Add photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {value && !uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-ebony/55 hover:text-brick"
            >
              Remove
            </button>
          )}
        </div>

        <p className="text-xs text-ebony/50">
          Saves when you click Save details.
        </p>

        {error && <p className="text-sm text-brick">{error}</p>}
      </div>
    </div>
  );
}