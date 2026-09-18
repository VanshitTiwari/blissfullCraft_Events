import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api("/api/events").then(setEvents);
  }, []);

  const shown = events.filter((event) =>
    filter === "all" ? true : event.status === filter
  );

  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">Events</p>

        <h1>Celebrations worth remembering.</h1>

        <p className="lede narrow">
          Explore celebrations and occasions organised through BlissCraft
          Events. Each event is shaped around the people, place, and moments
          that make it special.
        </p>
      </div>

      <div className="filters">
        {["all", "upcoming", "past"].map((key) => (
          <button
            key={key}
            className={filter === key ? "chip on" : "chip"}
            onClick={() => setFilter(key)}
          >
            {key === "all"
              ? "All"
              : key === "upcoming"
              ? "Upcoming"
              : "Past"}
          </button>
        ))}
      </div>

      <div className="card-grid two">
        {shown.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="event-card"
          >
            <img src={event.image} alt={event.title} />

            <div className="event-card-body">
              <p className="meta">
                {event.type} · {formatDate(event.date)} · {event.status}
              </p>

              <h2>{event.title}</h2>

              <p>{event.summary}</p>

              <p className="muted">{event.location}</p>
            </div>
          </Link>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="empty-state">
          <p>No events are currently available in this category.</p>
        </div>
      )}
    </section>
  );
}