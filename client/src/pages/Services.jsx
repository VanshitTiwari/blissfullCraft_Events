import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      id: 1,
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
      id: 2,
      title: "Birthday Decoration",
      subtitle: "Make every birthday look unforgettable",
      description:
        "Celebrate another wonderful year with a beautiful birthday setup created around your preferred theme, colours, and personal style.",
      includes: [
        "Birthday backdrop decoration",
        "Theme-based decoration",
        "Balloon and floral decor",
        "Cake table decoration",
        "Personalised decorative details"
      ]
    },
    {
      id: 3,
      title: "Kitty Party Decoration",
      subtitle: "Beautiful setups for memorable gatherings",
      description:
        "BlissCraft Events creates attractive and lively decoration setups for kitty parties, with details that make the gathering feel special.",
      includes: [
        "Theme-based kitty party decor",
        "Table and backdrop decoration",
        "Balloon and floral arrangements",
        "Photo corner decoration",
        "Finishing decorative details"
      ]
    },
    {
      id: 4,
      title: "All Kinds of Parties",
      subtitle: "Your celebration, beautifully decorated",
      description:
        "From intimate gatherings to lively celebrations, we create decoration setups for all kinds of parties according to your occasion, theme, and preferences.",
      includes: [
        "Party theme decoration",
        "Backdrop decoration",
        "Balloon and floral arrangements",
        "Table and venue decor",
        "Creative decorative details"
      ]
    }
  ];

  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">Services</p>

        <h1>Beautiful decoration for every celebration.</h1>

        <p className="lede narrow">
          BlissCraft Events specialises in event decoration across Lucknow.
          From birthdays and kitty parties to Haldi, Mehndi, Sangeet,
          Engagements, and other celebrations, we create beautiful setups
          tailored to your occasion and style.
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
        Enquire for decoration
      </Link>
    </section>
  );
}