require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { read, write, id } = require("./store");

const app = express();

const PORT = process.env.PORT || 5050;

/* -----------------------------
   Environment configuration
----------------------------- */

const IS_PRODUCTION =
  process.env.NODE_ENV === "production";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (IS_PRODUCTION
    ? null
    : "blisscraft-events-local-secret");

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  (IS_PRODUCTION
    ? null
    : "admin@blisscraft.events");

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  (IS_PRODUCTION
    ? null
    : "blisscraft2026");

if (!JWT_SECRET) {
  console.error(
    "ERROR: JWT_SECRET environment variable is required in production."
  );
  process.exit(1);
}

if (!ADMIN_EMAIL) {
  console.error(
    "ERROR: ADMIN_EMAIL environment variable is required in production."
  );
  process.exit(1);
}

if (!ADMIN_PASSWORD) {
  console.error(
    "ERROR: ADMIN_PASSWORD environment variable is required in production."
  );
  process.exit(1);
}

/* -----------------------------
   Middleware
----------------------------- */

app.use(cors());
app.use(express.json());

/* -----------------------------
   Authentication
----------------------------- */

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

/* -----------------------------
   Validation helpers
----------------------------- */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidIndianPhone(phone) {
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return false;
  }

  if (/^(\d)\1{9}$/.test(phone)) {
    return false;
  }

  return true;
}

function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const selected = new Date(`${date}T00:00:00`);

  if (Number.isNaN(selected.getTime())) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return selected >= today;
}

/* -----------------------------
   Public API
----------------------------- */

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
    events = events.filter(
      (event) => event.status === status
    );
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

/* -----------------------------
   Customer enquiries
----------------------------- */

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

  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "")
    .trim()
    .toLowerCase();
  const cleanPhone = String(phone || "").trim();
  const cleanEventType = String(eventType || "").trim();
  const cleanDate = String(date || "").trim();
  const cleanGuests = String(guests || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName) {
    return res.status(400).json({
      error: "Please enter your name."
    });
  }

  if (cleanName.length < 2 || cleanName.length > 80) {
    return res.status(400).json({
      error: "Name must be between 2 and 80 characters."
    });
  }

  if (!/[A-Za-z]/.test(cleanName)) {
    return res.status(400).json({
      error: "Please enter a valid name."
    });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({
      error: "Please enter a valid email address."
    });
  }

  if (!isValidIndianPhone(cleanPhone)) {
    return res.status(400).json({
      error:
        "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
    });
  }

  const allowedEventTypes = [
    "Wedding Function",
    "Birthday Decoration",
    "Kitty Party Decoration",
    "All Kinds of Parties"
  ];

  if (!allowedEventTypes.includes(cleanEventType)) {
    return res.status(400).json({
      error: "Please select a valid decoration type."
    });
  }

  if (!isValidDate(cleanDate)) {
    return res.status(400).json({
      error: "Please select today or a future date."
    });
  }

  if (!/^\d+$/.test(cleanGuests)) {
    return res.status(400).json({
      error: "Guest count must contain numbers only."
    });
  }

  const guestCount = Number(cleanGuests);

  if (
    !Number.isInteger(guestCount) ||
    guestCount < 1 ||
    guestCount > 1000
  ) {
    return res.status(400).json({
      error: "Guest count must be between 1 and 1000."
    });
  }

  if (cleanMessage.length < 10) {
    return res.status(400).json({
      error:
        "Please provide a little more information about your decoration requirements."
    });
  }

  if (cleanMessage.length > 1000) {
    return res.status(400).json({
      error: "Message must be 1000 characters or fewer."
    });
  }

  const db = read();

  const inquiry = {
    id: id(),
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    eventType: cleanEventType,
    date: cleanDate,
    guests: String(guestCount),
    message: cleanMessage,
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

/* -----------------------------
   Admin authentication
----------------------------- */

app.post("/api/auth/login", (req, res) => {
  const email = String(
    req.body?.email || ""
  )
    .trim()
    .toLowerCase();

  const password = String(
    req.body?.password || ""
  );

  if (
    email !== ADMIN_EMAIL.toLowerCase() ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      error: "Incorrect email or password."
    });
  }

  const token = jwt.sign(
    {
      role: "admin",
      email: ADMIN_EMAIL
    },
    JWT_SECRET,
    {
      expiresIn: "12h"
    }
  );

  res.json({
    token,
    email: ADMIN_EMAIL
  });
});

/* -----------------------------
   Admin statistics
----------------------------- */

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

/* -----------------------------
   Admin enquiries
----------------------------- */

app.get("/api/admin/inquiries", auth, (_req, res) => {
  res.json(read().inquiries);
});

app.patch(
  "/api/admin/inquiries/:inquiryId",
  auth,
  (req, res) => {
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
  }
);

app.delete(
  "/api/admin/inquiries/:inquiryId",
  auth,
  (req, res) => {
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
  }
);

/* -----------------------------
   Admin decoration work
----------------------------- */

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

    type: String(
      type || "Wedding Function"
    ).trim(),

    status:
      status === "past"
        ? "past"
        : "upcoming",

    date: String(date).trim(),

    location: String(location).trim(),

    capacity: Number(capacity) || 0,

    image:
      String(image || "").trim() ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",

    summary: String(summary || "").trim(),

    description: String(
      description || ""
    ).trim()
  };

  db.events.unshift(event);

  write(db);

  res.status(201).json(event);
});

app.put(
  "/api/admin/events/:eventId",
  auth,
  (req, res) => {
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

    event.capacity =
      Number(event.capacity) || 0;

    write(db);

    res.json(event);
  }
);

app.delete(
  "/api/admin/events/:eventId",
  auth,
  (req, res) => {
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
  }
);

/* -----------------------------
   Production frontend
----------------------------- */

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

/* -----------------------------
   Start server
----------------------------- */

app.listen(PORT, () => {
  console.log(
    `BlissCraft Events API running on port ${PORT}`
  );
});