import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Layout from "./Layout.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Gallery from "./pages/Gallery.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import Admin from "./pages/Admin.jsx";

import SiteIntro from "./components/SiteIntro.jsx";

export default function App() {
  const location = useLocation();

  /*
   * Show the BlissCraft intro only when the visitor
   * first opens the homepage in a browser session.
   */
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const introAlreadySeen =
        sessionStorage.getItem("blisscraftIntroSeen") === "true";

      if (introAlreadySeen) {
        return false;
      }

      return location.pathname === "/";
    } catch (error) {
      // If sessionStorage is unavailable,
      // still show the intro on the homepage.
      return location.pathname === "/";
    }
  });

  /*
   * If the visitor directly opens another page,
   * don't show the cinematic intro.
   */
  useEffect(() => {
    if (location.pathname !== "/") {
      setShowIntro(false);
    }
  }, [location.pathname]);

  /*
   * Called by SiteIntro after the upward
   * curtain animation has completed.
   */
  const handleEnterWebsite = () => {
    try {
      sessionStorage.setItem("blisscraftIntroSeen", "true");
    } catch (error) {
      // Ignore storage errors.
    }

    /*
     * SiteIntro itself performs the 1.2 second
     * upward animation before calling this function.
     *
     * This small delay makes sure the intro has
     * completely cleared the screen before React
     * removes it.
     */
    setTimeout(() => {
      setShowIntro(false);
    }, 50);
  };

  return (
    <>
      {/* =========================================
          BLISSCRAFT CINEMATIC INTRO
      ========================================= */}

      {showIntro && (
        <SiteIntro onEnter={handleEnterWebsite} />
      )}

      {/* =========================================
          WEBSITE ROUTES
      ========================================= */}

      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/events/:id"
            element={<EventDetail />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />
        </Route>

        {/* =========================================
            ADMIN ROUTES
        ========================================= */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<Admin />}
        />
      </Routes>
    </>
  );
}