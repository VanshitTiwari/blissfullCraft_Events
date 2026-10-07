import { useState } from "react";
import { api } from "../api.js";

const empty = {
  name: "",
  email: "",
  phone: "",
  eventType: "Wedding Function",
  date: "",
  guests: "",
  message: ""
};

function validate(form) {
  const errors = {};

  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const guests = form.guests.trim();
  const message = form.message.trim();

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  } else if (!/[A-Za-z]/.test(name)) {
    errors.name = "Please enter a valid name.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Please enter your mobile number.";
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone =
      "Enter a valid 10-digit Indian mobile number.";
  } else if (/^(\d)\1{9}$/.test(phone)) {
    errors.phone = "Please enter a valid mobile number.";
  }

  if (!form.date) {
    errors.date = "Please select your preferred date.";
  } else {
    const selected = new Date(
      `${form.date}T00:00:00`
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selected.getTime())) {
      errors.date = "Please select a valid date.";
    } else if (selected < today) {
      errors.date =
        "Please choose today or a future date.";
    }
  }

  if (!guests) {
    errors.guests = "Please enter the number of guests.";
  } else if (!/^\d+$/.test(guests)) {
    errors.guests = "Guest count must contain numbers only.";
  } else {
    const count = Number(guests);

    if (count < 1 || count > 1000) {
      errors.guests =
        "Guest count must be between 1 and 1000.";
    }
  }

  if (!message) {
    errors.message =
      "Please tell us a little about your decoration requirements.";
  } else if (message.length < 10) {
    errors.message =
      "Please provide a little more information.";
  } else if (message.length > 1000) {
    errors.message =
      "Message must be 1000 characters or fewer.";
  }

  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    type: "",
    text: ""
  });
  const [sending, setSending] = useState(false);

  function update(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }

    if (status.text) {
      setStatus({
        type: "",
        text: ""
      });
    }
  }

  async function submit(e) {
    e.preventDefault();

    setStatus({
      type: "",
      text: ""
    });

    const validationErrors = validate(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];

      const element =
        document.querySelector(
          `[name="${firstError}"]`
        );

      if (element) {
        element.focus();
      }

      return;
    }

    setSending(true);

    try {
      await api("/api/inquiries", {
        method: "POST",
        body: {
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          guests: form.guests.trim(),
          message: form.message.trim()
        }
      });

      setForm(empty);
      setErrors({});

      setStatus({
        type: "ok",
        text:
          "Thank you. Your decoration enquiry has been received. We will get back to you soon."
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

        <h1>Let's decorate your celebration.</h1>

        <p className="lede">
          Tell us about your occasion, preferred date, venue,
          and decoration requirements. BlissCraft Events provides
          beautiful event decoration across Lucknow for birthdays,
          kitty parties, wedding functions, and all kinds of
          special celebrations.
        </p>

        <div className="contact-meta">
          <p>
            <strong>BlissCraft Events</strong>
            <br />
            Lucknow
            <br />
            Gomti Nagar · Hazratganj
            <br />
            Aliganj · Indira Nagar · Alambagh
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

      <form className="form" onSubmit={submit} noValidate>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={update}
            placeholder="Your full name"
            autoComplete="name"
            required
          />

          {errors.name && (
            <span className="field-error">
              {errors.name}
            </span>
          )}
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={update}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          {errors.email && (
            <span className="field-error">
              {errors.email}
            </span>
          )}
        </label>

        <label>
          Phone
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={update}
            placeholder="10-digit mobile number"
            inputMode="numeric"
            maxLength="10"
            autoComplete="tel"
            required
          />

          {errors.phone && (
            <span className="field-error">
              {errors.phone}
            </span>
          )}
        </label>

        <label>
          Decoration type
          <select
            name="eventType"
            value={form.eventType}
            onChange={update}
          >
            <option>Wedding Function</option>
            <option>Birthday Decoration</option>
            <option>Kitty Party Decoration</option>
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
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            required
          />

          {errors.date && (
            <span className="field-error">
              {errors.date}
            </span>
          )}
        </label>

        <label>
          Guest count
          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={update}
            placeholder="e.g. 100"
            min="1"
            max="1000"
            step="1"
            inputMode="numeric"
            required
          />

          {errors.guests && (
            <span className="field-error">
              {errors.guests}
            </span>
          )}
        </label>

        <label className="full">
          Tell us about your decoration
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={update}
            maxLength="1000"
            placeholder="Tell us about your celebration, theme, decoration ideas, venue, or anything else you'd like us to know."
            required
          />

          {errors.message && (
            <span className="field-error">
              {errors.message}
            </span>
          )}

          <span className="field-hint">
            {form.message.length}/1000
          </span>
        </label>

        <button
          className="btn"
          type="submit"
          disabled={sending}
        >
          {sending
            ? "Sending…"
            : "Send decoration enquiry"}
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