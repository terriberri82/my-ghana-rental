import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import useApi from "../hooks/useApi";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, isError, errMessage, request } = useApi();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.email === "" || formData.password === "") {
      alert("Please fill in all fields");
      return;
    }

    const response = await request(loginRequest, formData);

    if (response) {
      login(response.data.user, response.data.tokens);
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <div className="px-6 py-16 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Log in</h1>

      {isError && (
        <p className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {errMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        No account yet?{" "}
        <Link to="/signup" className="text-blue-700 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;