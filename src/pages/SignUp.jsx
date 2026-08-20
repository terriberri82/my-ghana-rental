import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "landlord",
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
      <h1 className="text-3xl font-bold mb-6">Create your account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Full name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ama Mensah"
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

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
        />

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
          className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          Create account
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
