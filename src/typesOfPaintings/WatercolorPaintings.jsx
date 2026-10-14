 
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Gallery3D.css";

const API_BASE_URL = (
  
  "https://harsh-arts-backend-2.onrender.com");

/* ===================================================== */
/* 3D WATERCOLOR ARTWORK CARD                            */
/* ===================================================== */

const WatercolorCard3D = ({
  painting,
  navigate,
  trimWords,
  isAuthorized,
  onDelete,
  deletingId,
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

  // Support both id and MongoDB _id.
  const paintingId = painting.id ?? painting._id;

  // Support Base64 images, URLs, and different image fields.
  const getImageSource = () => {
    const rawImage =
      painting.image ??
      painting.img ??
      painting.imageUrl ??
      painting.imagePath ??
      painting.imageData ??
      painting.base64Image ??
      painting.photo;

    if (!rawImage) {
      return "/placeholder.jpg";
    }

    if (typeof rawImage === "object") {
      return (
        rawImage.url ||
        rawImage.src ||
        rawImage.default ||
        "/placeholder.jpg"
      );
    }

    if (typeof rawImage !== "string") {
      return "/placeholder.jpg";
    }

    if (
      rawImage.startsWith("http://") ||
      rawImage.startsWith("https://") ||
      rawImage.startsWith("data:")
    ) {
      return rawImage;
    }

    if (rawImage.startsWith("/9j/")) {
      return `data:image/jpeg;base64,${rawImage}`;
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
  };

  const imageSource = getImageSource();

  // Navigate to the watercolor painting details page.
  const openDetails = () => {
    if (
      paintingId === undefined ||
      paintingId === null ||
      paintingId === ""
    ) {
      console.error(
        "Watercolor painting ID is missing:",
        painting
      );

      window.alert("Watercolor painting ID is missing.");
      return;
    }

    navigate(
      `/paintingDetails/getWaterColorById/${encodeURIComponent(
        paintingId
      )}`
    );
  };

  // 3D tilt and glare effects.
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

  const isDeleting =
    String(deletingId) === String(paintingId);

  return (
    <motion.div
      ref={cardRef}
      className="art-card-3d-wrapper"
      variants={{
        hidden: {
          y: 50,
          opacity: 0,
        },
        visible: {
          y: 0,
          opacity: 1,
        },
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

          {/* ARTWORK IMAGE */}

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
              alt={painting.title || "Watercolor painting"}
              className="art-canvas-image"
              onError={(e) => {
                if (
                  !e.currentTarget.src.endsWith(
                    "/placeholder.jpg"
                  )
                ) {
                  e.currentTarget.src = "/placeholder.jpg";
                }
              }}
            />

            {/* GLARE EFFECT */}

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

            {/* ART MEDIUM BADGE */}

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
              <span>Watercolor</span>
            </div>

            {/* VIEW DETAILS OVERLAY */}

            <div
              className="art-image-overlay"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.35s ease",
              }}
            >
              <motion.div
                className="view-details-btn"
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                style={{
                  transform: isHovered
                    ? "translateZ(60px)"
                    : "translateZ(20px)",
                  transition: "transform 0.4s ease",
                }}
              >
                View Details
              </motion.div>
            </div>
          </div>

          {/* ARTWORK CONTENT */}

          <div
            className="art-card-content"
            style={{
              transform: isHovered
                ? "translateZ(24px)"
                : "translateZ(0px)",
              transition: "transform 0.4s ease",
            }}
          >
            <motion.h1
              className="card-title"
              whileHover={{
                color: "#d4af37",
              }}
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
                painting.title || "Original watercolor artwork",
                50
              )}
            </motion.h1>

            <p className="card-description">
              {trimWords(
                painting.description ||
                  "Original watercolor painting",
                50
              )}
            </p>

            <div className="card-footer">
              <span className="artist-name" />
              <span className="card-curation">
                Original Piece
              </span>
            </div>

            {/* DELETE BUTTON */}

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
                  className="delete-art-btn"
                  whileHover={{
                    scale: isDeleting ? 1 : 1.05,
                    backgroundColor: "#b91c1c",
                  }}
                  whileTap={{
                    scale: isDeleting ? 1 : 0.95,
                  }}
                  disabled={isDeleting}
                  onClick={(e) => {
                    // Prevent navigation when deleting.
                    e.stopPropagation();
                    onDelete(paintingId);
                  }}
                  style={{
                    padding: "9px 18px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#dc2626",
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

        {/* 3D FLOOR SHADOW */}

        <div
          className="art-card-floor-shadow"
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
/* MAIN WATERCOLOR GALLERY                               */
/* ===================================================== */

const WatercolorPaintings = () => {
  const navigate = useNavigate();

  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  /* =================================================== */
  /* AUTHORIZATION                                       */
  /* =================================================== */

  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  const isAuthorized =
    username === "harsh" && password === "harsh123";

  /* =================================================== */
  /* FETCH WATERCOLOR PAINTINGS                          */
  /* =================================================== */

  useEffect(() => {
    const controller = new AbortController();

    const fetchArts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/getWatercolors`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        if (response.status === 503) {
          throw new Error(
            "The server is waking up. Please wait and try again."
          );
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch watercolor paintings (${response.status})`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "The API did not return a list of watercolor paintings."
          );
        }

        setArts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            "Fetch watercolor paintings error:",
            err
          );

          setError(
            err.message ||
              "Unable to load watercolor paintings."
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
  }, [retryCount]);

  /* =================================================== */
  /* DELETE WATERCOLOR PAINTING                          */
  /* =================================================== */

  const handleDelete = async (id) => {
    if (!isAuthorized) {
      window.alert(
        "You are not authorized to delete paintings."
      );
      return;
    }

    if (id === undefined || id === null || id === "") {
      window.alert("Watercolor painting ID is missing.");
      return;
    }

    if (deletingId !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this watercolor painting?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/deleteWatercolor/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Watercolor painting not found. It may already have been deleted."
          );
        }

        throw new Error(
          `Failed to delete watercolor painting (${response.status})`
        );
      }

      // Remove the deleted painting from the gallery.
      setArts((previousArts) =>
        previousArts.filter(
          (art) =>
            String(art.id ?? art._id) !== String(id)
        )
      );
    } catch (err) {
      console.error(
        "Delete watercolor painting error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete the watercolor painting."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =================================================== */
  /* TRIM TITLES AND DESCRIPTIONS                        */
  /* =================================================== */

  const trimWords = (text = "", wordLimit = 15) => {
    const words = String(text).split(/\s+/);

    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  /* =================================================== */
  /* LOADING                                             */
  /* =================================================== */

  if (loading) {
    return (
      <div className="background gallery-3d-root">
        <h2>Loading watercolor paintings...</h2>
      </div>
    );
  }

  /* =================================================== */
  /* ERROR SCREEN                                        */
  /* =================================================== */

  if (error && arts.length === 0) {
    return (
      <div className="background gallery-3d-root">
        <h2>{error}</h2>

        <button
          type="button"
          className="add-arts-btn"
          onClick={() =>
            setRetryCount((count) => count + 1)
          }
        >
          Try Again
        </button>

        {isAuthorized && (
          <button
            type="button"
            className="add-arts-btn"
            onClick={() =>
              navigate("/addImages/addWatercolor")
            }
          >
            Add Arts
          </button>
        )}
      </div>
    );
  }

  /* =================================================== */
  /* MAIN GALLERY UI                                     */
  /* =================================================== */

  return (
    <div className="background gallery-3d-root">
      <div className="gallery-spotlight-beam" />

      {/* HERO SECTION */}

      <motion.div
        className="hero-content gallery-hero-3d"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          className="gallery-badge-pill"
          variants={{
            hidden: {
              y: 25,
              opacity: 0,
            },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <span className="gallery-badge-dot" />
          <span>
            Curated Exhibition • Watercolor
          </span>
        </motion.div>

        <motion.h1
          className="side font gallery-title-3d"
          variants={{
            hidden: {
              y: 35,
              opacity: 0,
            },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        >
          Watercolor Paintings
           
        </motion.h1>

        <motion.p
          className="gallery-subtitle-3d"
          variants={{
            hidden: {
              y: 30,
              opacity: 0,
            },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        >
          Delicate washes, flowing pigments, and luminous
          colors capture the beauty of every artistic moment.
        </motion.p>

        {/* ADD ART BUTTON */}

        {isAuthorized && (
          <motion.div
            variants={{
              hidden: {
                y: 20,
                opacity: 0,
              },
              visible: {
                y: 0,
                opacity: 1,
              },
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          >
            <motion.button
              type="button"
              className="add-arts-btn"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                navigate("/addImages/addWatercolor")
              }
            >
              Add Arts
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* ERROR MESSAGE WHEN ARTWORKS ARE ALREADY LOADED */}

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
        className="gallery-container top gallery-grid-3d"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {arts.length === 0 ? (
          <p>No watercolor paintings found.</p>
        ) : (
          arts.map((painting, index) => (
            <WatercolorCard3D
              key={painting.id ?? painting._id ?? index}
              painting={painting}
              navigate={navigate}
              trimWords={trimWords}
              isAuthorized={isAuthorized}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default WatercolorPaintings;