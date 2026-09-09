import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Hero from "../Components/Hero";
import AboutArtist from "../Components/AboutArtist";
import { homePaintings } from "../ArtGalleryData";

import "./Home.css";

import home1 from "../Images/mainpage/img2.jpeg";
import home2 from "../Images/mainpage/img1.jpeg";
import home3 from "../Images/mainpage/img3.jpeg";
import home4 from "../Images/mainpage/img4.jpeg";
import home5 from "../Images/mainpage/img5.jpeg";

/* ===================================================== */
/* FEATURED ARTWORKS CONFIGURATION */
/* ===================================================== */
const featuredArtworks = [
  {
    id: "art-1",
    img: home1,
    title: "Charcoal Portrait",
    medium: "Charcoal & Graphite on Heavyweight Paper",
    year: "2026",
    badge: "The Haat of Art 2026",
  },
  {
    id: "art-2",
    img: home2,
    title: "Mixed Media Artwork",
    medium: "Mixed Media, Acrylic & Metallic Foil",
    year: "2026",
    badge: "Exhibition Highlight",
  },
  {
    id: "art-3",
    img: home3,
    title: "Mixed Media Expression",
    medium: "Watercolor, Ink & Ballpen Textures",
    year: "2026",
    badge: "Curator's Choice",
  },
  {
    id: "art-4",
    img: home4,
    title: "Charcoal Artwork I",
    medium: "Fine Art Charcoal & Conté Crayon",
    year: "2026",
    badge: "Signature Piece",
  },
  {
    id: "art-5",
    img: home5,
    title: "Charcoal Artwork II",
    medium: "Charcoal on Cold-Pressed Sheet",
    year: "2026",
    badge: "Master Study",
  },
];

const allGalleryPaintings =
  homePaintings && homePaintings.length > 0 ? homePaintings : featuredArtworks;

