import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";

function Login() {
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

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
  }

  return (
    <div className="px-6 py-16 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Log in</h1>

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
          className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          Log in
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
