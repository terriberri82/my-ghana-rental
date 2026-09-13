import { useState } from "react";
import heroImage from "../assets/house-garden-tall.jpg";

function ContactLine({ label, href, value }) {
  const Tag = href ? "a" : "p";
  return (
    <div className="border-l-2 border-sun pl-5">
      <h3 className="font-display font-semibold text-bayou">{label}</h3>
      <Tag
        href={href}
        className="mt-1.5 block text-sm text-ebony/70 hover:text-bayou"
      >
        {value}
      </Tag>
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  const field =
    "w-full px-4 py-3 rounded-sm bg-white border border-pearl text-ebony placeholder:text-ebony/35 focus:outline-none focus:border-bayou focus:ring-1 focus:ring-bayou";

  return (
    <div>
      <section className="md:grid md:grid-cols-[55%_45%] bg-bayou">
        <div className="px-6 md:px-14 py-20 md:py-28 flex items-center">
          <div>
            <p className="text-sun text-xs mb-4">Contact</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-paper leading-[1.15]">
              Questions about your rentals?
            </h1>
            <p className="mt-5 text-paper/70 leading-relaxed max-w-md">
              Whether you're setting up your first property or something isn't
              working the way you expect, send a message and you'll hear back.
            </p>
          </div>
        </div>

        <div className="relative h-56 md:h-auto">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-14 py-20">
        <div className="grid md:grid-cols-[55%_45%] gap-12 md:gap-20">
          <div>
            {sent ? (
              <div className="border-l-2 border-sun pl-6 py-2">
                <h2 className="font-display text-2xl font-semibold text-bayou">
                  Message sent
                </h2>
                <p className="mt-3 text-ebony/70 leading-relaxed">
                  Thanks, {form.name || "there"}. You'll get a reply at the
                  address you gave within a day or two.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="mt-6 text-sm text-bayou underline hover:no-underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-ebony mb-1.5"
                  >
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Ama Boateng"
                    className={field}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ebony mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="ama@example.com"
                    className={field}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ebony mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us what you need help with."
                    className={`${field} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-sun text-ebony font-medium text-sm px-7 py-3 rounded-full hover:brightness-95 transition-colors"
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-10">
            <ContactLine
              label="Email"
              href="mailto:hello@myghanarental.com"
              value="hello@myghanarental.com"
            />
            <ContactLine
              label="WhatsApp"
              href="https://wa.me/233000000000"
              value="+233 00 000 0000"
            />
            <ContactLine label="Based in" value="Accra, Ghana" />

            <div className="bg-pearl/40 p-6 rounded-sm">
              <h3 className="font-display font-semibold text-bayou">
                Already have an account?
              </h3>
              <p className="mt-2 text-sm text-ebony/65 leading-relaxed">
                If something's broken while you're managing a property, log in
                first and send the message from there so we know which account
                to look at.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;