/* ===================================================== */
/* 3D TILT CARD (Interactive Physics & Specular Glare) */
/* ===================================================== */
const TiltCard3D = ({
  image,
  title,
  medium,
  height = "75vh",
  badge = "Featured",
  className = "",
  onClick,
}) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPercent = mouseX / rect.width;
    const yPercent = mouseY / rect.height;

    // 3D tilt calculation (X & Y axis)
    const tiltX = (0.5 - yPercent) * 20;
    const tiltY = (xPercent - 0.5) * 20;

    setRotateX(tiltX);
    setRotateY(tiltY);
    setGlarePos({
      x: xPercent * 100,
      y: yPercent * 100,
      opacity: 0.35,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: "1200px", height }}
    >
      <motion.div
        className="tilt-card-inner"
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        style={{ transformStyle: "preserve-3d", height: "100%", width: "100%" }}
      >
        <div className="tilt-card-frame">
          <div
            className="tilt-card-canvas"
            style={{
              backgroundImage: `url(${image})`,
              transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
              transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          />

          <div
            className="tilt-card-glare"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 230, 180, 0.45) 0%, rgba(255,255,255,0) 65%)`,
              opacity: glarePos.opacity,
              transform: "translateZ(35px)",
            }}
          />

          {badge && (
            <div
              className="tilt-card-badge"
              style={{
                transform: isHovered ? "translateZ(50px)" : "translateZ(15px)",
                transition: "transform 0.4s ease",
              }}
            >
              <span>{badge}</span>
            </div>
          )}

          <div
            className="tilt-card-overlay"
            style={{
              transform: isHovered ? "translateZ(65px)" : "translateZ(20px)",
              transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <div className="tilt-card-info">
              <span className="tilt-card-medium">{medium || "The Haat of Art 2026"}</span>
              <h3 className="tilt-card-title">{title}</h3>
            </div>
            <div className="tilt-card-action">
              <span>Inspect &rarr;</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ===================================================== */
/* 3D CYLINDRICAL COVERFLOW CAROUSEL */
/* ===================================================== */
const Carousel3D = ({ paintings = [], onSelectPainting }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = paintings.length;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

  // ESLint exhaustive-deps fix: functional updater inside setInterval
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  if (!paintings || paintings.length === 0) return null;

  const getCardStyle = (index) => {
    let offset = index - currentIndex;

    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);
    const isCenter = offset === 0;

    if (absOffset > 2) return { display: "none" };

    const translateX = offset * 260;
    const translateZ = -absOffset * 180;
    const rotateY = -offset * 32;
    const scale = isCenter ? 1.05 : Math.max(0.75, 1 - absOffset * 0.18);
    const opacity = isCenter ? 1 : Math.max(0.35, 1 - absOffset * 0.35);
    const zIndex = 20 - absOffset * 5;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: isCenter
        ? "brightness(1.05) drop-shadow(0 20px 30px rgba(0,0,0,0.7))"
        : "brightness(0.65)",
      transition:
        "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s ease, filter 0.7s ease",
    };
  };

  return (
    <div
      className="carousel-3d-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-3d-stage">
        <div className="carousel-3d-track">
          {paintings.map((painting, index) => {
            const style = getCardStyle(index);
            const isCenter = index === currentIndex;

            return (
              <div
                key={`${painting.title}-${index}`}
                className={`carousel-3d-card ${isCenter ? "active-card" : ""}`}
                style={style}
                onClick={() => {
                  if (!isCenter) {
                    setCurrentIndex(index);
                  } else if (onSelectPainting) {
                    onSelectPainting(painting, index);
                  }
                }}
              >
                <div
                  className="carousel-3d-image"
                  style={{ backgroundImage: `url(${painting.img})` }}
                >
                  <div className="carousel-3d-sheen" />
                </div>

                <div className="carousel-3d-caption">
                  <span className="caption-number">0{index + 1}</span>
                  <h3 className="caption-title">{painting.title}</h3>
                  <span className="caption-tag">
                    {painting.medium || "The Haat of Art 2026"}
                  </span>
                </div>

                {/* 3D Floor Reflection */}
                <div
                  className="carousel-3d-reflection"
                  style={{ backgroundImage: `url(${painting.img})` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="carousel-3d-btn prev-btn"
        onClick={prevSlide}
        aria-label="Previous artwork"
      >
        &#10094;
      </button>

      <button
        type="button"
        className="carousel-3d-btn next-btn"
        onClick={nextSlide}
        aria-label="Next artwork"
      >
        &#10095;
      </button>

      <div className="carousel-3d-nav">
        <div className="carousel-3d-dots">
          {paintings.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`carousel-dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="carousel-counter">
          <span>0{currentIndex + 1}</span> / <span>0{total}</span>
        </div>
      </div>
    </div>
  );
};

