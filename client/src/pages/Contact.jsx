import { useState } from "react";
import { api } from "../api.js";

const empty = {
  name: "",
  email: "",
  phone: "",
  eventType: "Wedding",
  date: "",
  guests: "",
  message: ""
};

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();

    setSending(true);
    setStatus({ type: "", text: "" });

    try {
      await api("/api/inquiries", {
        method: "POST",
        body: form
      });

      setForm(empty);

      setStatus({
        type: "ok",
        text: "Thank you. Your enquiry has been received. We will get back to you soon."
      });
    } catch (err) {
      setStatus({
        type: "err",
        text: err.message
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section page contact">
      <div>
        <p className="eyebrow">Enquire</p>

        <h1>Let's plan your celebration.</h1>

        <p className="lede">
          Tell us about your occasion, preferred date, location, and guest
          count. We'll get in touch to discuss your celebration and how
          BlissCraft Events can help.
        </p>

        <div className="contact-meta">
          <p>
            <strong>BlissCraft Events</strong>
            <br />
            Lucknow · Kanpur
            <br />
            Banaras · Raebareli
          </p>

          <p>
            <strong>Call us</strong>
            <br />
            7080358105
            <br />
            9696447441
          </p>

          <p>
            <strong>Instagram</strong>
            <br />
            <a
              href="https://www.instagram.com/solosiren/"
              target="_blank"
              rel="noreferrer"
            >
              @solosiren
            </a>
          </p>
        </div>
      </div>

      <form className="form" onSubmit={submit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={update}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={update}
            required
          />
        </label>

        <label>
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={update}
            placeholder="Your phone number"
          />
        </label>

        <label>
          Event type
          <select
            name="eventType"
            value={form.eventType}
            onChange={update}
          >
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Kitty Party</option>
            <option>All Kinds of Parties</option>
          </select>
        </label>

        <label>
          Preferred date
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={update}
          />
        </label>

        <label>
          Guest count
          <input
            name="guests"
            value={form.guests}
            onChange={update}
            placeholder="e.g. 100"
          />
        </label>

        <label className="full">
          Tell us about your celebration
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={update}
            placeholder="Tell us about your event, ideas, requirements, venue, or anything else you'd like us to know."
            required
          />
        </label>

        <button
          className="btn"
          type="submit"
          disabled={sending}
        >
          {sending ? "Sending…" : "Send enquiry"}
        </button>

        {status.text && (
          <p
            className={
              status.type === "ok"
                ? "note ok"
                : "note err"
            }
          >
            {status.text}
          </p>
        )}
      </form>
    </section>
  );
}