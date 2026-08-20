import { useState } from "react";
import FormInput from "../components/FormInput";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
    <div>
      <section className="px-6 py-16 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Talk to a real person</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-600 text-white py-2 rounded hover:bg-blue-800"
          >
            Send message
          </button>
        </form>
      </section>
    </div>
  );
}

export default Contact;
