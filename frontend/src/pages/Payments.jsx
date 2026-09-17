import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";

const METHODS = {
  MOBILE_MONEY: "MoMo",
  CARD: "Card",
  CASH: "Cash",
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const monthKey = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "No date";

export default function Payments() {
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/payments")
      .then((data) => setPayments(data.payments))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-sm text-ebony/60">Couldn't load payments. {error}</p>;
  }

  if (!payments) {
    return <p className="text-sm text-ebony/50">Loading…</p>;
  }

  const total = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const groups = [];
  for (const p of payments) {
    const key = monthKey(p.paidAt);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.items.push(p);
    } else {
      groups.push({ key, items: [p] });
    }
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle={
          payments.length === 0
            ? "Nothing recorded yet"
            : `${payments.length} recorded · GHS ${total.toLocaleString()} total`
        }
      />

      {payments.length === 0 ? (
        <div className="border border-dashed border-pearl rounded-md p-12 text-center bg-white">
          <h2 className="font-display text-xl font-semibold text-bayou">
            No payments yet
          </h2>
          <p className="mt-2 text-sm text-ebony/65 max-w-sm mx-auto leading-relaxed">
            Payments are recorded against a tenant's lease. Open an occupied unit
            and use the Record payment button there.
          </p>
          <Link
            to="/units"
            className="inline-block mt-6 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
          >
            Go to units
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {groups.map((group) => {
            const groupTotal = group.items
              .filter((p) => p.status === "SUCCESS")
              .reduce((sum, p) => sum + Number(p.amount), 0);

            return (
              <div key={group.key}>
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-sm font-medium text-bayou">{group.key}</h2>
                  <p className="text-xs text-ebony/55 tabular-nums">
                    GHS {groupTotal.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white border border-pearl rounded-md px-4">
                  {group.items.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 py-3.5 border-b border-paper last:border-0"
                    >
                      <Link
                        to={`/units/${p.lease.unit.id}`}
                        className="w-10 h-10 shrink-0 grid place-items-center rounded-sm bg-bayou text-paper text-xs font-medium hover:brightness-110"
                      >
                        {p.lease.unit.unitLabel}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ebony truncate">
                          {p.lease.tenant.firstName} {p.lease.tenant.lastName}
                        </p>
                        <p className="text-xs text-ebony/55 truncate">
                          {p.lease.unit.property.name} ·{" "}
                          {METHODS[p.method] || p.method} · {formatDate(p.paidAt)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-bayou tabular-nums">
                          {Number(p.amount).toLocaleString()}
                        </p>
                        {p.status !== "SUCCESS" && (
                          <p className="text-[10px] text-brick">
                            {p.status.toLowerCase()}
                          </p>
                        )}
                      </div>

                      <Link
                        to={`/payments/${p.id}/edit`}
                        className="text-xs text-ebony/45 hover:text-bayou shrink-0"
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}