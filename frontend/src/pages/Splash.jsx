import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  GraduationCap,
  BookOpen,
  BrainCircuit,
  BarChart3,
  Sparkles,
} from "lucide-react";


function Splash() {

  const navigate = useNavigate();


  /* ========================================
     REDIRECT AFTER SPLASH
  ======================================== */

  useEffect(() => {

    const timer = setTimeout(() => {

      const token =
        localStorage.getItem("token");

      if (token) {

        navigate("/dashboard");

      } else {

        navigate("/login");

      }

    }, 3000);


    return () =>
      clearTimeout(timer);

  }, [navigate]);


  return (

    <>
      <style>{`

        /* =====================================
           BASE
        ===================================== */

        * {
          box-sizing: border-box;
        }


        .modern-splash {
          position: fixed;
          inset: 0;

          width: 100vw;
          height: 100vh;

          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 99999;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: white;

          background:
            radial-gradient(
              circle at 18% 15%,
              rgba(126, 72, 255, 0.65),
              transparent 30%
            ),

            radial-gradient(
              circle at 83% 20%,
              rgba(23, 189, 255, 0.35),
              transparent 28%
            ),

            radial-gradient(
              circle at 50% 92%,
              rgba(116, 75, 255, 0.42),
              transparent 38%
            ),

            linear-gradient(
              135deg,
              #110536 0%,
              #24106f 32%,
              #2414af 62%,
              #075fc7 100%
            );
        }


        /* =====================================
           BACKGROUND GLOW
        ===================================== */

        .splash-glow {
          position: absolute;

          width: 700px;
          height: 700px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(116, 201, 255, 0.16),
              rgba(127, 87, 255, 0.08),
              transparent 70%
            );

          filter: blur(10px);

          animation:
            glowPulse 5s ease-in-out infinite;

          pointer-events: none;
        }


        /* =====================================
           GRID
        ===================================== */

        .splash-grid {
          position: absolute;
          inset: 0;

          opacity: 0.075;

          background-image:
            linear-gradient(
              rgba(255,255,255,0.4) 1px,
              transparent 1px
            ),

            linear-gradient(
              90deg,
              rgba(255,255,255,0.4) 1px,
              transparent 1px
            );

          background-size:
            70px 70px;

          mask-image:
            radial-gradient(
              circle at center,
              black,
              transparent 72%
            );
        }


        /* =====================================
           DECORATIVE ORBS
        ===================================== */

        .splash-orb {
          position: absolute;

          border-radius: 50%;

          filter: blur(1px);

          border:
            1px solid
            rgba(255,255,255,0.13);

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.11),
              rgba(255,255,255,0.025)
            );

          backdrop-filter:
            blur(10px);

          animation:
            orbFloat 8s ease-in-out infinite;
        }


        .orb-a {
          width: 290px;
          height: 290px;

          top: -100px;
          left: -70px;
        }


        .orb-b {
          width: 240px;
          height: 240px;

          bottom: -70px;
          right: -40px;

          animation-delay:
            1.2s;
        }


        .orb-c {
          width: 115px;
          height: 115px;

          right: 15%;
          top: 11%;

          animation-delay:
            2s;
        }


        /* =====================================
           PARTICLES
        ===================================== */

        .particle {
          position: absolute;

          border-radius: 50%;

          background:
            #ffffff;

          box-shadow:
            0 0 15px
            rgba(149, 223, 255, 0.9);

          animation:
            twinkle 3s
            ease-in-out infinite;
        }


        .p1 {
          top: 18%;
          left: 16%;

          width: 5px;
          height: 5px;
        }


        .p2 {
          top: 28%;
          right: 19%;

          width: 8px;
          height: 8px;

          animation-delay: .6s;
        }


        .p3 {
          bottom: 21%;
          left: 21%;

          width: 6px;
          height: 6px;

          animation-delay: 1.2s;
        }


        .p4 {
          bottom: 32%;
          right: 14%;

          width: 4px;
          height: 4px;

          animation-delay: 2s;
        }


        .p5 {
          top: 13%;
          left: 48%;

          width: 4px;
          height: 4px;

          animation-delay: 1.5s;
        }


        /* =====================================
           ORBIT
        ===================================== */

        .orbit {
          position: absolute;

          left: 50%;
          top: 50%;

          border-radius: 50%;

          border:
            1px solid
            rgba(255,255,255,0.09);

          pointer-events: none;
        }


        .orbit-one {
          width: 760px;
          height: 350px;

          transform:
            translate(-50%, -50%)
            rotate(-8deg);

          animation:
            orbitPulse 6s
            ease-in-out infinite;
        }


        .orbit-two {
          width: 630px;
          height: 275px;

          transform:
            translate(-50%, -50%)
            rotate(10deg);

          border-color:
            rgba(104, 225, 255, 0.11);
        }


        /* =====================================
           FLOATING CARDS
        ===================================== */

        .feature-card {
          position: absolute;

          width: 92px;
          height: 92px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 25px;

          color:
            rgba(255,255,255,0.92);

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.13),
              rgba(255,255,255,0.055)
            );

          border:
            1px solid
            rgba(255,255,255,0.16);

          box-shadow:
            0 20px 50px
            rgba(5, 8, 48, 0.32),

            inset 0 1px 0
            rgba(255,255,255,0.15);

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          animation:
            featureFloat 5s
            ease-in-out infinite;
        }


        .feature-card svg {
          width: 34px;
          height: 34px;
        }


        .feature-book {
          left: 14%;
          top: 23%;

          color: #d9d6ff;
        }


        .feature-brain {
          left: 10%;
          bottom: 23%;

          color: #eca9ff;

          animation-delay:
            .9s;
        }


        .feature-chart {
          right: 12%;
          top: 24%;

          color: #a8e9ff;

          animation-delay:
            1.5s;
        }


        /* =====================================
           MAIN CONTENT
        ===================================== */

        .splash-main {
          position: relative;

          z-index: 10;

          width:
            min(92%, 850px);

          display: flex;
          flex-direction: column;
          align-items: center;

          text-align: center;

          animation:
            contentEnter
            0.8s ease-out both;
        }


        /* =====================================
           APP LOGO
        ===================================== */

        .brand-logo-wrapper {
          position: relative;

          margin-bottom: 24px;

          animation:
            logoEnter
            .9s cubic-bezier(
              .2,
              .8,
              .2,
              1
            )
            both;
        }


        .brand-logo-glow {
          position: absolute;

          inset: -30px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(105, 221, 255, .27),
              rgba(131, 80, 255, .15),
              transparent 70%
            );

          filter: blur(18px);

          animation:
            glowPulse 3s
            ease-in-out infinite;
        }


        .brand-logo {
          position: relative;

          width: 112px;
          height: 112px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 31px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.21),
              rgba(255,255,255,.07)
            );

          border:
            1px solid
            rgba(255,255,255,.2);

          box-shadow:
            0 22px 60px
            rgba(4,8,50,.4),

            inset 0 1px 0
            rgba(255,255,255,.2);

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);
        }


        .brand-logo svg {
          width: 58px;
          height: 58px;

          stroke-width: 1.7;

          filter:
            drop-shadow(
              0 6px 12px
              rgba(78, 221, 255, .3)
            );
        }


        .logo-sparkle {
          position: absolute;

          top: -3px;
          right: -9px;

          width: 31px;
          height: 31px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #9e72ff,
              #62d9ff
            );

          box-shadow:
            0 8px 22px
            rgba(110, 206, 255, .32);

          animation:
            sparkleFloat
            2.5s ease-in-out
            infinite;
        }


        /* =====================================
           LABEL
        ===================================== */

        .ai-label {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding:
            8px 14px;

          margin-bottom: 17px;

          border-radius: 999px;

          background:
            rgba(255,255,255,.095);

          border:
            1px solid
            rgba(255,255,255,.13);

          color:
            rgba(240,247,255,.86);

          font-size:
            12px;

          font-weight:
            600;

          letter-spacing:
            .12em;

          text-transform:
            uppercase;

          backdrop-filter:
            blur(12px);

          animation:
            fadeUp .7s .25s
            both;
        }


        .label-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background:
            #77e5ff;

          box-shadow:
            0 0 12px
            #77e5ff;
        }


        /* =====================================
           BRAND TEXT
        ===================================== */

        .splash-title {
          margin: 0;

          font-size:
            clamp(
              3.2rem,
              6vw,
              5.4rem
            );

          font-weight: 800;

          line-height: 1;

          letter-spacing:
            -0.045em;

          color: white;

          text-shadow:
            0 10px 38px
            rgba(0,0,0,.23);

          animation:
            fadeUp .8s .35s
            both;
        }


        .splash-title-ai {

          background:
            linear-gradient(
              90deg,
              #a495ff 0%,
              #82ddff 45%,
              #58f2f5 100%
            );

          -webkit-background-clip:
            text;

          background-clip:
            text;

          color: transparent;
        }


        .splash-subtitle {

          margin:
            20px auto 0;

          max-width:
            690px;

          color:
            rgba(232,239,255,.78);

          font-size:
            clamp(
              .96rem,
              1.5vw,
              1.18rem
            );

          line-height:
            1.75;

          font-weight:
            400;

          animation:
            fadeUp .8s .5s
            both;
        }


        /* =====================================
           MINI FEATURES
        ===================================== */

        .mini-features {

          margin-top:
            28px;

          display: flex;

          gap: 12px;

          flex-wrap: wrap;

          align-items: center;
          justify-content: center;

          animation:
            fadeUp .8s .65s
            both;
        }


        .mini-chip {

          padding:
            9px 13px;

          border-radius:
            999px;

          color:
            rgba(240,245,255,.76);

          font-size:
            11px;

          font-weight:
            500;

          background:
            rgba(255,255,255,.07);

          border:
            1px solid
            rgba(255,255,255,.1);

          backdrop-filter:
            blur(10px);
        }


        /* =====================================
           LOADER
        ===================================== */

        .loading-container {

          width:
            min(420px, 85vw);

          margin-top:
            44px;

          animation:
            fadeUp .8s .8s
            both;
        }


        .loading-info {

          display: flex;

          justify-content:
            space-between;

          align-items:
            center;

          margin-bottom:
            11px;

          color:
            rgba(234,241,255,.72);

          font-size:
            12px;

          font-weight:
            500;
        }


        .loading-live {

          display: flex;

          align-items:
            center;

          gap: 7px;
        }


        .loading-pulse {

          width: 7px;
          height: 7px;

          border-radius:
            50%;

          background:
            #72e4ff;

          box-shadow:
            0 0 12px
            #72e4ff;

          animation:
            statusPulse
            1.5s infinite;
        }


        .progress-track {

          width: 100%;

          height: 5px;

          overflow: hidden;

          border-radius:
            999px;

          background:
            rgba(255,255,255,.11);

          box-shadow:
            inset 0 1px 2px
            rgba(0,0,0,.18);
        }


        .progress-value {

          width: 0%;
          height: 100%;

          border-radius:
            inherit;

          background:
            linear-gradient(
              90deg,
              #8268ff,
              #5acfff,
              #82fff3
            );

          box-shadow:
            0 0 14px
            rgba(100,215,255,.45);

          animation:
            loadingProgress
            2.75s
            cubic-bezier(
              .2,
              .65,
              .25,
              1
            )
            forwards;
        }


        /* =====================================
           BOTTOM TEXT
        ===================================== */

        .splash-footer {

          position:
            absolute;

          left: 50%;
          bottom: 25px;

          transform:
            translateX(-50%);

          width:
            max-content;

          max-width:
            90%;

          color:
            rgba(233,240,255,.4);

          font-size:
            11px;

          letter-spacing:
            .08em;

          text-align:
            center;

          animation:
            fadeUp .8s 1s
            both;
        }


        /* =====================================
           ANIMATIONS
        ===================================== */

        @keyframes
        contentEnter {

          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }

        }


        @keyframes
        logoEnter {

          0% {
            opacity: 0;
            transform:
              translateY(22px)
              scale(.7);
          }

          70% {
            transform:
              translateY(-4px)
              scale(1.04);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }

        }


        @keyframes
        fadeUp {

          from {
            opacity: 0;
            transform:
              translateY(16px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }

        }


        @keyframes
        featureFloat {

          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-12px)
              rotate(2deg);
          }

        }


        @keyframes
        orbFloat {

          0%,
          100% {
            transform:
              translate(0,0);
          }

          50% {
            transform:
              translate(
                16px,
                13px
              );
          }

        }


        @keyframes
        glowPulse {

          0%,
          100% {
            opacity:
              .7;

            transform:
              scale(1);
          }

          50% {
            opacity:
              1;

            transform:
              scale(1.08);
          }

        }


        @keyframes
        sparkleFloat {

          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-6px)
              rotate(10deg);
          }

        }


        @keyframes
        twinkle {

          0%,
          100% {
            opacity:
              .25;

            transform:
              scale(.8);
          }

          50% {
            opacity:
              1;

            transform:
              scale(1.25);
          }

        }


        @keyframes
        orbitPulse {

          0%,
          100% {
            opacity:
              .5;
          }

          50% {
            opacity:
              .9;
          }

        }


        @keyframes
        loadingProgress {

          0% {
            width: 0%;
          }

          18% {
            width: 17%;
          }

          44% {
            width: 47%;
          }

          69% {
            width: 72%;
          }

          86% {
            width: 90%;
          }

          100% {
            width: 100%;
          }

        }


        @keyframes
        statusPulse {

          0%,
          100% {
            opacity: .45;
            transform:
              scale(.8);
          }

          50% {
            opacity: 1;
            transform:
              scale(1.2);
          }

        }


        /* =====================================
           RESPONSIVE
        ===================================== */

        @media
        (max-width: 850px) {

          .orbit {
            display: none;
          }


          .feature-card {

            width: 72px;
            height: 72px;

            border-radius:
              20px;
          }


          .feature-card svg {

            width: 27px;
            height: 27px;
          }


          .feature-book {

            left: 4%;
            top: 18%;
          }


          .feature-brain {

            left: 4%;
            bottom: 20%;
          }


          .feature-chart {

            right: 4%;
            top: 21%;
          }

        }


        @media
        (max-width: 620px) {

          .brand-logo {

            width: 94px;
            height: 94px;

            border-radius:
              27px;
          }


          .brand-logo svg {

            width: 48px;
            height: 48px;
          }


          .logo-sparkle {

            width: 27px;
            height: 27px;
          }


          .logo-sparkle svg {

            width: 15px;
            height: 15px;
          }


          .splash-title {

            font-size:
              3rem;
          }


          .splash-subtitle {

            max-width:
              92%;

            font-size:
              .9rem;

            line-height:
              1.65;
          }


          .mini-features {

            gap: 8px;

            margin-top:
              22px;
          }


          .mini-chip {

            padding:
              7px 10px;

            font-size:
              10px;
          }


          .feature-card {

            width: 56px;
            height: 56px;

            border-radius:
              16px;

            opacity: .7;
          }


          .feature-card svg {

            width: 21px;
            height: 21px;
          }


          .feature-book {

            left: -7px;
            top: 16%;
          }


          .feature-brain {

            left: -6px;
            bottom: 19%;
          }


          .feature-chart {

            right: -8px;
            top: 18%;
          }


          .loading-container {

            margin-top:
              34px;
          }


          .splash-footer {

            bottom:
              17px;

            font-size:
              9px;
          }

        }


        /* =====================================
           REDUCED MOTION
        ===================================== */

        @media
        (prefers-reduced-motion:
        reduce) {

          *,
          *::before,
          *::after {

            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;
          }

        }

      `}</style>


      <div className="modern-splash">


        {/* BACKGROUND */}

        <div className="splash-grid" />

        <div className="splash-glow" />


        {/* ORBS */}

        <div className="splash-orb orb-a" />

        <div className="splash-orb orb-b" />

        <div className="splash-orb orb-c" />


        {/* PARTICLES */}

        <span className="particle p1" />

        <span className="particle p2" />

        <span className="particle p3" />

        <span className="particle p4" />

        <span className="particle p5" />


        {/* ORBIT RINGS */}

        <div className="orbit orbit-one" />

        <div className="orbit orbit-two" />


        {/* FLOATING FEATURES */}

        <div
          className="
            feature-card
            feature-book
          "
        >

          <BookOpen />

        </div>


        <div
          className="
            feature-card
            feature-brain
          "
        >

          <BrainCircuit />

        </div>


        <div
          className="
            feature-card
            feature-chart
          "
        >

          <BarChart3 />

        </div>


        {/* ==================================
            MAIN CONTENT
        ================================== */}

        <main className="splash-main">


          {/* LOGO */}

          <div
            className="
              brand-logo-wrapper
            "
          >

            <div
              className="
                brand-logo-glow
              "
            />


            <div className="brand-logo">

              <GraduationCap />

            </div>


            <div className="logo-sparkle">

              <Sparkles
                size={17}
              />

            </div>

          </div>


          {/* AI LABEL */}

          <div className="ai-label">

            <span
              className="
                label-dot
              "
            />

            AI-Powered Learning

          </div>


          {/* TITLE */}

          <h1 className="splash-title">

            CampusLearn{" "}

            <span
              className="
                splash-title-ai
              "
            >
              AI
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p className="splash-subtitle">

            Your intelligent learning
            companion for courses,
            assignments, progress and
            personalized academic support.

          </p>


          {/* FEATURE CHIPS */}

          <div className="mini-features">

            <span className="mini-chip">

              Smart Learning

            </span>


            <span className="mini-chip">

              AI Assistance

            </span>


            <span className="mini-chip">

              Real-time Progress

            </span>

          </div>


          {/* ==================================
              LOADING AREA
          ================================== */}

          <div className="loading-container">


            <div className="loading-info">


              <span className="loading-live">

                <span
                  className="
                    loading-pulse
                  "
                />

                Preparing your workspace

              </span>


              <span>

                CampusLearn

              </span>


            </div>


            <div className="progress-track">

              <div
                className="
                  progress-value
                "
              />

            </div>


          </div>


        </main>


        {/* FOOTER */}

        <div className="splash-footer">

          A smarter way to learn,
          teach and grow.

        </div>


      </div>

    </>

  );

}


export default Splash;