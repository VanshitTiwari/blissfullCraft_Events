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

    services: [
      {
        id: "wedding-functions",
        title: "Wedding Functions",
        subtitle: "Beautiful decoration for your special functions",
        description:
          "BlissCraft Events creates elegant decoration setups for Haldi, Mehndi, Sangeet, Engagement, and other wedding functions, designed around your theme and celebration.",
        includes: [
          "Haldi decoration",
          "Mehndi decoration",
          "Sangeet decoration",
          "Engagement decoration",
          "Theme-based decor and setup"
        ]
      },

      {
        id: "birthday-decoration",
        title: "Birthday Decoration",
        subtitle: "Make every birthday look unforgettable",
        description:
          "Beautiful birthday decoration created around your preferred theme, colours, and personal style.",
        includes: [
          "Birthday backdrop decoration",
          "Theme-based decoration",
          "Balloon and floral decor",
          "Cake table decoration",
          "Personalised decorative details"
        ]
      },

      {
        id: "kitty-party-decoration",
        title: "Kitty Party Decoration",
        subtitle: "Beautiful setups for memorable gatherings",
        description:
          "Attractive and lively decoration setups for kitty parties, created to make every gathering feel special.",
        includes: [
          "Theme-based kitty party decor",
          "Table and backdrop decoration",
          "Balloon and floral arrangements",
          "Photo corner decoration",
          "Finishing decorative details"
        ]
      },

      {
        id: "all-kinds-of-parties",
        title: "All Kinds of Parties",
        subtitle: "Your celebration, beautifully decorated",
        description:
          "Creative decoration for all kinds of parties, family celebrations, intimate gatherings, and special occasions according to your theme and preferences.",
        includes: [
          "Party theme decoration",
          "Backdrop decoration",
          "Balloon and floral arrangements",
          "Table and venue decor",
          "Creative decorative details"
        ]
      }
    ],

    // Real client testimonials can be added later.
    // We are keeping this empty instead of inventing reviews.
    testimonials: [],

    // Real client/event photographs can be added later.
    // We are keeping this empty instead of presenting stock
    // photographs as BlissCraft Events' actual work.
    gallery: [],

    // Real events can be added from the Admin Dashboard.
    // We are keeping this empty instead of inventing client events.
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