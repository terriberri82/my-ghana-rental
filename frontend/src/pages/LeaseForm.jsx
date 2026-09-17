import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import PageHeader from "../components/app/PageHeader";
import Modal from "../components/ui/Modal";

const today = () => new Date().toISOString().slice(0, 10);

const oneYearOn = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

export default function LeaseForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get("unitId");

  const [unit, setUnit] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    startDate: today(),
    endDate: oneYearOn(),
    rentAmount: "",
    advanceMonths: 0,
    depositAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!unitId) return;
    api(`/units/${unitId}`)
      .then((data) => {
        setUnit(data.unit);
        setForm((f) => ({ ...f, rentAmount: String(data.unit.rentAmount) }));
      })
      .catch((err) => setError(err.message));
  }, [unitId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await api("/leases", {
        method: "POST",
        body: JSON.stringify({ unitId, ...form }),
      });
      navigate(`/units/${unitId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full px-4 py-2.5 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";
  const label = "block text-sm font-medium text-ebony mb-1.5";

  if (!unitId) {
    return (
      <div>
        <PageHeader title="Add a tenant" />
        <p className="text-sm text-ebony/65">
          Open the unit you want to add a tenant to, then use the Add tenant
          button there.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Add a tenant"
        subtitle={
          unit
            ? `Unit ${unit.unitLabel} · ${unit.property.name}`
            : "Loading unit…"
        }
      />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className={label}>
              Tenant first name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="Ama"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="lastName" className={label}>
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Boateng"
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={label}>
            Tenant phone number
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="024 123 4567"
            className={field}
          />
          <p className="mt-1 text-xs text-ebony/50">
            Used to reach them on WhatsApp. They don't get an account.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="startDate" className={label}>
              Lease starts
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="endDate" className={label}>
              Lease ends
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              required
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="rentAmount" className={label}>
            Agreed rent (GHS per month)
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
            className={field}
          />
          <p className="mt-1 text-xs text-ebony/50">
            Defaults to the unit's rent. Change it if this tenant agreed
            something different.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="advanceMonths" className={label}>
              Months paid in advance
            </label>
            <input
              id="advanceMonths"
              name="advanceMonths"
              type="number"
              min="0"
              max="36"
              value={form.advanceMonths}
              onChange={handleChange}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="depositAmount" className={label}>
              Deposit (GHS){" "}
              <span className="font-normal text-ebony/45">(optional)</span>
            </label>
            <input
              id="depositAmount"
              name="depositAmount"
              type="number"
              min="0"
              step="0.01"
              value={form.depositAmount}
              onChange={handleChange}
              placeholder="0.00"
              className={field}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Add tenant"}
          </button>

          <Link
            to={`/units/${unitId}`}
            className="text-sm text-ebony/60 hover:text-bayou"
          >
            Cancel
          </Link>
        </div>
      </form>

      <Modal
        open={Boolean(error)}
        onClose={() => setError("")}
        title="Couldn't add tenant"
      >
        {error}
      </Modal>
    </div>
  );
}
