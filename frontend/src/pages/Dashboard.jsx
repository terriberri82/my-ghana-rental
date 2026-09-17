import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/app/PageHeader";

function StatCard({ label, value, children, dark }) {
  return (
    <div
      className={`rounded-md p-4 ${
        dark ? "bg-bayou" : "bg-white border border-pearl"
      }`}
    >
      <p className={`text-xs ${dark ? "text-paper/65" : "text-ebony/60"}`}>
        {label}
      </p>
      <p
        className={`font-display text-2xl md:text-3xl font-bold mt-0.5 ${
          dark ? "text-sun" : "text-bayou"
        }`}
      >
        {value}
      </p>
      {children && <div className="mt-2 text-xs">{children}</div>}
    </div>
  );
}

function MonthBars({ months }) {
  const max = Math.max(...months.map((m) => m.total), 1);

  return (
    <div className="flex items-end gap-2.5 h-24">
      {months.map((m, i) => (
        <div
          key={m.label}
          className="flex-1 flex flex-col items-center gap-1.5"
        >
          <div
            className={`w-full rounded-sm ${
              i === months.length - 1 ? "bg-sun" : "bg-pearl"
            }`}
            style={{ height: `${Math.max((m.total / max) * 100, 4)}%` }}
          />
          <span className="text-[10px] text-ebony/50">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <p className="text-sm text-ebony/60">
        Couldn't load your dashboard. {error}
      </p>
    );
  }

  if (!data) {
    return <p className="text-sm text-ebony/50">Loading…</p>;
  }

  const {
    propertyCount,
    unitCount,
    occupiedCount,
    vacantCount,
    monthTotal,
    monthCount,
    months,
    recentPayments,
    vacantUnits,
  } = data;

  if (propertyCount === 0) {
    return (
      <>
        <PageHeader
          title={`Hello, ${user?.firstName}`}
          subtitle="Let's get your first property set up."
        />
        <div className="border border-dashed border-pearl rounded-md p-12 text-center bg-white">
          <h2 className="font-display text-xl font-semibold text-bayou">
            Add your first property
          </h2>
          <p className="mt-2 text-sm text-ebony/65 max-w-sm mx-auto leading-relaxed">
            Start with a building. Once it's in, you can add the units inside it
            and put tenants in them.
          </p>
          <Link
            to="/properties/new"
            className="inline-block mt-6 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
          >
            Add property
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.firstName}`}
        subtitle="Here's where your units stand today."
        action={
          <Link
            to="/payments/new"
            className="bg-sun text-ebony font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-95"
          >
            Record payment
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Units" value={unitCount}>
          <span className="text-bayou">{occupiedCount} occupied</span>
          <span className="text-brick ml-3">{vacantCount} vacant</span>
        </StatCard>

        <StatCard label="Properties" value={propertyCount}>
          <Link to="/properties" className="text-ebony/55 hover:text-bayou">
            View all
          </Link>
        </StatCard>

        <StatCard
          dark
          label={`Recorded in ${months[months.length - 1]?.label}`}
          value={`GHS ${Number(monthTotal).toLocaleString()}`}
        >
          <span className="text-paper/55">
            from {monthCount} {monthCount === 1 ? "payment" : "payments"}
          </span>
        </StatCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-3 mt-3">
        <div className="bg-white border border-pearl rounded-md p-4">
          <p className="text-xs font-medium text-bayou mb-4">
            Recorded each month
          </p>
          <MonthBars months={months} />
        </div>

        <div className="bg-white border border-pearl rounded-md p-4">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-medium text-bayou">Recent payments</p>
            <Link
              to="/payments"
              className="text-xs text-ebony/50 hover:text-bayou"
            >
              See all
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p className="text-sm text-ebony/50 py-6">
              No payments recorded yet.
            </p>
          ) : (
            recentPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 py-2 border-b border-paper last:border-0"
              >
                <div className="w-8 h-8 shrink-0 grid place-items-center rounded-sm bg-bayou text-paper text-xs font-medium">
                  {p.unitLabel}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ebony truncate">{p.tenantName}</p>
                  <p className="text-[11px] text-ebony/50">
                    {p.method} · {p.date}
                  </p>
                </div>
                <p className="text-sm font-medium text-bayou tabular-nums">
                  {Number(p.amount).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white border border-pearl rounded-md p-4 mt-3">
        <p className="text-xs font-medium text-bayou mb-3">Vacant units</p>

        {vacantUnits.length === 0 ? (
          <p className="text-sm text-ebony/50">
            Every unit is occupied. Nothing sitting empty.
          </p>
        ) : (
          <div className="flex gap-2.5 flex-wrap">
            {vacantUnits.map((u) => (
              <Link
                key={u.id}
                to={`/units/${u.id}`}
                className="flex items-center gap-2 border border-pearl rounded-sm px-3 py-2 hover:border-bayou"
              >
                <span className="w-6 h-6 grid place-items-center rounded-sm bg-brick/10 text-brick text-[10px] font-medium">
                  {u.unitLabel}
                </span>
                <span>
                  <span className="block text-[11px] text-ebony">
                    {u.propertyName}
                  </span>
                  <span className="block text-[10px] text-ebony/50">
                    GHS {Number(u.rentAmount).toLocaleString()}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
