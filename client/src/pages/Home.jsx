import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api("/api/events?status=upcoming").then((data) =>
      setEvents(data.slice(0, 3))
    );

    api("/api/testimonials").then(setTestimonials);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            Event organisers · Lucknow · Kanpur · Banaras · Raebareli
          </p>

          <h1>Beautiful occasions, thoughtfully brought to life.</h1>

          <p className="lede">
            BlissCraft Events creates memorable celebrations with thoughtful
            planning, elegant details, and seamless execution — from the first
            idea to the final guest departure.
          </p>

          <div className="hero-actions">
            <Link className="btn" to="/contact">
              Plan an event
            </Link>

            <Link className="btn ghost" to="/gallery">
              View the work
            </Link>
          </div>
        </div>

        <div className="hero-frame">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80"
            alt="Elegant wedding celebration"
          />

          <p className="caption">
            BlissCraft Events · Celebrations crafted with care
          </p>
        </div>
      </section>

      <section className="band">
        <div className="stats">
          <div>
            <strong>4</strong>
            <span>cities we serve</span>
          </div>

          <div>
            <strong>4</strong>
            <span>ways to celebrate</span>
          </div>

          <div>
            <strong>1</strong>
            <span>dedicated approach</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">What we create</p>

          <h2>Celebrations made for your moments.</h2>
        </div>

        <div className="card-grid four">
          {[
            [
              "Weddings",
              "Thoughtfully planned wedding celebrations with elegant details and a smooth experience for you and your guests."
            ],
            [
              "Birthdays",
              "Memorable birthday celebrations designed around your occasion, personality, and vision."
            ],
            [
              "Kitty Parties",
              "Fun and beautifully arranged kitty parties planned to create an enjoyable experience for every guest."
            ],
            [
              "All Kinds of Parties",
              "From intimate gatherings to lively celebrations, we help bring your ideas together with care and creativity."
            ]
          ].map(([title, text]) => (
            <article key={title} className="card">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <Link className="text-link" to="/services">
          Explore services →
        </Link>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Diary</p>

          <h2>Upcoming celebrations</h2>
        </div>

        <div className="event-list">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="event-row"
            >
              <img src={event.image} alt="" />

              <div>
                <p className="meta">
                  {event.type} · {formatDate(event.date)}
                </p>

                <h3>{event.title}</h3>

                <p>{event.location}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link className="text-link" to="/events">
          All events →
        </Link>
      </section>

      <section className="section quotes">
        <div className="section-head">
          <p className="eyebrow">Clients</p>

          <h2>What hosts remember</h2>
        </div>

        <div className="card-grid three">
          {testimonials.map((item) => (
            <blockquote key={item.id} className="quote">
              <p>“{item.quote}”</p>

              <footer>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}