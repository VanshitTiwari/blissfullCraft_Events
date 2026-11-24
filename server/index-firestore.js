require("dotenv").config();

const express = require("express");
const { rateLimit } = require("express-rate-limit");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const {
  getAll,
  getById,
  create,
  update,
  remove
} = require("./firestoreStore");

function id() {
  return randomUUID();
}

const app = express();
if (process.env.RENDER === "true") {
  app.set("trust proxy", 1);
}
const PORT = process.env.PORT || 5050;

/* -----------------------------
   Environment configuration
----------------------------- */

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (IS_PRODUCTION ? null : "blisscraft-events-local-secret");

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  (IS_PRODUCTION ? null : "admin@blisscraft.events");

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  (IS_PRODUCTION ? null : "blisscraft2026");

if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "ERROR: JWT_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD are required in production."
  );

  process.exit(1);
}

/* -----------------------------
   Middleware
----------------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://blisscraft-events.web.app",
  "https://blisscraft-events.firebaseapp.com",
  "https://blissfullcraft-events.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Origin not allowed by CORS")
      );
    }
  })
);

app.use(express.json());

/* -----------------------------
   Admin login rate limiting
----------------------------- */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  message: {
    error: "Too many login attempts. Please try again after 15 minutes."
  }
});

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
   Public API - Firestore
----------------------------- */

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    name: "BlissCraft Events API"
  });
});

app.get("/api/services", async (_req, res) => {
  try {
    res.json(await getAll("services"));
  } catch (error) {
    console.error("Services error:", error);

    res.status(500).json({
      error: "Unable to load services."
    });
  }
});

app.get("/api/testimonials", async (_req, res) => {
  try {
    res.json(await getAll("testimonials"));
  } catch (error) {
    console.error("Testimonials error:", error);

    res.status(500).json({
      error: "Unable to load testimonials."
    });
  }
});

app.get("/api/gallery", async (_req, res) => {
  try {
    res.json(await getAll("gallery"));
  } catch (error) {
    console.error("Gallery error:", error);

    res.status(500).json({
      error: "Unable to load gallery."
    });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const { status } = req.query;

    let events = await getAll("events");

    if (status) {
      events = events.filter(
        (event) => event.status === status
      );
    }

    events.sort((a, b) =>
      String(a.date || "").localeCompare(
        String(b.date || "")
      )
    );

    res.json(events);
  } catch (error) {
    console.error("Events error:", error);

    res.status(500).json({
      error: "Unable to load events."
    });
  }
});

app.get("/api/events/:eventId", async (req, res) => {
  try {
    const event = await getById(
      "events",
      req.params.eventId
    );

    if (!event) {
      return res.status(404).json({
        error: "Event not found."
      });
    }

    res.json(event);
  } catch (error) {
    console.error("Event detail error:", error);

    res.status(500).json({
      error: "Unable to load event."
    });
  }
});

/* -----------------------------
   Customer enquiries - Firestore
----------------------------- */

app.post("/api/inquiries", async (req, res) => {
  try {
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
        error: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
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
        error: "Please provide a little more information about your decoration requirements."
      });
    }

    if (cleanMessage.length > 1000) {
      return res.status(400).json({
        error: "Message must be 1000 characters or fewer."
      });
    }

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

    await create("inquiries", inquiry);

    res.status(201).json({
      ok: true,
      id: inquiry.id
    });

  } catch (error) {
    console.error("Inquiry creation error:", error);

    res.status(500).json({
      error: "Unable to submit your enquiry. Please try again."
    });
  }
});

/* -----------------------------
   Admin authentication
   Protected by rate limiting
----------------------------- */
app.post("/api/auth/login", loginLimiter, (req, res) => {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();

  const password = String(req.body?.password || "");

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
   Admin statistics - Firestore
----------------------------- */

app.get("/api/admin/stats", auth, async (_req, res) => {
  try {
    const [events, inquiries] = await Promise.all([
      getAll("events"),
      getAll("inquiries")
    ]);

    res.json({
      events: events.length,

      upcoming: events.filter(
        (event) => event.status === "upcoming"
      ).length,

      inquiries: inquiries.length,

      newInquiries: inquiries.filter(
        (inquiry) => inquiry.status === "new"
      ).length
    });

  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      error: "Unable to load dashboard statistics."
    });
  }
});

