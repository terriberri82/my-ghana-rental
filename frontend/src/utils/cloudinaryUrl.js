// Asks Cloudinary for a resized, compressed version of an image.
// The original stays untouched; only the delivered copy changes.
//
// mode "fill": crops to exactly width x height (good for cards and thumbnails).
//              g_auto tells Cloudinary to keep the most important part in frame.
// mode "fit":  shrinks the whole image to fit inside width x height, no cropping.
export function cloudinaryThumb(url, width = 600, height = 400, mode = "fill") {
  if (!url || !url.includes("/upload/")) return url;

  const crop = mode === "fit" ? "c_fit" : "c_fill,g_auto";

  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},${crop},f_auto,q_auto/`
  );
}