const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data", "db.json");

function ensureFile() {
  const dir = path.dirname(DATA_FILE);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(createSeed(), null, 2)
    );
  }
}

function read() {
  ensureFile();

  return JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );
}

function write(db) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(db, null, 2)
  );
}

function id() {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function createSeed() {
  return {
    admin: {
      email: "admin@blisscraft.events",
      password: "blisscraft2026"
    },

    services: [
      {
        id: "weddings",
        title: "Weddings",
        subtitle: "Beautifully planned wedding celebrations",
        description:
          "From intimate ceremonies to grand celebrations, BlissCraft Events helps bring your wedding vision together with thoughtful planning and attention to detail.",
        includes: [
          "Wedding planning and coordination",
          "Theme and celebration concepts",
          "Venue and setup coordination",
          "Decor and event arrangements",
          "Guest experience planning"
        ]
      },

      {
        id: "birthdays",
        title: "Birthdays",
        subtitle: "Make every birthday worth remembering",
        description:
          "Celebrate another wonderful year with a birthday experience designed around your personality, preferences, and the people who matter most.",
        includes: [
          "Birthday party planning",
          "Theme and decoration ideas",
          "Venue and setup arrangements",
          "Party coordination",
          "Special touches and finishing details"
        ]
      },

      {
        id: "kitty-parties",
        title: "Kitty Parties",
        subtitle: "Fun gatherings with thoughtful details",
        description:
          "BlissCraft Events helps create enjoyable kitty parties with attractive setups, smooth arrangements, and a celebration your guests can enjoy.",
        includes: [
          "Kitty party planning",
          "Theme and decoration arrangements",
          "Venue setup",
          "Guest arrangements",
          "Event-day coordination"
        ]
      },

      {
        id: "all-parties",
        title: "All Kinds of Parties",
        subtitle: "Your occasion, your way",
        description:
          "Whether you are planning an intimate gathering, a family celebration, or a lively party, we help turn your ideas into a memorable occasion.",
        includes: [
          "Party planning and coordination",
          "Theme and decoration concepts",
          "Venue and setup arrangements",
          "Celebration planning",
          "Event-day coordination"
        ]
      }
    ],

    /*
      Real client testimonials can be added later.
      We are keeping this empty instead of inventing reviews.
    */
    testimonials: [],

    /*
      Real client/event photographs can be added later.
      We are keeping this empty instead of presenting stock
      photographs as BlissCraft Events' actual work.
    */
    gallery: [],

    /*
      Real events can be added from the Admin Dashboard.
      We are keeping this empty instead of inventing client events.
    */
    events: [],

    inquiries: []
  };
}

module.exports = {
  read,
  write,
  id,
  DATA_FILE
};