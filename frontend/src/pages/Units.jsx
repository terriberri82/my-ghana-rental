import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";

export default function Units() {
  const [units, setUnits] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/units")
      .then((data) => setUnits(data.units))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <p className="text-sm text-ebony/60">Couldn't load units. {error}</p>
    );
  }

  if (!units) {
    return <p className="text-sm text-ebony/50">Loading…</p>;
  }

  const occupied = units.filter((u) => u.status === "OCCUPIED").length;

  return (
    <>
      <PageHeader
        title="Units"
        subtitle={
          units.length === 0
            ? "Nothing here yet"
            : `${units.length} total · ${occupied} occupied · ${
                units.length - occupied
              } vacant`
        }
        action={
          <Link
            to="/units/new"
            className="bg-sun text-ebony font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-95"
          >
            Add unit
          </Link>
        }
      />

      {units.length === 0 ? (
        <div className="border border-dashed border-pearl rounded-md p-12 text-center bg-white">
          <h2 className="font-display text-xl font-semibold text-bayou">
            No units yet
          </h2>
          <p className="mt-2 text-sm text-ebony/65 max-w-sm mx-auto leading-relaxed">
            Units live inside a property. Add a property first, then add the
            units in it.
          </p>
          <Link
            to="/units/new"
            className="inline-block mt-6 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
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
                  <p className="text-sm font-medium text-ebony truncate">
                    {u.property.name}
                  </p>
                  <p className="text-xs text-ebony/55">
                    {u.bedrooms} bed · {u.bathrooms} bath
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-bayou tabular-nums">
                    GHS {Number(u.rentAmount).toLocaleString()}
                  </p>
                  <p
                    className={`text-xs ${
                      isOccupied ? "text-bayou" : "text-brick"
                    }`}
                  >
                    {isOccupied ? "Occupied" : "Vacant"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
