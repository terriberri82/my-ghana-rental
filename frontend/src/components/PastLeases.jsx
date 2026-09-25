import { useState } from "react";

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

const STATUS_LABELS = {
  TERMINATED: "Ended early",
  EXPIRED: "Expired",
};

function PastLease({ lease }) {
  const [open, setOpen] = useState(false);

  const payments = lease.payments || [];
  const total = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="border-b border-paper last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-4 py-3.5 text-left hover:bg-paper/60 px-2 -mx-2 rounded-sm"
      >
        <span className="text-ebony/40 text-xs shrink-0 w-3">
          {open ? "▾" : "▸"}
        </span>

        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-ebony">
            {lease.tenant.firstName} {lease.tenant.lastName}
          </span>
          <span className="block text-xs text-ebony/55">
            {formatDate(lease.startDate)} – {formatDate(lease.endDate)}
            {STATUS_LABELS[lease.status] && ` · ${STATUS_LABELS[lease.status]}`}
          </span>
        </span>

        <span className="text-sm text-bayou tabular-nums shrink-0">
          GHS {total.toLocaleString()}
        </span>
      </button>

      {open && (
        <div className="pb-4 pl-7 pr-2">
          {payments.length === 0 ? (
            <p className="text-xs text-ebony/50">
              No payments were recorded for this lease.
            </p>
          ) : (
            <div className="border-l-2 border-pearl pl-4 space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center gap-4 text-sm">
                  <span className="flex-1 min-w-0">
                    <span className="block text-ebony">
                      {formatDate(p.paidAt)}
                      {p.status !== "SUCCESS" && (
                        <span className="ml-2 text-xs text-brick">
                          {p.status.toLowerCase()}
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-ebony/55">
                      {METHODS[p.method] || p.method}
                      {p.note && ` · ${p.note}`}
                    </span>
                  </span>
                  <span className="text-bayou tabular-nums shrink-0">
                    {Number(p.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {lease.agreementUrl && <AgreementLink url={lease.agreementUrl} />}
        </div>
      )}
    </div>
  );
}

function AgreementLink({ url }) {
  const Tag = "a";
  return (
    <Tag
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-3 text-xs text-bayou underline"
    >
      View lease agreement
    </Tag>
  );
}

export default function PastLeases({ leases }) {
  if (leases.length === 0) return null;

  return (
    <div className="mt-8 max-w-2xl">
      <h2 className="font-display text-lg font-semibold text-bayou mb-3">
        Past tenants
      </h2>

      <div className="bg-white border border-pearl rounded-md px-4">
        {leases.map((lease) => (
          <PastLease key={lease.id} lease={lease} />
        ))}
      </div>
    </div>
  );
}