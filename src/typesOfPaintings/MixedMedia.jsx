import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Gallery3D.css";

const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL ||
  "https://harsh-arts-backend-2.onrender.com"
).replace(/\/+$/, "");

// Individual mixed media artwork card
const MixedMediaCard3D = ({
  painting,
  navigate,
  trimWords,
  isAuthorized,
  deletingId,
  handleDelete,
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

  // Support MongoDB IDs and regular IDs.
  const paintingId = painting.id ?? painting._id;

  // Support Base64 images, data URLs, and image URLs.
  const imageSource = (() => {
    const rawImage =
      painting.image ??
      painting.img ??
      painting.imageUrl ??
      painting.imagePath ??
      painting.imageData ??
      painting.base64Image ??
      painting.photo;

    if (!rawImage) return "/placeholder.jpg";

    if (typeof rawImage !== "string") {
      return rawImage.url || rawImage.src || "/placeholder.jpg";
    }

    if (
      rawImage.startsWith("data:") ||
      rawImage.startsWith("http://") ||
      rawImage.startsWith("https://") ||
      rawImage.startsWith("/")
    ) {
      return rawImage;
    }

    if (rawImage.startsWith("iVBOR")) {
      return `data:image/png;base64,${rawImage}`;
    }

    if (rawImage.startsWith("R0lGOD")) {
      return `data:image/gif;base64,${rawImage}`;
    }

    if (rawImage.startsWith("UklGR")) {
      return `data:image/webp;base64,${rawImage}`;
    }

    return `data:image/jpeg;base64,${rawImage}`;
  })();

  // Open the painting details page.
  const openDetails = () => {
    if (
      paintingId === undefined ||
      paintingId === null ||
      paintingId === ""
    ) {
      console.error("Mixed media painting ID is missing:", painting);
      alert("Painting ID is missing.");
      return;
    }

    navigate(
      `/paintingDetails/getMixedMediaById/${encodeURIComponent(
        paintingId
      )}`
    );
  };

  // 3D mouse movement.
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
      className="art-card-3d-wrapper"
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
        className="art-card-3d-inner"
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
        <div className="art-card-frame">
          <div className="art-frame-bevel" />

          {/* Artwork image */}
          <div
            className="art-canvas-container"
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
              alt={painting.title || "Mixed media artwork"}
              className="art-canvas-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.jpg";
              }}
            />

            {/* Glare effect */}
            <div
              className="art-canvas-glare"
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

            {/* Category badge */}
            <div
              className="art-card-floating-badge"
              style={{
                transform: isHovered
                  ? "translateZ(48px)"
                  : "translateZ(15px)",
                transition: "transform 0.4s ease",
              }}
            >
              <span className="gallery-badge-dot" />
              <span>Mixed Media</span>
            </div>

            {/* View details overlay */}
            <div
              className="art-image-overlay"
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

          {/* Card content */}
          <div
            className="art-card-content"
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
                painting.title || "Original mixed media artwork",
                50
              )}
            </motion.h1>

            {painting.description && (
              <p className="card-description">
                {trimWords(painting.description, 25)}
              </p>
            )}

            <div className="card-footer">
              <span className="artist-name" />
              <span className="card-curation">Original Piece</span>
            </div>

            {/* Delete button */}
            {isAuthorized && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "15px",
                  paddingBottom: "5px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <motion.button
                  type="button"
                  className="delete-arts-btn"
                  whileHover={{
                    scale:
                      String(deletingId) === String(paintingId)
                        ? 1
                        : 1.05,
                  }}
                  whileTap={{
                    scale:
                      String(deletingId) === String(paintingId)
                        ? 1
                        : 0.95,
                  }}
                  disabled={
                    String(deletingId) === String(paintingId)
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(paintingId);
                  }}
                  style={{
                    padding: "9px 18px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#dc2626",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity:
                      String(deletingId) === String(paintingId)
                        ? 0.6
                        : 1,
                  }}
                >
                  {String(deletingId) === String(paintingId)
                    ? "Deleting..."
                    : "🗑 Delete"}
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Floor shadow */}
        <div
          className="art-card-floor-shadow"
          style={{
            transform: `translateX(${-rotateY * 1.5}px)
              translateY(${rotateX * 1.2}px)`,
            opacity: isHovered ? 0.95 : 0.45,
            filter: isHovered ? "blur(18px)" : "blur(12px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Main mixed media gallery
const MixedMedia = () => {
  const navigate = useNavigate();

  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Existing authorization check.
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  const isAuthorized =
    username === "harsh" && password === "harsh123";

  // Fetch all mixed media artworks.
  useEffect(() => {
    const controller = new AbortController();

    const fetchArts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/getMixedMedia`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch mixed media artworks (${response.status})`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "The API did not return a list of mixed media artworks."
          );
        }

        setArts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch mixed media error:", err);

          setError(
            err.message ||
              "Unable to load mixed media artworks. Check your backend."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchArts();

    return () => controller.abort();
  }, []);

  // Delete a mixed media artwork.
  const handleDelete = async (id) => {
    if (!isAuthorized) {
      alert("You are not authorized to delete artworks.");
      return;
    }

    if (id === undefined || id === null || id === "") {
      alert("Artwork ID is missing.");
      return;
    }

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this mixed media artwork?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/deleteMixedMedia/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete mixed media artwork (${response.status})`
        );
      }

      setArts((previousArts) =>
        previousArts.filter(
          (art) => String(art.id ?? art._id) !== String(id)
        )
      );
    } catch (err) {
      console.error("Delete mixed media error:", err);

      alert(
        err.message ||
          "Unable to delete the artwork. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Trim long text.
  const trimWords = (text = "", wordLimit = 15) => {
    const words = String(text).split(/\s+/);

    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  // Loading screen.
 if (loading) {
  return <VideoLoader />;
}

  // Fetch error screen.
  if (error && arts.length === 0) {
    return (
      <div className="background gallery-3d-root">
        <h2>{error}</h2>

        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="background gallery-3d-root">
      <div className="gallery-spotlight-beam" />

      {/* Hero section */}
      <motion.div
        className="hero-content gallery-hero-3d"
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
          className="gallery-badge-pill"
          variants={{
            hidden: { y: 25, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="gallery-badge-dot" />
          <span>Curated Exhibition • Mixed Media</span>
        </motion.div>

        <motion.h1
          className="side font gallery-title-3d"
          variants={{
            hidden: { y: 35, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Mixed Media Artworks
        </motion.h1>

        <motion.p
          className="gallery-subtitle-3d"
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          A creative fusion of textures, materials, colors,
          and techniques that transforms imagination into art.
        </motion.p>

        {/* Add artworks button */}
        {isAuthorized && (
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.button
              type="button"
              className="add-arts-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/addImages/addMixedMedia")}
            >
              Add Arts
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Non-blocking error message */}
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

      {/* Artwork grid */}
      <motion.div
        className="gallery-container top gallery-grid-3d"
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
          <p>No mixed media artworks found.</p>
        ) : (
          arts.map((painting, index) => (
            <MixedMediaCard3D
              key={painting.id ?? painting._id ?? index}
              painting={painting}
              index={index}
              navigate={navigate}
              trimWords={trimWords}
              isAuthorized={isAuthorized}
              deletingId={deletingId}
              handleDelete={handleDelete}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default MixedMedia;