/* -----------------------------
   Admin enquiries - Firestore
----------------------------- */

app.get("/api/admin/inquiries", auth, async (_req, res) => {
  try {
    const inquiries = await getAll("inquiries");

    inquiries.sort((a, b) =>
      String(b.createdAt || "").localeCompare(
        String(a.createdAt || "")
      )
    );

    res.json(inquiries);

  } catch (error) {
    console.error("Admin inquiries error:", error);

    res.status(500).json({
      error: "Unable to load enquiries."
    });
  }
});

app.patch(
  "/api/admin/inquiries/:inquiryId",
  auth,
  async (req, res) => {
    try {
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

      const changes = {};

      if (req.body.status) {
        changes.status = req.body.status;
      }

      const inquiry = await update(
        "inquiries",
        req.params.inquiryId,
        changes
      );

      if (!inquiry) {
        return res.status(404).json({
          error: "Inquiry not found."
        });
      }

      res.json(inquiry);

    } catch (error) {
      console.error("Inquiry update error:", error);

      res.status(500).json({
        error: "Unable to update enquiry."
      });
    }
  }
);

app.delete(
  "/api/admin/inquiries/:inquiryId",
  auth,
  async (req, res) => {
    try {
      const deleted = await remove(
        "inquiries",
        req.params.inquiryId
      );

      if (!deleted) {
        return res.status(404).json({
          error: "Inquiry not found."
        });
      }

      res.json({
        ok: true
      });

    } catch (error) {
      console.error("Inquiry deletion error:", error);

      res.status(500).json({
        error: "Unable to delete enquiry."
      });
    }
  }
);

/* -----------------------------
   Admin decoration work - Firestore
----------------------------- */

app.post("/api/admin/events", auth, async (req, res) => {
  try {
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

    const event = {
      id: id(),

      title: String(title).trim(),

      type: String(type || "Wedding Function").trim(),

      status: status === "past" ? "past" : "upcoming",

      date: String(date).trim(),

      location: String(location).trim(),

      capacity: Number(capacity) || 0,

      image:
        String(image || "").trim() ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",

      summary: String(summary || "").trim(),

      description: String(description || "").trim()
    };

    await create("events", event);

    res.status(201).json(event);

  } catch (error) {
    console.error("Event creation error:", error);

    res.status(500).json({
      error: "Unable to create event."
    });
  }
});

app.put(
  "/api/admin/events/:eventId",
  auth,
  async (req, res) => {
    try {
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

      const existingEvent = await getById(
        "events",
        req.params.eventId
      );

      if (!existingEvent) {
        return res.status(404).json({
          error: "Event not found."
        });
      }

      const changes = {};

      for (const field of fields) {
        if (req.body[field] !== undefined) {
          changes[field] = req.body[field];
        }
      }

      const nextStatus =
        changes.status !== undefined
          ? changes.status
          : existingEvent.status;

      if (nextStatus !== "past") {
        changes.status = "upcoming";
      }

      const nextCapacity =
        changes.capacity !== undefined
          ? changes.capacity
          : existingEvent.capacity;

      changes.capacity = Number(nextCapacity) || 0;

      const event = await update(
        "events",
        req.params.eventId,
        changes
      );

      res.json(event);

    } catch (error) {
      console.error("Event update error:", error);

      res.status(500).json({
        error: "Unable to update event."
      });
    }
  }
);

app.delete(
  "/api/admin/events/:eventId",
  auth,
  async (req, res) => {
    try {
      const deleted = await remove(
        "events",
        req.params.eventId
      );

      if (!deleted) {
        return res.status(404).json({
          error: "Event not found."
        });
      }

      res.json({
        ok: true
      });

    } catch (error) {
      console.error("Event deletion error:", error);

      res.status(500).json({
        error: "Unable to delete event."
      });
    }
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
    `BlissCraft Events Firestore API running on port ${PORT}`
  );
});