import { useEffect, useState } from "react";
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

  return (
    <section className="section page">
      <div className="section-head">
        <p className="eyebrow">Gallery</p>

        <h1>Moments, details, and celebrations.</h1>

        <p className="lede narrow">
          A glimpse into the celebrations and details brought together by
          BlissCraft Events.
        </p>
      </div>

      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "chip on" : "chip"}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {shown.map((item) => (
          <figure key={item.id}>
            <img src={item.image} alt={item.title} />

            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.category}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="muted">
          Gallery images will appear here once they are added.
        </p>
      )}
    </section>
  );
}