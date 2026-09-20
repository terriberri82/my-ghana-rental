import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
} from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";
import Modal from "../components/ui/Modal";

const METHODS = [
  { value: "MOBILE_MONEY", label: "Mobile money" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card or bank transfer" },
];

const today = () => new Date().toISOString().slice(0, 10);

function SendReceipt({ href, label = "Send WhatsApp receipt" }) {
  const Tag = "a";
  return (
    <Tag
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block border border-bayou text-bayou font-medium text-sm px-6 py-2.5 rounded-full hover:bg-bayou hover:text-paper transition-colors"
    >
      {label}
    </Tag>
  );
}

export default function PaymentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const editing = Boolean(id);
  const leaseId = searchParams.get("leaseId");

  const [leases, setLeases] = useState(null);
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    method: "MOBILE_MONEY",
    paidAt: today(),
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savedPayment, setSavedPayment] = useState(false);

  useEffect(() => {
    if (editing || leaseId) return;
    api("/leases")
      .then((data) => setLeases(data.leases))
      .catch((err) => setError(err.message));
  }, [editing, leaseId]);

  useEffect(() => {
    if (editing || !leaseId) return;
    api(`/leases/${leaseId}`)
      .then((data) => {
        setContext({
          unitId: data.lease.unit.id,
          unitLabel: data.lease.unit.unitLabel,
          propertyName: data.lease.unit.property.name,
          tenantName: `${data.lease.tenant.firstName} ${data.lease.tenant.lastName}`,
          tenantFirstName: data.lease.tenant.firstName,
          tenantPhone: data.lease.tenant.phone,
        });
        setForm((f) => ({ ...f, amount: String(data.lease.rentAmount) }));
      })
      .catch((err) => setError(err.message));
  }, [leaseId, editing]);

  useEffect(() => {
    if (!editing) return;
    api(`/payments/${id}`)
      .then((data) => {
        const p = data.payment;
        setContext({
          unitId: p.lease.unit.id,
          unitLabel: p.lease.unit.unitLabel,
          propertyName: "",
          tenantName: `${p.lease.tenant.firstName} ${p.lease.tenant.lastName}`,
          tenantFirstName: p.lease.tenant.firstName,
          tenantPhone: p.lease.tenant.phone,
        });
        setForm({
          amount: String(p.amount),
          method: p.method,
          paidAt: p.paidAt ? p.paidAt.slice(0, 10) : today(),
          note: p.note || "",
        });
      })
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
      await api(editing ? `/payments/${id}` : "/payments", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(editing ? form : { leaseId, ...form }),
      });
      setSavedPayment(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (loading) return;
    setLoading(true);
    try {
      await api(`/payments/${id}`, { method: "DELETE" });
      navigate(context ? `/units/${context.unitId}` : "/payments");
    } catch (err) {
      setConfirmDelete(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function whatsappLink() {
    if (!context?.tenantPhone) return null;

    const digits = context.tenantPhone.replace(/\D/g, "").replace(/^0/, "");

    const date = new Date(form.paidAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const text = encodeURIComponent(
      `Hi ${context.tenantFirstName}, this is to confirm I received GHS ${Number(
        form.amount,
      ).toLocaleString()} for unit ${context.unitLabel} on ${date}. Thank you.`,
    );

    return `https://wa.me/233${digits}?text=${text}`;
  }

  const field =
    "w-full px-4 py-2.5 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";
  const label = "block text-sm font-medium text-ebony mb-1.5";

  if (!editing && !leaseId) {
    if (!leases) {
      return <p className="text-sm text-ebony/50">Loading…</p>;
    }

    if (leases.length === 0) {
      return (
        <div>
          <PageHeader title="Record a payment" />
          <div className="border border-dashed border-pearl rounded-md p-10 bg-white max-w-xl">
            <p className="text-sm text-ebony/65 leading-relaxed">
              You don't have any tenants yet. Payments are recorded against a
              tenant's lease, so add a tenant to a unit first.
            </p>
            <Link
              to="/units"
              className="inline-block mt-5 bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95"
            >
              Go to units
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div>
        <PageHeader title="Record a payment" subtitle="Who paid you?" />

        <div className="bg-white border border-pearl rounded-md px-4 max-w-2xl">
          {leases.map((l) => (
            <Link
              key={l.id}
              to={`/payments/new?leaseId=${l.id}`}
              className="flex items-center gap-4 py-3.5 border-b border-paper last:border-0 hover:bg-paper/60 px-2 -mx-2 rounded-sm"
            >
              <div className="w-10 h-10 shrink-0 grid place-items-center rounded-sm bg-bayou text-paper text-xs font-medium">
                {l.unit.unitLabel}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-ebony truncate">
                  {l.tenant.firstName} {l.tenant.lastName}
                </p>
                <p className="text-xs text-ebony/55 truncate">
                  {l.unit.property.name}
                </p>
              </div>

              <p className="text-sm text-bayou tabular-nums shrink-0">
                GHS {Number(l.rentAmount).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={editing ? "Edit payment" : "Record a payment"}
        subtitle={
          context
            ? `${context.tenantName} · Unit ${context.unitLabel}${
                context.propertyName ? ` · ${context.propertyName}` : ""
              }`
            : "Loading…"
        }
      />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="amount" className={label}>
            Amount received (GHS)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
            placeholder="1500.00"
            className={field}
          />
          <p className="mt-1 text-xs text-ebony/50">
            Pre-filled with the agreed rent. Change it if they paid something
            different.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="method" className={label}>
              How it came in
            </label>
            <select
              id="method"
              name="method"
              value={form.method}
              onChange={handleChange}
              className={field}
            >
              {METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="paidAt" className={label}>
              Date received
            </label>
            <input
              id="paidAt"
              name="paidAt"
              type="date"
              value={form.paidAt}
              onChange={handleChange}
              required
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="note" className={label}>
            Note <span className="font-normal text-ebony/45">(optional)</span>
          </label>
          <input
            id="note"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="September rent"
            className={field}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : editing ? "Save changes" : "Record payment"}
          </button>

          {editing && whatsappLink() && (
            <SendReceipt href={whatsappLink()} label="Send receipt" />
          )}

          <Link
            to={context ? `/units/${context.unitId}` : "/payments"}
            className="text-sm text-ebony/60 hover:text-bayou"
          >
            Cancel
          </Link>

          {editing && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="ml-auto text-sm text-brick hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </form>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this payment?"
        hideDismiss
      >
        <span className="block mb-4">
          This removes the record permanently. Use it for a payment entered by
          mistake.
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-brick text-white text-sm font-medium px-6 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Yes, delete it"}
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
        title="Couldn't save"
      >
        {error}
      </Modal>

      <Modal
        open={savedPayment}
        onClose={() =>
          navigate(context ? `/units/${context.unitId}` : "/payments")
        }
        title={editing ? "Changes saved" : "Payment recorded"}
      >
        <span className="block mb-4">
          Saved. Want to send {context?.tenantFirstName} a receipt on WhatsApp?
        </span>
        {whatsappLink() && <SendReceipt href={whatsappLink()} />}
      </Modal>
    </div>
  );
}
