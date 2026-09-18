import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/events/${id}`)
      .then(setEvent)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <section className="section page">
        <p className="eyebrow">Event</p>
        <h1>We couldn't find this event.</h1>
        <p>{error}</p>

        <Link className="btn" to="/events">
          Back to events
        </Link>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="section page">
        <p>Loading…</p>
      </section>
    );
  }

  return (
    <article className="section page detail">
      <img
        className="detail-hero"
        src={event.image}
        alt={event.title}
      />

      <p className="eyebrow">
        {event.type} · {event.status}
      </p>

      <h1>{event.title}</h1>

      <p className="meta-row">
        {formatDate(event.date)} · {event.location} · {event.capacity} guests
      </p>

      <p className="lede">{event.summary}</p>

      <p>{event.description}</p>

      <Link className="btn" to="/contact">
        Plan a similar celebration
      </Link>
    </article>
  );
}