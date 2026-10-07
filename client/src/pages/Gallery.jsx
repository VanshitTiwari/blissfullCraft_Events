import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api("/api/gallery").then(setItems);
  }, []);

  const categories = [
    "All",
    ...new Set(items.map((item) => item.category))
  ];

  const shown =
    filter === "All"
      ? items
      : items.filter((item) => item.category === filter);

  const hasGallery = shown.length > 0;

  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">Gallery</p>

        <h1>Moments, details, and celebrations.</h1>

        <p className="lede narrow">
          A glimpse into the decoration work created by BlissCraft Events
          for celebrations across Lucknow.
        </p>
      </div>

      {items.length > 0 && (
        <div className="filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={filter === cat ? "chip on" : "chip"}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {hasGallery ? (
        <div className="gallery-grid">
          {shown.map((item) => (
            <figure key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
              />

              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <div className="gallery-empty-mark">
            B
          </div>

          <p className="eyebrow">
            Our work is coming here
          </p>

          <h2>
            Beautiful decorations deserve to be seen.
          </h2>

          <p>
            We are preparing this space for real BlissCraft Events
            decoration work. Once photographs are added, you will be
            able to explore our birthday, kitty party, wedding function,
            and celebration decorations here.
          </p>

          <Link className="btn" to="/contact">
            Enquire for decoration
          </Link>
        </div>
      )}
    </section>
  );
}