import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Gallery3D.css";

/* ===================================================== */
/* 3D WATERCOLOR ARTWORK CARD                            */
/* ===================================================== */

const WatercolorCard3D = ({
  painting,
  index,
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

  const imageSource = painting.image
    ? `data:image/jpeg;base64,${painting.image}`
    : "/placeholder.jpg";

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

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
      onClick={() =>
        navigate(`/painting/WatercolorImport/${painting.id}`)
      }
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
                  transition:
                    "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
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
              transition:
                "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <motion.h1
           className="card-description"
           style={{
             fontFamily: '"Cormorant Garamond", Georgia, serif',
             fontSize: "2.0rem",
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

              <span className="card-curation">
                Original Piece
              </span>
            </div>

            {/* SMALL CHARCOAL DELETE BUTTON */}

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
                    scale: deletingId === painting.id ? 1 : 1.05,
                  }}
                  whileTap={{
                    scale: deletingId === painting.id ? 1 : 0.95,
                  }}
                  disabled={deletingId === painting.id}
                  onClick={(e) => {
                    // Prevent the card's navigation click.
                    e.stopPropagation();
                    handleDeleteClick(painting);
                  }}
                  style={{
                    padding: "5px 10px",
                    fontSize: "15px",
                    lineHeight: "1.4",
                    border: "1px solid #55504a",
                    borderRadius: "4px",
                    background: "#f63004",
                    color: "#e8deda",
                    fontWeight: 500,
                    cursor:
                      deletingId === painting.id
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      deletingId === painting.id ? 0.6 : 1,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                >
                  {deletingId === painting.id
                    ? "Deleting..."
                    : "🗑 Delete"}
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

    fetch("https://harsh-arts-backend-2.onrender.com/api/getWatercolors", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch watercolor paintings"
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log(
          "Watercolor paintings from MongoDB:",
          data
        );

        setArts(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(
            "Error fetching watercolor paintings:",
            err
          );

          setError("Unable to load watercolor paintings from server , server not running..");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  /* =================================================== */
  /* DELETE WATERCOLOR PAINTING                          */
  /* =================================================== */

  const handleDeleteClick = async (painting) => {
    if (!isAuthorized || deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        painting.title || "this watercolor painting"
      }"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(painting.id);

    try {
      const response = await fetch(
        `https://harsh-arts-backend-2.onrender.com/api/deleteWatercolor/${painting.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete watercolor painting (${response.status})`
        );
      }

      // Remove the painting from the gallery after success.
      setArts((previousArts) =>
        previousArts.filter(
          (art) => art.id !== painting.id
        )
      );
    } catch (err) {
      console.error(
        "Error deleting watercolor painting:",
        err
      );

      window.alert(
        "Unable to delete the watercolor painting. " +
          "Please check the backend delete endpoint and try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =================================================== */
  /* TRIM DESCRIPTION                                    */
  /* =================================================== */

  const trimWords = (text = "", wordLimit = 15) => {
    const words = text.split(/\s+/);

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
  /* ERROR                                               */
  /* =================================================== */

  if (error) {
    return (
      <div className="background gallery-3d-root">
        <h2>{error}</h2>

        {isAuthorized && (
          <motion.button
            className="add-arts-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/addImages/addWatercolor")}
          >
            Add Arts
          </motion.button>
        )}
      </div>
    );
  }

  /* =================================================== */
  /* MAIN UI                                             */
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
          {isAuthorized && (
            <motion.button
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
          )}
        </motion.div>
      </motion.div>

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
              key={painting.id || index}
              painting={painting}
              index={index}
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

export default WatercolorPaintings;