/* ===================================================== */
/* MAIN 3D HOME COMPONENT */
/* ===================================================== */
const Home = () => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  return (
    <div className="home-3d-root">
      {/* 1. HERO */}
      <Hero />

      {/* 2. THE HAAT OF ART 2026 - 3D EXHIBITION */}
      <section className="art-showcase-3d">
        <div className="ambient-spotlight" />

        <div className="showcase-header-wrapper">
          <motion.div
            className="art-top"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-pill">
              <span className="sparkle">✦</span>
              <span>The Haat of Art 2026 Exhibition</span>
            </div>

            <h2 className="mt-5">The Haat of Art – 2026</h2>

            <div className="btn-wrapper">
              <p className="section-text">
                I had the privilege of presenting my artwork at{" "}
                <b>The Haat of Art 2026</b>, showcasing a diverse collection of
                creative expressions. The exhibition featured my work across
                multiple mediums, including{" "}
                <b>
                  charcoal &amp; graphite sketches, digital art, colored pencil,
                  ball pen art, mixed media, watercolor, and acrylic painting
                </b>
                . I also presented{" "}
                <b>
                  customized portraits, apparel and clothing designs, and
                  hand-painted shoes
                </b>
                , demonstrating the versatility of my practice and my ability to
                blend traditional and contemporary techniques.
              </p>

              <div className="cta-action-row">
                <Link to="/Lets-connect">
                  <motion.button
                    type="button"
                    className="art-btn-3d"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Know More</span>
                    <span className="btn-arrow">&rarr;</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. FEATURED WORKS: 3D PARALLAX TILT GALLERY */}
        <div className="tilt-gallery-section">
          <div className="tilt-section-title">
            <span className="title-eyebrow mt-0">Tactile Perspective</span>
            <h2 className="title-eyebrows ">My Featured Masterpieces</h2>
          </div>

          <div className="container-fluid px-lg-5">
            {/* ROW 1: Two 3D Cards */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <TiltCard3D
                  image={featuredArtworks[0].img}
                  title={featuredArtworks[0].title}
                  medium={featuredArtworks[0].medium}
                  badge={featuredArtworks[0].badge}
                  height="72vh"
                  onClick={() => setSelectedArtwork(featuredArtworks[0])}
                />
              </div>
              <div className="col-12 col-md-6">
                <TiltCard3D
                  image={featuredArtworks[1].img}
                  title={featuredArtworks[1].title}
                  medium={featuredArtworks[1].medium}
                  badge={featuredArtworks[1].badge}
                  height="72vh"
                  onClick={() => setSelectedArtwork(featuredArtworks[1])}
                />
              </div>
            </div>

            {/* ROW 2: One Grand Hero Card */}
            <div className="row g-4 mb-4">
              <div className="col-12">
                <TiltCard3D
                  image={featuredArtworks[2].img}
                  title={featuredArtworks[2].title}
                  medium={featuredArtworks[2].medium}
                  badge={featuredArtworks[2].badge}
                  height="80vh"
                  className="wide-hero-card"
                  onClick={() => setSelectedArtwork(featuredArtworks[2])}
                />
              </div>
            </div>

            {/* ROW 3: Two 3D Cards */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <TiltCard3D
                  image={featuredArtworks[3].img}
                  title={featuredArtworks[3].title}
                  medium={featuredArtworks[3].medium}
                  badge={featuredArtworks[3].badge}
                  height="72vh"
                  onClick={() => setSelectedArtwork(featuredArtworks[3])}
                />
              </div>
              <div className="col-12 col-md-6">
                <TiltCard3D
                  image={featuredArtworks[4].img}
                  title={featuredArtworks[4].title}
                  medium={featuredArtworks[4].medium}
                  badge={featuredArtworks[4].badge}
                  height="72vh"
                  onClick={() => setSelectedArtwork(featuredArtworks[4])}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. 3D COVERFLOW SLIDESHOW (Collection Showcase) */}
        <div className="collection-carousel-section">
          <div className="tilt-section-title">
            <h2 className="title-eyebrows">Haat of Art 3D Showcase</h2>
          </div>

          <Carousel3D
            paintings={allGalleryPaintings}
            onSelectPainting={(art) => setSelectedArtwork(art)}
          />
        </div>
      </section>

      {/* 5. 3D ARTWORK INSPECT MODAL */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            className="artwork-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              className="artwork-modal-content"
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedArtwork(null)}
                aria-label="Close modal"
              >
                &times;
              </button>

              <div className="modal-body-grid">
                <div className="modal-image-pane">
                  <img
                    src={selectedArtwork.img}
                    alt={selectedArtwork.title}
                    className="modal-artwork-img"
                  />
                </div>

                <div className="modal-meta-pane">
                  <span className="modal-tag">Exhibition Piece</span>
                  <h2 className="modal-title">{selectedArtwork.title}</h2>
                  <p className="modal-medium">
                    {selectedArtwork.medium || "Charcoal & Mixed Media on Fine Canvas"}
                  </p>

                  <div className="modal-divider" />

                  <div className="modal-details-list">
                    <div className="detail-item">
                      <span className="detail-label">Exhibition</span>
                      <span className="detail-value">The Haat of Art 2026</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-value in-stock">Original Available</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Verification</span>
                      <span className="detail-value">Signed by Harsh Artz</span>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <Link
                      to="/Lets-connect"
                      onClick={() => setSelectedArtwork(null)}
                      className="modal-inquire-btn"
                    >
                      Inquire About Artwork &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. ABOUT ARTIST */}
      <AboutArtist />
    </div>
  );
};

export default Home;