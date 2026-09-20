import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/app/PageHeader";
import Modal from "../components/ui/Modal";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingDetails, setSavingDetails] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setDetails({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      email: user.email || "",
    });
  }, [user]);

  function handleDetails(e) {
    setDetails({ ...details, [e.target.name]: e.target.value });
  }

  function handlePasswords(e) {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }

  async function saveDetails(e) {
    e.preventDefault();
    if (savingDetails) return;

    setSavingDetails(true);
    try {
      const data = await api("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(details),
      });
      updateUser(data.user);
      setMessage("Your details have been updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingDetails(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (savingPassword) return;

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Your new passwords don't match.");
      return;
    }

    setSavingPassword(true);
    try {
      await api("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage("Your password has been changed.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  const field =
    "w-full px-4 py-2.5 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";
  const label = "block text-sm font-medium text-ebony mb-1.5";

  return (
    <div>
      <PageHeader
        title="Your profile"
        subtitle="Update your details and password."
      />

      <div className="max-w-xl space-y-10">
        <form onSubmit={saveDetails} className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-bayou">
            Your details
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={label}>
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                value={details.firstName}
                onChange={handleDetails}
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
                value={details.lastName}
                onChange={handleDetails}
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
              value={details.phone}
              onChange={handleDetails}
              required
              className={field}
            />
          </div>

          <div>
            <label htmlFor="email" className={label}>
              Email{" "}
              <span className="font-normal text-ebony/45">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={details.email}
              onChange={handleDetails}
              placeholder="ama@example.com"
              className={field}
            />
            <p className="mt-1 text-xs text-ebony/50">
              You can log in with either your phone or your email.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingDetails}
            className="bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingDetails ? "Saving…" : "Save details"}
          </button>
        </form>

        <form
          onSubmit={savePassword}
          className="space-y-4 pt-10 border-t border-pearl"
        >
          <h2 className="font-display text-lg font-semibold text-bayou">
            Change your password
          </h2>

          <div>
            <label htmlFor="currentPassword" className={label}>
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswords}
              required
              placeholder="••••••••"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className={label}>
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswords}
              required
              minLength={8}
              placeholder="••••••••"
              className={field}
            />
            <p className="mt-1 text-xs text-ebony/50">At least 8 characters.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={label}>
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handlePasswords}
              required
              placeholder="••••••••"
              className={field}
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-sun text-ebony font-medium text-sm px-7 py-2.5 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingPassword ? "Changing…" : "Change password"}
          </button>
        </form>
      </div>

      <Modal
        open={Boolean(message)}
        onClose={() => setMessage("")}
        title="Saved"
      >
        {message}
      </Modal>

      <Modal
        open={Boolean(error)}
        onClose={() => setError("")}
        title="Couldn't save"
      >
        {error}
      </Modal>
    </div>
  );
}