import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";
import PropertyPlaceholder from "../components/PropertyPlaceholder";
import { cloudinaryThumb } from "../utils/cloudinaryUrl";

const pretty = (v) =>
  v
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function Properties() {
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/properties")
      .then((data) => setProperties(data.properties))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <p className="text-sm text-ebony/60">Couldn't load properties. {error}</p>
    );
  }

  if (!properties) {
    return <p className="text-sm text-ebony/50">Loading…</p>;
  }

  return (
    <>
      <PageHeader
        title="Properties"
        subtitle={`${properties.length} ${
          properties.length === 1 ? "property" : "properties"
        }`}
        action={
          <Link
            to="/properties/new"
            className="bg-sun text-ebony font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-95"
          >
            Add property
          </Link>
        }
      />

      {properties.length === 0 ? (
        <div className="border border-dashed border-pearl rounded-md p-12 text-center bg-white">
          <h2 className="font-display text-xl font-semibold text-bayou">
            No properties yet
          </h2>
          <p className="mt-2 text-sm text-ebony/65 max-w-sm mx-auto leading-relaxed">
            Add a building and then add the units inside it.
          </p>
          <Link
            to="/properties/new"
            className="inline-block mt-6 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
          >
            Add property
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {properties.map((p) => {
            const cover = p.images?.[0];

            return (
              <Link
                key={p.id}
                to={`/properties/${p.id}`}
                className="bg-white border border-pearl rounded-md overflow-hidden hover:border-bayou transition-colors"
              >
                {cover ? (
                  <img
                    src={cloudinaryThumb(cover.url)}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                ) : (
                  <PropertyPlaceholder
                    type={p.propertyType}
                    className="aspect-[3/2] w-full"
                  />
                )}

                <div className="p-5">
                  <span className="inline-block text-[10px] tracking-wide text-ebony/50 bg-paper px-2 py-1 rounded-sm">
                    {pretty(p.propertyType)}
                  </span>

                  <h2 className="font-display text-lg font-semibold text-bayou mt-3">
                    {p.name}
                  </h2>
                  <p className="text-sm text-ebony/60 mt-0.5">
                    {p.address}, {p.city}
                  </p>

                  <div className="mt-5 pt-4 border-t border-paper text-sm">
                    <span className="font-medium tabular-nums text-ebony">
                      {p._count.units}
                    </span>{" "}
                    <span className="text-ebony/55">
                      {p._count.units === 1 ? "unit" : "units"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}