import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
      title: "All Kinds of Parties",
      subtitle: "Your occasion, your way",
      description:
        "Whether you are planning an intimate gathering, a family celebration, or a lively party, we help turn your ideas into a memorable occasion.",
      includes: [
        "Party planning and coordination",
        "Theme and decoration concepts",
        "Venue and setup arrangements",
        "Entertainment and celebration planning",
        "Event-day coordination"
      ]
    }
  ];

  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">Services</p>

        <h1>Celebrations planned around you.</h1>

        <p className="lede narrow">
          Every celebration is different. BlissCraft Events helps you plan and
          organise your special occasions with thoughtful ideas, beautiful
          details, and careful coordination.
        </p>
      </div>

      <div className="service-stack">
        {services.map((service) => (
          <article key={service.id} className="service">
            <div>
              <h2>{service.title}</h2>

              <p className="subtitle">{service.subtitle}</p>

              <p>{service.description}</p>
            </div>

            <ul>
              {service.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <Link className="btn" to="/contact">
        Plan your celebration
      </Link>
    </section>
  );
}