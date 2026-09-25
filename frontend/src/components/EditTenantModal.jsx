import { useState } from "react";
import { api } from "../lib/api";
import Modal from "./ui/Modal";

export default function EditTenantModal({
  tenant,
  open,
  onClose,
  onSaved,
  onDeleted,
}) {
  const [form, setForm] = useState({
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    phone: tenant.phone,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const busy = saving || deleting;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;

    setSaving(true);
    setError("");
    try {
      const data = await api(`/tenants/${tenant.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      onSaved(data.tenant);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (busy) return;

    setDeleting(true);
    setError("");
    try {
      await api(`/tenants/${tenant.id}`, { method: "DELETE" });
      onDeleted();
      onClose();
    } catch (err) {
      setConfirmDelete(false);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const field =
    "w-full px-4 py-2.5 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";
  const label = "block text-sm font-medium text-ebony mb-1.5";

  return (
    <Modal open={open} onClose={onClose} title="Edit tenant">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className={label}>
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
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
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={label}>
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className={field}
          />
          <p className="mt-1 text-xs text-ebony/50">
            Used to reach them on WhatsApp.
          </p>
        </div>

        {error && <p className="text-sm text-brick">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={busy}
            className="bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-ebony/60 hover:text-bayou"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-paper">
        {confirmDelete ? (
          <div>
            <p className="text-sm text-ebony/70 leading-relaxed mb-3">
              Remove {tenant.firstName} and their lease from this unit? This
              can't be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="bg-brick text-white text-sm font-medium px-6 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50"
              >
                {deleting ? "Removing…" : "Yes, remove them"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-sm text-ebony/60 hover:text-bayou"
              >
                Keep tenant
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-brick hover:underline"
          >
            Remove tenant
          </button>
        )}
      </div>
    </Modal>
  );
}