import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
  Link,
} from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";
import Modal from "../components/ui/Modal";

export default function UnitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editing = Boolean(id);

  const location = useLocation();
  const fromOnboarding = location.state?.fromOnboarding;

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [form, setForm] = useState({
    propertyId: searchParams.get("propertyId") || "",
    unitLabel: "",
    bedrooms: 1,
    bathrooms: 1,
    rentAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/properties")
      .then((data) => {
        setProperties(data.properties);
        setForm((f) =>
          f.propertyId || data.properties.length === 0
            ? f
            : { ...f, propertyId: data.properties[0].id },
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProperties(false));
  }, []);

  useEffect(() => {
    if (!editing) return;
    api(`/units/${id}`)
      .then((data) =>
        setForm({
          propertyId: data.unit.propertyId,
          unitLabel: data.unit.unitLabel,
          bedrooms: data.unit.bedrooms,
          bathrooms: data.unit.bathrooms,
          rentAmount: String(data.unit.rentAmount),
        }),
      )
      .catch((err) => setError(err.message));
  }, [id, editing]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const data = await api(editing ? `/units/${id}` : "/units", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(form),
      });

      if (fromOnboarding && !editing) {
        navigate("/dashboard");
      } else {
        navigate(`/units/${data.unit.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full px-4 py-2.5 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";
  const label = "block text-sm font-medium text-ebony mb-1.5";

  if (loadingProperties) {
    return <p className="text-sm text-ebony/50">Loading…</p>;
  }

  if (!editing && properties.length === 0 && !error) {
    return (
      <>
        <PageHeader title="Add a unit" />
        <div className="border border-dashed border-pearl rounded-md p-10 text-center bg-white max-w-xl">
          <p className="text-sm text-ebony/65 leading-relaxed">
            You need a property before you can add units to it.
          </p>
          <Link
            to="/properties/new"
            state={{ fromOnboarding }}
            className="inline-block mt-5 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
          >
            Add property first
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={editing ? "Edit unit" : "Add a unit"}
        subtitle="One unit for each flat, room or shop you rent out."
      />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="propertyId" className={label}>
            Property
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={form.propertyId}
            onChange={handleChange}
            required
            disabled={editing}
            className={`${field} disabled:opacity-60`}
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {editing && (
            <p className="mt-1 text-xs text-ebony/50">
              A unit can't be moved to a different property.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="unitLabel" className={label}>
            Unit number or name <span className="text-brick">*</span>
          </label>
          <input
            id="unitLabel"
            name="unitLabel"
            value={form.unitLabel}
            onChange={handleChange}
            required
            placeholder="A1"
            className={field}
          />
          <p className="mt-1 text-xs text-ebony/50">
            However you mark the door. A1, Room 3, Shop 2.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="bedrooms" className={label}>
              Bedrooms
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={handleChange}
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className={label}>
              Bathrooms
            </label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={handleChange}
              required
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="rentAmount" className={label}>
            Monthly rent (GHS) <span className="text-brick">*</span>
          </label>
          <input
            id="rentAmount"
            name="rentAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.rentAmount}
            onChange={handleChange}
            required
            placeholder="1500.00"
            className={field}
          />
          <p className="mt-1 text-xs text-ebony/50">
            What you ask for this unit. A tenant's agreed rent is set on the
            lease.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : editing ? "Save changes" : "Add unit"}
          </button>

          <Link
            to={
              fromOnboarding
                ? "/dashboard"
                : editing
                  ? `/units/${id}`
                  : `/properties/${form.propertyId}`
            }
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
