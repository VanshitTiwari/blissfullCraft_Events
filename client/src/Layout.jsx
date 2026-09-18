import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="brand">
          <span className="brand-mark">B</span>

          <span>
            BlissCraft
            <small>Events</small>
          </span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/about">About</NavLink>

          <NavLink to="/contact" className="nav-cta">
            Enquire
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <p className="brand-word">BlissCraft Events</p>

            <p className="muted">
              Event planning and celebration services for weddings, birthdays,
              kitty parties, and all kinds of special occasions.
            </p>
          </div>

          <div>
            <p className="footer-label">Serving</p>

            <p>Lucknow · Kanpur</p>
            <p>Banaras · Raebareli</p>
          </div>

          <div>
            <p className="footer-label">Contact</p>

            <p>7080358105</p>
            <p>9696447441</p>

            <a
              href="https://www.instagram.com/solosiren/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram · @solosiren
            </a>
          </div>

          <div>
            <p className="footer-label">Visit</p>

            <p>
              <NavLink to="/contact">Start an enquiry</NavLink>
            </p>

            <p>
              <NavLink to="/admin">Client / admin</NavLink>
            </p>
          </div>
        </div>

        <p className="legal">
          © {new Date().getFullYear()} BlissCraft Events. All rights reserved.
        </p>
      </footer>
    </>
  );
}