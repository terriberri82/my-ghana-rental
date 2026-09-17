import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";
import Modal from "../components/ui/Modal";

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

function WhatsAppLink({ phone, className }) {
  const Tag = "a";
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  return (
    <Tag
      href={`https://wa.me/233${digits}`}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {phone}
    </Tag>
  );
}

export default function UnitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api(`/units/${id}`)
      .then((data) => setUnit(data.unit))
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await api(`/units/${id}`, { method: "DELETE" });
      navigate(`/properties/${unit.property.id}`);
    } catch (err) {
      setConfirmDelete(false);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (error && !unit) {
    return <p className="text-sm text-ebony/60">{error}</p>;
  }

  if (!unit) {
    return <p className="text-sm text-ebony/50">Loading…</p>;
  }

  const leases = unit.leases || [];
  const activeLease = leases.find((l) => l.status === "ACTIVE") || null;
  const payments = activeLease ? activeLease.payments : [];

  const totalRecorded = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <Link
        to={`/properties/${unit.property.id}`}
        className="text-sm text-ebony/55 hover:text-bayou inline-block mb-4"
      >
        ← {unit.property.name}
      </Link>

      <PageHeader
        title={`Unit ${unit.unitLabel}`}
        subtitle={`${unit.bedrooms} bed · ${unit.bathrooms} bath · GHS ${Number(
          unit.rentAmount,
        ).toLocaleString()} per month`}
        action={
          <div className="flex items-center gap-3">
            <Link
              to={`/units/${id}/edit`}
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
            {activeLease ? (
              <Link
                to={`/payments/new?leaseId=${activeLease.id}`}
                className="bg-sun text-ebony font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-95"
              >
                Record payment
              </Link>
            ) : (
              <Link
                to={`/leases/new?unitId=${id}`}
                className="bg-sun text-ebony font-medium text-sm px-6 py-2.5 rounded-full hover:brightness-95"
              >
                Add tenant
              </Link>
            )}
          </div>
        }
      />

      {activeLease ? (
        <div className="bg-white border border-pearl rounded-md p-5 mb-6 max-w-2xl">
          <p className="text-xs text-ebony/55 mb-3">Current tenant</p>

          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-bayou">
                {activeLease.tenant.firstName} {activeLease.tenant.lastName}
              </p>
              <WhatsAppLink
                phone={activeLease.tenant.phone}
                className="text-sm text-ebony/60 hover:text-bayou"
              />
            </div>

            <p className="text-sm font-medium text-bayou tabular-nums">
              GHS {Number(activeLease.rentAmount).toLocaleString()} / month
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-paper text-sm">
            <div>
              <p className="text-xs text-ebony/55">Lease started</p>
              <p className="text-ebony mt-0.5">
                {formatDate(activeLease.startDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-ebony/55">Ends</p>
              <p className="text-ebony mt-0.5">
                {formatDate(activeLease.endDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-ebony/55">Advance paid</p>
              <p className="text-ebony mt-0.5 tabular-nums">
                {activeLease.advanceMonths}{" "}
                {activeLease.advanceMonths === 1 ? "month" : "months"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-pearl rounded-md p-8 mb-6 max-w-2xl bg-white">
          <p className="font-display font-semibold text-bayou">Vacant</p>
          <p className="mt-1.5 text-sm text-ebony/65 leading-relaxed">
            No tenant in this unit. Add one to start recording rent against it.
          </p>
        </div>
      )}

      <div className="flex items-baseline justify-between mb-3 max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-bayou">
          Payment history
        </h2>
        {payments.length > 0 && (
          <p className="text-sm text-ebony/55 tabular-nums">
            GHS {totalRecorded.toLocaleString()} recorded
          </p>
        )}
      </div>

      {!activeLease ? (
        <p className="text-sm text-ebony/50 max-w-2xl">
          Payments are recorded against a tenant's lease.
        </p>
      ) : payments.length === 0 ? (
        <div className="border border-dashed border-pearl rounded-md p-8 text-center bg-white max-w-2xl">
          <p className="text-sm text-ebony/65">
            Nothing recorded yet for this tenant.
          </p>
          <Link
            to={`/payments/new?leaseId=${activeLease.id}`}
            className="inline-block mt-4 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
          >
            Record first payment
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-pearl rounded-md px-4 max-w-2xl">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 py-3.5 border-b border-paper last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ebony">
                  {formatDate(p.paidAt)}
                  {p.status !== "SUCCESS" && (
                    <span className="ml-2 text-xs text-brick">
                      {p.status.toLowerCase()}
                    </span>
                  )}
                </p>
                <p className="text-xs text-ebony/55">
                  {METHODS[p.method] || p.method}
                  {p.note && ` · ${p.note}`}
                </p>
              </div>

              <p className="text-sm font-medium text-bayou tabular-nums shrink-0">
                {Number(p.amount).toLocaleString()}
              </p>

              <Link
                to={`/payments/${p.id}/edit`}
                className="text-xs text-ebony/45 hover:text-bayou shrink-0"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this unit?"
      >
        <span className="block mb-4">
          This removes unit {unit.unitLabel} from {unit.property.name}. It can't
          be undone.
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-brick text-white text-sm font-medium px-6 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Yes, delete it"}
        </button>
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
