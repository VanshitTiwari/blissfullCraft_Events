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
      {/* HERO */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            Event decoration · Lucknow · Gomti Nagar · Hazratganj · Aliganj ·
            Indira Nagar · Alambagh
          </p>

          <h1>
            Beautiful celebrations, beautifully decorated.
          </h1>

          <p className="lede">
            BlissCraft Events creates elegant and memorable decorations for
            birthdays, kitty parties, wedding functions, and all kinds of
            special celebrations across Lucknow — bringing your vision to life
            with care, creativity, and attention to detail.
          </p>

          <div className="hero-actions">
            <Link className="btn" to="/contact">
              Enquire for decoration
            </Link>

            <Link className="btn ghost" to="/gallery">
              View the work
            </Link>
          </div>
        </div>

        <div className="hero-frame">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80"
            alt="Elegant wedding decoration"
          />

          <p className="caption">
            BlissCraft Events · Decorations crafted with care
          </p>
        </div>
      </section>

      {/* SERVICE HIGHLIGHTS */}
      <section className="band">
        <div className="stats">
          <div>
            <strong>Lucknow</strong>
            <span>our service location</span>
          </div>

          <div>
            <strong>4</strong>
            <span>decoration categories</span>
          </div>

          <div>
            <strong>1</strong>
            <span>creative approach</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="section-head">
          <p className="eyebrow">What we decorate</p>

          <h2>
            Décor designed around your celebration.
          </h2>
        </div>

        <div className="card-grid four">
          {[
            [
              "Birthday Decoration",
              "Beautiful birthday setups created around your theme, occasion, and personal style."
            ],
            [
              "Kitty Party Decoration",
              "Elegant and lively decoration setups that make every kitty party feel special."
            ],
            [
              "Wedding Functions",
              "Decoration for Haldi, Mehndi, Sangeet, Engagement, and other wedding functions."
            ],
            [
              "All Kinds of Parties",
              "Creative decoration for intimate gatherings, family celebrations, and all kinds of parties."
            ]
          ].map(([title, text]) => (
            <article key={title} className="card">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <Link className="text-link" to="/services">
          Explore decoration services →
        </Link>
      </section>

      {/* UPCOMING EVENTS */}
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

      {/* TESTIMONIALS */}
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