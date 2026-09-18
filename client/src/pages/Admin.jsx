import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearToken, getToken } from "../api.js";

const emptyEvent = {
  title: "",
  type: "Wedding",
  status: "upcoming",
  date: "",
  location: "",
  capacity: "",
  image: "",
  summary: "",
  description: ""
};

export default function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [tab, setTab] = useState("events");
  const [form, setForm] = useState(emptyEvent);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    const [s, e, i] = await Promise.all([
      api("/api/admin/stats", { auth: true }),
      api("/api/events", { auth: true }),
      api("/api/admin/inquiries", { auth: true })
    ]);

    setStats(s);
    setEvents(e);
    setInquiries(i);
  }

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin");
      return;
    }

    load().catch(() => {
      clearToken();
      navigate("/admin");
    });
  }, [navigate]);

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function saveEvent(e) {
    e.preventDefault();
    setMessage("");

    try {
      if (editing) {
        await api(`/api/admin/events/${editing}`, {
          method: "PUT",
          body: form,
          auth: true
        });
      } else {
        await api("/api/admin/events", {
          method: "POST",
          body: form,
          auth: true
        });
      }

      setForm(emptyEvent);
      setEditing(null);
      setMessage("Event saved successfully.");

      await load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function editEvent(event) {
    setEditing(event.id);

    setForm({
      title: event.title,
      type: event.type,
      status: event.status,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      image: event.image,
      summary: event.summary,
      description: event.description
    });

    setTab("events");
  }

  async function removeEvent(id) {
    if (!confirm("Delete this event?")) {
      return;
    }

    try {
      await api(`/api/admin/events/${id}`, {
        method: "DELETE",
        auth: true
      });

      await load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function setInquiryStatus(id, status) {
    try {
      await api(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        body: { status },
        auth: true
      });

      await load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function removeInquiry(id) {
    if (!confirm("Delete this enquiry?")) {
      return;
    }

    try {
      await api(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
        auth: true
      });

      await load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function logout() {
    clearToken();
    navigate("/admin");
  }

  return (
    <main className="admin">
      <header className="admin-bar">
        <div>
          <p className="eyebrow">BlissCraft Events</p>
          <h1>Admin dashboard</h1>
        </div>

        <button className="btn ghost" onClick={logout}>
          Sign out
        </button>
      </header>

      {stats && (
        <div className="stats admin-stats">
          <div>
            <strong>{stats.events}</strong>
            <span>Events</span>
          </div>

          <div>
            <strong>{stats.upcoming}</strong>
            <span>Upcoming</span>
          </div>

          <div>
            <strong>{stats.inquiries}</strong>
            <span>Enquiries</span>
          </div>

          <div>
            <strong>{stats.newInquiries}</strong>
            <span>New</span>
          </div>
        </div>
      )}

      <div className="filters">
        <button
          className={tab === "events" ? "chip on" : "chip"}
          onClick={() => setTab("events")}
        >
          Events
        </button>

        <button
          className={tab === "inquiries" ? "chip on" : "chip"}
          onClick={() => setTab("inquiries")}
        >
          Enquiries
        </button>
      </div>

      {tab === "events" && (
        <div className="admin-split">
          <form className="form compact" onSubmit={saveEvent}>
            <h2>{editing ? "Edit event" : "New event"}</h2>

            <label>
              Title
              <input
                name="title"
                value={form.title}
                onChange={update}
                required
              />
            </label>

            <label>
              Type
              <select
                name="type"
                value={form.type}
                onChange={update}
              >
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Kitty Party</option>
                <option>All Kinds of Parties</option>
              </select>
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={update}
              >
                <option value="upcoming">upcoming</option>
                <option value="past">past</option>
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={update}
                required
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={update}
                placeholder="e.g. Lucknow"
                required
              />
            </label>

            <label>
              Guest capacity
              <input
                name="capacity"
                value={form.capacity}
                onChange={update}
                placeholder="e.g. 150"
              />
            </label>

            <label>
              Image URL
              <input
                name="image"
                value={form.image}
                onChange={update}
                placeholder="https://..."
              />
            </label>

            <label className="full">
              Summary
              <textarea
                name="summary"
                rows="2"
                value={form.summary}
                onChange={update}
                placeholder="Short description of the event"
              />
            </label>

            <label className="full">
              Description
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={update}
                placeholder="Detailed description of the event"
              />
            </label>

            <div className="row-actions">
              <button className="btn" type="submit">
                {editing ? "Update event" : "Create event"}
              </button>

              {editing && (
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyEvent);
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            {message && (
              <p className="note ok">
                {message}
              </p>
            )}
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>{event.title}</strong>

                      <br />

                      <span className="muted">
                        {event.type} · {event.status}
                      </span>
                    </td>

                    <td>{event.date}</td>

                    <td>
                      <button
                        className="linkish"
                        onClick={() => editEvent(event)}
                      >
                        Edit
                      </button>

                      <button
                        className="linkish danger"
                        onClick={() => removeEvent(event.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {events.length === 0 && (
              <p className="muted">
                No events have been added yet.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "inquiries" && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Event</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {inquiries.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>

                    <br />

                    {item.email}

                    <br />

                    {item.phone && (
                      <>
                        {item.phone}
                        <br />
                      </>
                    )}

                    <span className="muted">
                      {item.message}
                    </span>
                  </td>

                  <td>
                    {item.eventType}

                    <br />

                    {item.date || "—"} · {item.guests || "?"} guests
                  </td>

                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        setInquiryStatus(
                          item.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="new">new</option>
                      <option value="reviewing">reviewing</option>
                      <option value="quoted">quoted</option>
                      <option value="booked">booked</option>
                      <option value="closed">closed</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="linkish danger"
                      onClick={() => removeInquiry(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {inquiries.length === 0 && (
            <p className="muted">
              No enquiries have been received yet.
            </p>
          )}
        </div>
      )}
    </main>
  );
}