import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";
import Modal from "../components/ui/Modal";
import PropertyGallery from "../components/PropertyGallery";

const pretty = (v) =>
  v
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api(`/properties/${id}`)
      .then((data) => setProperty(data.property))
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await api(`/properties/${id}`, { method: "DELETE" });
      navigate("/properties");
    } catch (err) {
      setConfirmDelete(false);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (error && !property) {
    return <p className="text-sm text-ebony/60">{error}</p>;
  }

  if (!property) {
    return <p className="text-sm text-ebony/50">Loading…</p>;
  }

  const units = property.units || [];
  const occupied = units.filter((u) => u.status === "OCCUPIED").length;

  return (
    <div>
      <Link
        to="/properties"
        className="text-sm text-ebony/55 hover:text-bayou inline-block mb-4"
      >
        ← All properties
      </Link>

      <PageHeader
        title={property.name}
        subtitle={`${property.address}, ${property.city} · ${pretty(
          property.region,
        )}`}
        action={
          <div className="flex items-center gap-3">
            <Link
              to={`/properties/${id}/edit`}
              className="text-sm text-ebony/60 hover:text-bayou"
            >
              Edit
            </Link>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm text-brick hover:underline"
            >
              Delete
            </button>
            <Link
              to={`/units/new?propertyId=${id}`}
              className="bg-sun text-ebony font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-95"
            >
              Add unit
            </Link>
          </div>
        }
      />

      <PropertyGallery
        images={property.images}
        name={property.name}
        type={property.propertyType}
      />

      <div className="flex flex-wrap gap-6 mb-8 text-sm">
        <span className="text-ebony/60">
          Type:{" "}
          <span className="text-ebony">{pretty(property.propertyType)}</span>
        </span>
        <span className="text-ebony/60">
          Units: <span className="text-ebony tabular-nums">{units.length}</span>
        </span>
        {units.length > 0 && (
          <>
            <span className="text-bayou">{occupied} occupied</span>
            {units.length - occupied > 0 && (
              <span className="text-brick">
                {units.length - occupied} vacant
              </span>
            )}
          </>
        )}
      </div>

      {property.description && (
        <p className="text-sm text-ebony/70 leading-relaxed max-w-xl mb-8 border-l-2 border-pearl pl-4">
          {property.description}
        </p>
      )}

      <h2 className="font-display text-lg font-semibold text-bayou mb-3">
        Units
      </h2>

      {units.length === 0 ? (
        <div className="border border-dashed border-pearl rounded-md p-10 text-center bg-white">
          <p className="text-sm text-ebony/65 max-w-sm mx-auto leading-relaxed">
            No units in this property yet. Add one for each flat, room or shop
            you rent out.
          </p>
          <Link
            to={`/units/new?propertyId=${id}`}
            className="inline-block mt-5 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
          >
            Add unit
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-pearl rounded-md px-4">
          {units.map((u) => {
            const isOccupied = u.status === "OCCUPIED";
            return (
              <Link
                key={u.id}
                to={`/units/${u.id}`}
                className="flex items-center gap-4 py-4 border-b border-paper last:border-0 hover:bg-paper/60 px-2 -mx-2 rounded-sm"
              >
                <div
                  className={`w-11 h-11 shrink-0 grid place-items-center rounded-sm font-display font-semibold text-sm ${
                    isOccupied
                      ? "bg-bayou text-paper"
                      : "bg-brick/10 text-brick"
                  }`}
                >
                  {u.unitLabel}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ebony">
                    {u.bedrooms} bed · {u.bathrooms} bath
                  </p>
                  <p
                    className={`text-xs ${
                      isOccupied ? "text-bayou" : "text-brick"
                    }`}
                  >
                    {isOccupied ? "Occupied" : "Vacant"}
                  </p>
                </div>

                <p className="text-sm font-medium text-bayou tabular-nums shrink-0">
                  GHS {Number(u.rentAmount).toLocaleString()}
                </p>
              </Link>
            );
          })}
        </div>
      )}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this property?"
        hideDismiss
      >
        <span className="block mb-4">
          This removes {property.name} from your account. It can't be undone.
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-brick text-white text-sm font-medium px-6 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Yes, delete it"}
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="text-sm text-ebony/60 hover:text-bayou"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        open={Boolean(error)}
        onClose={() => setError("")}
        title="Can't do that"
      >
        {error}
      </Modal>
    </div>
  );
}