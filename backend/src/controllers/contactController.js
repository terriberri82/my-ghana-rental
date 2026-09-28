import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_MESSAGE_LENGTH = 2000;
const WINDOW_MS = 60 * 60 * 1000; // one hour
const MAX_PER_WINDOW = 5;

// Remembers how many messages each IP has sent in the last hour.
// In memory, so it resets when the server restarts. Fine at this size.
const recentSends = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const times = (recentSends.get(ip) || []).filter((t) => now - t < WINDOW_MS);

  if (times.length >= MAX_PER_WINDOW) {
    recentSends.set(ip, times);
    return true;
  }

  times.push(now);
  recentSends.set(ip, times);
  return false;
};

// Stops someone putting HTML in the form and having it render in the email.
const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Your name, email and message are all required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(cleanEmail)) {
      return res.status(400).json({
        message: "That doesn't look like a valid email address.",
      });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        message: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    if (isRateLimited(req.ip)) {
      return res.status(429).json({
        message: "You've sent a few messages already. Please try again later.",
      });
    }

    const safeName = escapeHtml(name.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");

    const { error } = await resend.emails.send({
      from: "My Ghana Rental <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: cleanEmail,
      subject: `Contact form: ${safeName}`,
      html: `
        <p><strong>From:</strong> ${safeName} (${escapeHtml(cleanEmail)})</p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error("sendContactMessage (resend):", error);
      return res.status(502).json({
        message: "Couldn't send your message. Please try again.",
      });
    }

    res.status(200).json({ message: "Message sent." });
  } catch (error) {
    console.error("sendContactMessage:", error);
    res.status(500).json({
      message: "Couldn't send your message. Please try again.",
    });
  }
};