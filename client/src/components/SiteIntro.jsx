import { useState } from "react";

export default function SiteIntro({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    if (exiting) return;

    setExiting(true);

    // Let the smooth upward transition finish.
    setTimeout(() => {
      onEnter();
    }, 1500);
  };

  return (
    <div className={`bc-intro ${exiting ? "bc-exiting" : ""}`}>
      {/* Soft transparent atmosphere */}
      <div className="bc-intro-atmosphere" />

      {/* This is the complete floating transparent layer */}
      <div className="bc-floating-layer">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="bc-logo-wrap">
          <div className="bc-logo-halo" />

          <div className="bc-logo-glass">
            <div className="bc-glass-shine" />

            <img
              src="/blisscraft-logo-transparent.png"
              alt="BlissCraft Events"
              className="bc-intro-logo"
            />
          </div>
        </div>


        {/* =====================================================
            ARROW
        ===================================================== */}

        <button
          type="button"
          className="bc-arrow-control"
          onClick={handleEnter}
          aria-label="Enter BlissCraft Events"
        >

          {/* Water ripple rings */}
          <span className="bc-water-ripple ripple-1" />
          <span className="bc-water-ripple ripple-2" />
          <span className="bc-water-ripple ripple-3" />
          <span className="bc-water-ripple ripple-4" />

          {/* Glass capsule */}
          <span className="bc-arrow-capsule">

            <span className="bc-capsule-shine" />

            {/* Thick arrow exactly as requested */}
            <span className="bc-bold-arrow">
              <span className="bc-arrow-shaft" />
              <span className="bc-arrow-left" />
              <span className="bc-arrow-right" />
            </span>

          </span>

        </button>
      </div>


      <style>{`

        /* =====================================================
           FULL INTRO
        ===================================================== */

        .bc-intro {
          position: fixed;
          inset: 0;

          width: 100%;
          height: 100%;

          z-index: 99999;

          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 50% 43%,
              rgba(255, 253, 248, 0.78) 0%,
              rgba(248, 242, 232, 0.58) 35%,
              rgba(244, 237, 225, 0.36) 65%,
              rgba(241, 232, 217, 0.18) 100%
            );

          backdrop-filter: blur(7px);
          -webkit-backdrop-filter: blur(7px);

          /*
             IMPORTANT:

             The COMPLETE transparent intro moves slightly.
             This is what makes the bottom of the real website
             become visible during the floating movement.
          */

          animation:
            introWaterFloat
            5.8s
            cubic-bezier(.45,.05,.55,.95)
            infinite;

          will-change: transform;
        }


        /* =====================================================
           COMPLETE INTRO FLOAT
        ===================================================== */

        @keyframes introWaterFloat {

          0% {
            transform: translateY(7px);
          }

          24% {
            transform: translateY(2px);
          }

          48% {
            transform: translateY(-10px);
          }

          64% {
            transform: translateY(-13px);
          }

          82% {
            transform: translateY(-4px);
          }

          100% {
            transform: translateY(7px);
          }
        }


        /* =====================================================
           ATMOSPHERE
        ===================================================== */

        .bc-intro-atmosphere {
          position: absolute;
          inset: -20%;

          pointer-events: none;

          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(176, 138, 74, 0.10),
              transparent 29%
            ),
            radial-gradient(
              circle at 50% 62%,
              rgba(122, 46, 42, 0.045),
              transparent 38%
            );

          animation:
            atmospherePulse
            6s
            ease-in-out
            infinite;
        }


        @keyframes atmospherePulse {

          0%,
          100% {
            opacity: .68;
            transform: scale(1);
          }

          50% {
            opacity: .95;
            transform: scale(1.035);
          }
        }


        /* =====================================================
           FLOATING CONTENT
        ===================================================== */

        .bc-floating-layer {
          position: relative;

          z-index: 5;

          width: 100%;
          height: 100%;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          pointer-events: none;
        }


        /* =====================================================
           LOGO
           KEEPING THE PREVIOUS PREMIUM LOGO EFFECT
        ===================================================== */

        .bc-logo-wrap {
          position: relative;

          width: min(76vw, 430px);
          height: min(76vw, 430px);

          display: flex;
          align-items: center;
          justify-content: center;

          pointer-events: none;
        }


        .bc-logo-halo {
          position: absolute;

          width: 84%;
          height: 84%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.58) 0%,
              rgba(255, 255, 255, 0.20) 38%,
              transparent 70%
            );

          filter: blur(18px);

          animation:
            logoHaloFloat
            5.8s
            ease-in-out
            infinite;
        }


        @keyframes logoHaloFloat {

          0%,
          100% {
            transform: scale(.94);
            opacity: .55;
          }

          50% {
            transform: scale(1.06);
            opacity: .88;
          }
        }


        .bc-logo-glass {
          position: relative;

          width: 88%;
          height: 88%;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at 35% 25%,
              rgba(255, 255, 255, 0.55),
              rgba(255, 255, 255, 0.16) 48%,
              rgba(255, 255, 255, 0.06) 100%
            );

          border: 1px solid rgba(255, 255, 255, 0.48);

          box-shadow:
            0 24px 70px rgba(92, 32, 29, 0.12),
            0 10px 35px rgba(176, 138, 74, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            inset 0 -20px 45px rgba(176, 138, 74, 0.045);

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);

          animation:
            logoBreathing
            5.8s
            ease-in-out
            infinite;
        }


        @keyframes logoBreathing {

          0%,
          100% {
            transform: translateY(8px);
          }

          50% {
            transform: translateY(-14px);
          }
        }


        .bc-glass-shine {
          position: absolute;

          inset: 5%;

          border-radius: 50%;

          background:
            linear-gradient(
              125deg,
              rgba(255,255,255,.52),
              transparent 28%,
              transparent 72%,
              rgba(255,255,255,.12)
            );

          pointer-events: none;
        }


        .bc-intro-logo {
          position: relative;
          z-index: 2;

          width: 78%;
          height: auto;

          object-fit: contain;

          filter:
            drop-shadow(
              0 12px 20px
              rgba(92,32,29,.10)
            )
            drop-shadow(
              0 3px 8px
              rgba(176,138,74,.12)
            );
        }


        /* =====================================================
           ARROW CONTROL
        ===================================================== */

        .bc-arrow-control {
          position: relative;

          width: 330px;
          height: 180px;

          margin-top: -28px;

          padding: 0;

          border: none;

          background: transparent;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          pointer-events: auto;

          outline: none;

          appearance: none;

          -webkit-tap-highlight-color: transparent;
        }


        /* =====================================================
           GLASS CAPSULE
        ===================================================== */

        .bc-arrow-capsule {

          position: relative;

          z-index: 10;

          width: 170px;
          height: 72px;

          border-radius: 999px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.30),
              rgba(255,255,255,.12)
            );

          border:
            1.5px solid
            rgba(255,255,255,.66);

          box-shadow:

            0 12px 35px
            rgba(92,32,29,.10),

            0 4px 15px
            rgba(176,138,74,.10),

            inset 0 2px 3px
            rgba(255,255,255,.72),

            inset 0 -12px 20px
            rgba(176,138,74,.045);

          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);

          animation:
            capsuleFloat
            3.8s
            cubic-bezier(.45,.05,.55,.95)
            infinite;

          will-change: transform;
        }


        /*
           THIS is the same type of smooth vertical
           floating motion visible in your video.
        */

        @keyframes capsuleFloat {

          0% {
            transform: translateY(6px);
          }

          35% {
            transform: translateY(-2px);
          }

          55% {
            transform: translateY(-9px);
          }

          76% {
            transform: translateY(-4px);
          }

          100% {
            transform: translateY(6px);
          }
        }


        /* =====================================================
           GLASS LIGHT
        ===================================================== */

        .bc-capsule-shine {
          position: absolute;

          top: 4px;
          left: 16px;
          right: 16px;

          height: 18px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.55),
              transparent
            );

          filter: blur(3px);

          opacity: .70;

          pointer-events: none;
        }


        /* =====================================================
           BOLD GOLD ARROW
        ===================================================== */

        .bc-bold-arrow {
          position: relative;

          width: 48px;
          height: 50px;

          display: block;

          transform: translateY(1px);

          filter:
            drop-shadow(
              0 3px 5px
              rgba(176,138,74,.35)
            );
        }


        .bc-arrow-shaft {
          position: absolute;

          left: 19px;
          top: 15px;

          width: 10px;
          height: 31px;

          border-radius: 8px;

          background:
            linear-gradient(
              180deg,
              #e0c17c 0%,
              #c19a55 100%
            );
        }


        .bc-arrow-left,
        .bc-arrow-right {

          position: absolute;

          top: 6px;

          width: 10px;
          height: 28px;

          border-radius: 8px;

          background:
            linear-gradient(
              180deg,
              #e0c17c 0%,
              #c19a55 100%
            );
        }


        .bc-arrow-left {
          left: 11px;
          transform: rotate(45deg);
        }


        .bc-arrow-right {
          right: 11px;
          transform: rotate(-45deg);
        }


        /* =====================================================
           WATER RIPPLE
        ===================================================== */

        .bc-water-ripple {

          position: absolute;

          z-index: 2;

          left: 50%;
          top: 59%;

          width: 155px;
          height: 42px;

          border-radius: 50%;

          border:
            1.5px solid
            rgba(176,138,74,.36);

          transform:
            translate(-50%, -50%)
            scale(.35);

          opacity: 0;

          pointer-events: none;

          /*
             A little glow makes the rings actually visible
             against the creamy transparent background.
          */

          box-shadow:
            0 0 12px
            rgba(176,138,74,.10),

            inset 0 0 10px
            rgba(255,255,255,.22);
        }


        /*
           Four rings = stone in still water.

           Slow expansion.
           Slow fade.
           No bouncing.
        */

        .ripple-1 {
          animation:
            waterRipple
            4.5s
            cubic-bezier(.22,.61,.36,1)
            infinite;
        }


        .ripple-2 {
          animation:
            waterRipple
            4.5s
            cubic-bezier(.22,.61,.36,1)
            1.12s
            infinite;
        }


        .ripple-3 {
          animation:
            waterRipple
            4.5s
            cubic-bezier(.22,.61,.36,1)
            2.24s
            infinite;
        }


        .ripple-4 {
          animation:
            waterRipple
            4.5s
            cubic-bezier(.22,.61,.36,1)
            3.36s
            infinite;
        }


        @keyframes waterRipple {

          0% {
            transform:
              translate(-50%,-50%)
              scale(.35);

            opacity: 0;
          }

          7% {
            opacity: .48;
          }

          30% {
            opacity: .30;
          }

          60% {
            opacity: .13;
          }

          100% {
            transform:
              translate(-50%,-50%)
              scale(2.25);

            opacity: 0;
          }
        }


        /* =====================================================
           HOVER
        ===================================================== */

        .bc-arrow-control:hover .bc-arrow-capsule {

          transform:
            translateY(-6px)
            scale(1.025);

          box-shadow:

            0 16px 40px
            rgba(92,32,29,.14),

            0 5px 18px
            rgba(176,138,74,.16),

            inset 0 2px 3px
            rgba(255,255,255,.86);
        }


        /* =====================================================
           CLICK
        ===================================================== */

        /*
           IMPORTANT:

           We STOP the normal floating animation.

           Then move the WHOLE transparent intro upward
           continuously and smoothly.

           No steps.
           No sudden jump.
           No 2.2-second weird pause.
        */

        .bc-intro.bc-exiting {

          animation:
            introExit
            1.5s
            cubic-bezier(.65,0,.35,1)
            forwards;

          pointer-events: none;
        }


        @keyframes introExit {

          0% {
            transform: translateY(0);
          }

          100% {
            /*
              Enough to expose the website from below,
              but not so much that it looks like a page
              suddenly flying away.
            */

            transform: translateY(-105%);
          }
        }


        /*
           The content follows the same movement,
           giving the feeling that the entire transparent
           glass layer is floating upward together.
        */

        .bc-intro.bc-exiting .bc-floating-layer {

          animation: none;
        }


        /*
           Keep the logo visible while it moves upward.
           It should not suddenly fade.
        */

        .bc-intro.bc-exiting .bc-logo-glass {

          animation: none;

          transform: translateY(0);
        }


        /*
           Arrow gently lifts first, then follows the
           complete intro movement.
        */

        .bc-intro.bc-exiting .bc-arrow-capsule {

          animation:
            arrowClickLift
            1.5s
            cubic-bezier(.65,0,.35,1)
            forwards;
        }


        @keyframes arrowClickLift {

          0% {
            transform: translateY(0);
          }

          18% {
            transform: translateY(-8px);
          }

          100% {
            transform: translateY(-35px);
          }
        }


        /*
           Ripple becomes slightly stronger when clicked.
        */

        .bc-intro.bc-exiting .bc-water-ripple {

          animation:
            clickRipple
            1.25s
            cubic-bezier(.22,.61,.36,1)
            forwards;
        }


        .bc-intro.bc-exiting .ripple-2 {
          animation-delay: .08s;
        }


        .bc-intro.bc-exiting .ripple-3 {
          animation-delay: .16s;
        }


        .bc-intro.bc-exiting .ripple-4 {
          animation-delay: .24s;
        }


        @keyframes clickRipple {

          0% {
            transform:
              translate(-50%,-50%)
              scale(.45);

            opacity: .52;
          }

          100% {
            transform:
              translate(-50%,-50%)
              scale(3);

            opacity: 0;
          }
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {

          .bc-logo-wrap {
            width: min(82vw, 370px);
            height: min(82vw, 370px);
          }


          .bc-arrow-control {
            width: 290px;
            height: 165px;

            margin-top: -20px;
          }


          .bc-arrow-capsule {
            width: 150px;
            height: 66px;
          }


          .bc-bold-arrow {
            transform: scale(.92);
          }


          .bc-water-ripple {
            width: 140px;
          }
        }


        @media (prefers-reduced-motion: reduce) {

          .bc-intro,
          .bc-intro-atmosphere,
          .bc-logo-halo,
          .bc-logo-glass,
          .bc-arrow-capsule,
          .bc-water-ripple {

            animation: none !important;
          }
        }

      `}</style>
    </div>
  );
}