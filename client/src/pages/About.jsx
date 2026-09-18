export default function About() {
  return (
    <section className="section page about">
      <div className="section-head">
        <p className="eyebrow">About BlissCraft Events</p>

        <h1>Thoughtful planning for celebrations that matter.</h1>

        <p className="lede narrow">
          BlissCraft Events brings together planning, creativity, and attention
          to detail to help make every celebration memorable. From intimate
          gatherings to joyful weddings and lively parties, we help turn your
          ideas into beautifully arranged occasions.
        </p>
      </div>

      <div className="about-grid">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80"
          alt="Elegant celebration dining setup"
        />

        <div>
          <h2>How we approach your celebration</h2>

          <ol className="steps">
            <li>
              <strong>Understand</strong>
              <br />
              We begin by understanding your occasion, preferences, guest
              requirements, location, and overall vision.
            </li>

            <li>
              <strong>Plan</strong>
              <br />
              We help shape the celebration with thoughtful ideas, arrangements,
              and attention to the details that make the occasion feel special.
            </li>

            <li>
              <strong>Organise</strong>
              <br />
              From the important arrangements to the finishing touches, we
              coordinate the details needed to bring your celebration together.
            </li>

            <li>
              <strong>Celebrate</strong>
              <br />
              Our goal is to help you enjoy your special occasion while your
              celebration comes together beautifully.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}