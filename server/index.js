const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { read, write, id } = require("./store");

const app = express();

const PORT = process.env.PORT || 5050;

const JWT_SECRET =
  process.env.JWT_SECRET || "blisscraft-events-local-secret";

app.use(cors());
app.use(express.json());

function auth(req, res, next) {
  const header = req.headers.authorization || "";

  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      error: "Sign in required."
    });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      error: "Session expired. Please sign in again."
    });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    name: "BlissCraft Events API"
  });
});

app.get("/api/services", (_req, res) => {
  res.json(read().services);
});

app.get("/api/testimonials", (_req, res) => {
  res.json(read().testimonials);
});

app.get("/api/gallery", (_req, res) => {
  res.json(read().gallery);
});

app.get("/api/events", (req, res) => {
  const { status } = req.query;

  let events = read().events;

  if (status) {
    events = events.filter((event) => event.status === status);
  }

  events = [...events].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  res.json(events);
});

app.get("/api/events/:eventId", (req, res) => {
  const event = read().events.find(
    (event) => event.id === req.params.eventId
  );

  if (!event) {
    return res.status(404).json({
      error: "Event not found."
    });
  }

  res.json(event);
});

app.post("/api/inquiries", (req, res) => {
  const {
    name,
    email,
    phone,
    eventType,
    date,
    guests,
    message
  } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Name, email, and a short brief are required."
    });
  }

  const db = read();

  const inquiry = {
    id: id(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || "").trim(),
    eventType: String(eventType || "Other").trim(),
    date: String(date || "").trim(),
    guests: String(guests || "").trim(),
    message: String(message).trim(),
    status: "new",
    createdAt: new Date().toISOString()
  };

  db.inquiries.unshift(inquiry);

  write(db);

  res.status(201).json({
    ok: true,
    id: inquiry.id
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  const db = read();

  if (
    email !== db.admin.email ||
    password !== db.admin.password
  ) {
    return res.status(401).json({
      error: "Incorrect email or password."
    });
  }

  const token = jwt.sign(
    {
      role: "admin",
      email
    },
    JWT_SECRET,
    {
      expiresIn: "12h"
    }
  );

  res.json({
    token,
    email
  });
});

app.get("/api/admin/stats", auth, (_req, res) => {
  const db = read();

  res.json({
    events: db.events.length,
    upcoming: db.events.filter(
      (event) => event.status === "upcoming"
    ).length,
    inquiries: db.inquiries.length,
    newInquiries: db.inquiries.filter(
      (inquiry) => inquiry.status === "new"
    ).length
  });
});

app.get("/api/admin/inquiries", auth, (_req, res) => {
  res.json(read().inquiries);
});

app.patch("/api/admin/inquiries/:inquiryId", auth, (req, res) => {
  const db = read();

  const inquiry = db.inquiries.find(
    (item) => item.id === req.params.inquiryId
  );

  if (!inquiry) {
    return res.status(404).json({
      error: "Inquiry not found."
    });
  }

  const allowed = [
    "new",
    "reviewing",
    "quoted",
    "booked",
    "closed"
  ];

  if (
    req.body.status &&
    !allowed.includes(req.body.status)
  ) {
    return res.status(400).json({
      error: "Invalid status."
    });
  }

  if (req.body.status) {
    inquiry.status = req.body.status;
  }

  write(db);

  res.json(inquiry);
});

app.delete("/api/admin/inquiries/:inquiryId", auth, (req, res) => {
  const db = read();

  const next = db.inquiries.filter(
    (item) => item.id !== req.params.inquiryId
  );

  if (next.length === db.inquiries.length) {
    return res.status(404).json({
      error: "Inquiry not found."
    });
  }

  db.inquiries = next;

  write(db);

  res.json({
    ok: true
  });
});

app.post("/api/admin/events", auth, (req, res) => {
  const {
    title,
    type,
    status,
    date,
    location,
    capacity,
    image,
    summary,
    description
  } = req.body || {};

  if (!title || !date || !location) {
    return res.status(400).json({
      error: "Title, date, and location are required."
    });
  }

  const db = read();

  const event = {
    id: id(),

    title: String(title).trim(),

    type: String(type || "Wedding").trim(),

    status: status === "past"
      ? "past"
      : "upcoming",

    date: String(date).trim(),

    location: String(location).trim(),

    capacity: Number(capacity) || 0,

    image:
      String(image || "").trim() ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",

    summary: String(summary || "").trim(),

    description: String(description || "").trim()
  };

  db.events.unshift(event);

  write(db);

  res.status(201).json(event);
});

app.put("/api/admin/events/:eventId", auth, (req, res) => {
  const db = read();

  const event = db.events.find(
    (item) => item.id === req.params.eventId
  );

  if (!event) {
    return res.status(404).json({
      error: "Event not found."
    });
  }

  const fields = [
    "title",
    "type",
    "status",
    "date",
    "location",
    "capacity",
    "image",
    "summary",
    "description"
  ];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  }

  if (event.status !== "past") {
    event.status = "upcoming";
  }

  event.capacity = Number(event.capacity) || 0;

  write(db);

  res.json(event);
});

app.delete("/api/admin/events/:eventId", auth, (req, res) => {
  const db = read();

  const next = db.events.filter(
    (event) => event.id !== req.params.eventId
  );

  if (next.length === db.events.length) {
    return res.status(404).json({
      error: "Event not found."
    });
  }

  db.events = next;

  write(db);

  res.json({
    ok: true
  });
});

const clientDist = path.join(
  __dirname,
  "..",
  "client",
  "dist"
);

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    res.sendFile(
      path.join(clientDist, "index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log(
    `BlissCraft Events API running on http://localhost:${PORT}`
  );
});