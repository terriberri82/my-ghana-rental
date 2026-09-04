import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import useApi from "../hooks/useApi";
import { signupRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, isError, errMessage, request } = useApi();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "landlord",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await request(signupRequest, formData);

    if (response) {
      login(response.data.user, response.data.tokens);
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="px-6 py-16 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create your account</h1>

      {isError && (
        <p className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {errMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="First name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Ama"
        />

        <FormInput
          label="Last name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Mensah"
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <FormInput
          label="Phone number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0244000000"
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="border rounded px-3 py-2 w-full pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-medium text-gray-700">
            I am a
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="landlord">Landlord or property owner</option>
            <option value="tenant">Tenant</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-700 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
