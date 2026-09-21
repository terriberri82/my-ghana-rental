import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";
import Modal from "../components/ui/Modal";
import PhotoUploader from "../components/PhotoUploader";

const REGIONS = [
  "GREATER_ACCRA", "ASHANTI", "WESTERN", "WESTERN_NORTH", "CENTRAL",
  "EASTERN", "VOLTA", "OTI", "NORTHERN", "SAVANNAH", "NORTH_EAST",
  "UPPER_EAST", "UPPER_WEST", "BONO", "BONO_EAST", "AHAFO",
];

const TYPES = [
  "COMPOUND_HOUSE", "APARTMENT_BLOCK", "SINGLE_FAMILY", "COMMERCIAL",
];

const pretty = (v) =>
  v.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export default function PropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    region: "GREATER_ACCRA",
    propertyType: "COMPOUND_HOUSE",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [photosUploading, setPhotosUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    api(`/properties/${id}`)
      .then((data) =>
        setForm({
          name: data.property.name,
          address: data.property.address,
          city: data.property.city,
          region: data.property.region,
          propertyType: data.property.propertyType,
          description: data.property.description || "",
        })
      )
      .catch((err) => setError(err.message));
  }, [id, editing]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || photosUploading) return;

    setLoading(true);
    try {
      const body = editing ? form : { ...form, images };

      const data = await api(editing ? `/properties/${id}` : "/properties", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      navigate(`/properties/${data.property.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full px-4 py-2.5 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";
  const label = "block text-sm font-medium text-ebony mb-1.5";

  return (
    <>
      <PageHeader
        title={editing ? "Edit property" : "Add a property"}
        subtitle="A building. You'll add the units inside it next."
      />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="name" className={label}>
            Property name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Osu Flats"
            className={field}
          />
          <p className="mt-1 text-xs text-ebony/50">
            Whatever you call it. It only has to make sense to you.
          </p>
        </div>

        <div>
          <label htmlFor="address" className={label}>
            Street address
          </label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="12 Oxford Street"
            className={field}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="city" className={label}>
              City or town
            </label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Accra"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="region" className={label}>
              Region
            </label>
            <select
              id="region"
              name="region"
              value={form.region}
              onChange={handleChange}
              className={field}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {pretty(r)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="propertyType" className={label}>
            Property type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className={field}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {pretty(t)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className={label}>
            Notes <span className="font-normal text-ebony/45">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Gated, shared water tank, caretaker on site."
            className={`${field} resize-none`}
          />
        </div>

        {!editing && (
          <PhotoUploader
            images={images}
            onChange={setImages}
            onUploadingChange={setPhotosUploading}
          />
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || photosUploading}
            className="bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Saving…"
              : photosUploading
              ? "Uploading photos…"
              : editing
              ? "Save changes"
              : "Add property"}
          </button>

          <Link
            to={editing ? `/properties/${id}` : "/properties"}
            className="text-sm text-ebony/60 hover:text-bayou"
          >
            Cancel
          </Link>
        </div>
      </form>

      <Modal
        open={Boolean(error)}
        onClose={() => setError("")}
        title="Couldn't save"
      >
        {error}
      </Modal>
    </>
  );
}