import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="section page about">
      <div className="section-head">
        <p className="eyebrow">About BlissCraft Events</p>

        <h1>Beautiful decoration for celebrations that matter.</h1>

        <p className="lede narrow">
          BlissCraft Events is a Lucknow-based event decoration service
          creating beautiful setups for birthdays, kitty parties, wedding
          functions, and all kinds of special celebrations. We focus on
          thoughtful decoration, creative details, and setups that make
          every occasion feel special.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-visual">
          <div className="about-monogram">
            <span>B</span>
            <small>BLISSCRAFT</small>
            <small>EVENTS</small>
          </div>
        </div>

        <div>
          <h2>Our approach to decoration</h2>

          <ol className="steps">
            <li>
              <strong>Understand</strong>
              <br />
              We begin by understanding your occasion, preferred theme,
              colours, venue, and the kind of decoration you have in mind.
            </li>

            <li>
              <strong>Create</strong>
              <br />
              We turn your ideas into a decoration concept that suits your
              celebration and creates the right atmosphere for the occasion.
            </li>

            <li>
              <strong>Decorate</strong>
              <br />
              From backdrops and balloons to floral arrangements and
              decorative details, we bring the chosen setup together with
              care and attention to detail.
            </li>

            <li>
              <strong>Celebrate</strong>
              <br />
              Our goal is simple — to give your celebration a beautiful
              setting that you and your guests will enjoy and remember.
            </li>
          </ol>

          <Link className="btn" to="/contact">
            Enquire for decoration
          </Link>
        </div>
      </div>

      <div className="about-bottom">
        <p className="eyebrow">Where we decorate</p>

        <h2>Celebrations across Lucknow.</h2>

        <p>
          BlissCraft Events provides decoration services across Lucknow,
          including Gomti Nagar, Hazratganj, Aliganj, Indira Nagar,
          Alambagh, and nearby areas.
        </p>
      </div>
    </section>
  );
}