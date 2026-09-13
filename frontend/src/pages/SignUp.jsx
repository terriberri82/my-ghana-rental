import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupRequest } from "../api/authApi";
import Modal from "../components/ui/Modal";
import sideImage from "../assets/townhouse-dusk-tall.jpg";

function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (form.password !== form.confirmPassword) {
      setError("Your passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await signupRequest({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        password: form.password,
      });
      login(data.user, data.tokens);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full px-4 py-3 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";

  const label = "block text-sm font-medium text-ebony mb-1.5";

  return (
    <div className="md:grid md:grid-cols-2 md:min-h-screen">
      <div className="relative h-72 md:h-auto order-2 md:order-1">
        <img
          src={sideImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_55%]"
        />
        <div className="absolute inset-0 bg-bayou/25" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
          <p className="font-display text-lg md:text-xl text-paper leading-snug max-w-[220px]">
            Every unit, every payment, one record.
          </p>
        </div>
      </div>

      <div className="flex items-center px-6 md:px-14 pt-32 pb-16 order-1 md:order-2">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-bayou">
            Start here.
          </h1>
          <p className="mt-2 text-ebony/65">
            Set up your properties in a few minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
                  placeholder="Mensah"
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
                placeholder="024 123 4567"
                className={field}
              />
            </div>

            <div>
              <label htmlFor="password" className={label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={field}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={label}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={field}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sun text-ebony font-medium text-sm py-3 rounded-full hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-ebony/65">
            Already have an account?{" "}
            <Link to="/login" className="text-bayou font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <Modal
        open={Boolean(error)}
        onClose={() => setError("")}
        title="Couldn't create your account"
      >
        {error}
      </Modal>
    </div>
  );
}

export default Signup;