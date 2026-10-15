 
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./PenSketches.css";

const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL ||
  "https://harsh-arts-backend-2.onrender.com"
).replace(/\/+$/, "");

/* ===================================================== */
/* 3D PEN ARTWORK CARD */
/* ===================================================== */

const PenCard3D = ({
  painting,
  navigate,
  trimWords,
  isAuthorized,
  deletingId,
  handleDeleteClick,
}) => {
  const cardRef = useRef(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const [glarePos, setGlarePos] = useState({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const [isHovered, setIsHovered] = useState(false);

  // Support MongoDB _id and regular id.
  const paintingId = painting.id ?? painting._id;

  // Support Base64 images and image URLs.
  const imageSource = painting.image
    ? painting.image.startsWith("data:")
      ? painting.image
      : `data:image/jpeg;base64,${painting.image}`
    : painting.img ||
      painting.imageUrl ||
      painting.imagePath ||
      "/placeholder.jpg";

  const isDeleting =
    deletingId !== null &&
    String(deletingId) === String(paintingId);

  // Navigate to the correct painting details page.
  const openDetails = () => {
    if (
      paintingId === undefined ||
      paintingId === null ||
      paintingId === ""
    ) {
      console.error("Painting ID is missing:", painting);
      window.alert("Painting ID is missing.");
      return;
    }

    navigate(
      `/paintingDetails/getPenSketchById/${encodeURIComponent(paintingId)}`
    );
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    setRotateX((0.5 - yPercent) * 20);
    setRotateY((xPercent - 0.5) * 20);

    setGlarePos({
      x: xPercent * 100,
      y: yPercent * 100,
      opacity: 0.45,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);

    setGlarePos((prev) => ({
      ...prev,
      opacity: 0,
    }));
  };

  return (
    <motion.div
      ref={cardRef}
      className="pen-card-3d-wrapper"
      variants={{
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={openDetails}
      style={{
        perspective: "1000px",
        cursor: "pointer",
      }}
    >
      <motion.div
        className="pen-card-3d-inner"
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        style={{
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="pen-card-frame">
          <div className="pen-frame-bevel" />

          {/* ARTWORK IMAGE */}
          <div
            className="pen-canvas-container"
            style={{
              transform: isHovered
                ? "translateZ(32px)"
                : "translateZ(0px)",
              transition:
                "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <img
              src={imageSource}
              alt={painting.title || "Pen artwork"}
              className="pen-canvas-image"
            />

            {/* GLARE EFFECT */}
            <div
              className="pen-canvas-glare"
              style={{
                background: `radial-gradient(
                  circle at ${glarePos.x}% ${glarePos.y}%,
                  rgba(255, 235, 190, 0.45) 0%,
                  transparent 65%
                )`,
                opacity: glarePos.opacity,
                transform: "translateZ(38px)",
              }}
            />

            {/* CATEGORY BADGE */}
            <div
              className="pen-card-floating-badge"
              style={{
                transform: isHovered
                  ? "translateZ(48px)"
                  : "translateZ(15px)",
                transition: "transform 0.4s ease",
              }}
            >
              <span className="pen-badge-dot" />
              <span>Ball Pen Sketch</span>
            </div>

            {/* VIEW DETAILS */}
            <div
              className="pen-image-overlay"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.35s ease",
              }}
            >
              <motion.div
                className="view-details-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  transform: isHovered
                    ? "translateZ(60px)"
                    : "translateZ(20px)",
                  transition:
                    "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                View Details
              </motion.div>
            </div>
          </div>

          {/* CARD CONTENT */}
          <div
            className="pen-card-content"
            style={{
              transform: isHovered
                ? "translateZ(24px)"
                : "translateZ(0px)",
              transition:
                "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <motion.h1
              className="card-description"
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: "2rem",
                fontWeight: 500,
                fontStyle: "italic",
                letterSpacing: "0.4px",
                lineHeight: 1.6,
                color: "#e8dcc8",
              }}
            >
              {trimWords(
                painting.title || "Original pen artwork",
                50
              )}
            </motion.h1>

            <div className="card-footer">
              <span className="artist-name" />
              <span className="pen-card-curation">
                Original Piece
              </span>
            </div>

            {/* DELETE BUTTON */}
            {isAuthorized && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                  paddingBottom: "5px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <motion.button
                  type="button"
                  className="delete-arts-btn"
                  whileHover={{
                    scale: isDeleting ? 1 : 1.05,
                  }}
                  whileTap={{
                    scale: isDeleting ? 1 : 0.95,
                  }}
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(painting);
                  }}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#b91c1c",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: isDeleting
                      ? "not-allowed"
                      : "pointer",
                    opacity: isDeleting ? 0.6 : 1,
                  }}
                >
                  {isDeleting ? "Deleting..." : "🗑 Delete"}
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* FLOOR SHADOW */}
        <div
          className="pen-card-floor-shadow"
          style={{
            transform: `translateX(${-rotateY * 1.5}px)
              translateY(${rotateX * 1.2}px)`,
            opacity: isHovered ? 0.95 : 0.45,
            filter: isHovered
              ? "blur(18px)"
              : "blur(12px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

/* ===================================================== */
/* PEN SKETCHES GALLERY */
/* ===================================================== */

const PenSketches = () => {
  const navigate = useNavigate();

  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  /* AUTHORIZATION */
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  const isAuthorized =
    username === "harsh" && password === "harsh123";

  /* FETCH PEN ARTWORKS */
  const fetchArts = async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/getPenSketches`,
        { signal }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch pen artworks (${response.status})`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "The API did not return a list of pen artworks."
        );
      }

      setArts(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching pen artworks:", err);

        setError(
          "Unable to load pen artworks. Check that your backend is running."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchArts(controller.signal);

    return () => controller.abort();
  }, []);

  /* DELETE PEN ARTWORK */
  const handleDeleteClick = async (painting) => {
    if (!isAuthorized) {
      window.alert(
        "You are not authorized to delete artworks."
      );
      return;
    }

    const paintingId = painting?.id ?? painting?._id;

    if (
      paintingId === undefined ||
      paintingId === null ||
      paintingId === ""
    ) {
      window.alert("Artwork ID is missing.");
      return;
    }

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        painting.title || "this pen artwork"
      }"?`
    );

    if (!confirmed) return;

    setDeletingId(paintingId);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/deletePen/${encodeURIComponent(
          paintingId
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await response.text().catch(() => "");

        throw new Error(
          message ||
            `Failed to delete pen artwork (${response.status})`
        );
      }

      setArts((previousArts) =>
        previousArts.filter(
          (art) =>
            String(art.id ?? art._id) !== String(paintingId)
        )
      );
    } catch (err) {
      console.error("Error deleting pen artwork:", err);

      window.alert(
        err.message || "Unable to delete pen artwork."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* TRIM TEXT */
  const trimWords = (text = "", wordLimit = 15) => {
    const words = text.split(/\s+/);

    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  /* LOADING */
  if (loading) {
  return <VideoLoader />;
}

  /* FETCH ERROR */
  if (error && arts.length === 0) {
    return (
      <div className="background pen-gallery-3d-root">
        <h2>{error}</h2>

        <button
          type="button"
          onClick={() => fetchArts()}
        >
          Try Again
        </button>

        {isAuthorized && (
          <button
            type="button"
            className="add-arts-btn"
            onClick={() => navigate("/addImages/addPen")}
          >
            Add Pen Art
          </button>
        )}
      </div>
    );
  }

  /* MAIN UI */
  return (
    <div className="background pen-gallery-3d-root">
      <div className="pen-spotlight-beam" />

      {/* HERO SECTION */}
      <motion.div
        className="hero-content pen-hero-3d"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        <motion.div
          className="pen-badge-pill"
          variants={{
            hidden: { y: 25, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <span className="pen-badge-dot" />
          <span>
            Curated Exhibition • Fine Ink &amp; Pen
          </span>
        </motion.div>

        <motion.h1
          className="side font pen-title-3d"
          variants={{
            hidden: { y: 35, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        >
          Pen Sketches
        </motion.h1>

        <motion.p
          className="pen-subtitle-3d"
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        >
          Intricate cross-hatching, lifelike chiaroscuro,
          and expressive ball pen illustrations.
        </motion.p>

        {/* ADD PEN ART BUTTON */}
        {isAuthorized && (
          <motion.div
            className="pen-hint-banner"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          >
            <motion.button
              type="button"
              className="add-arts-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/addImages/addPen")}
            >
              Add Pen Art
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* NON-FATAL ERROR MESSAGE */}
      {error && (
        <p
          role="alert"
          style={{
            color: "#ff6b6b",
            textAlign: "center",
            margin: "20px",
          }}
        >
          {error}
        </p>
      )}

      {/* ARTWORK GRID */}
      <motion.div
        className="gallery-container top pen-grid-3d"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {arts.length === 0 ? (
          <p>No pen artworks found.</p>
        ) : (
          arts.map((painting, index) => (
            <PenCard3D
              key={painting.id ?? painting._id ?? index}
              painting={painting}
              navigate={navigate}
              trimWords={trimWords}
              isAuthorized={isAuthorized}
              deletingId={deletingId}
              handleDeleteClick={handleDeleteClick}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default PenSketches;