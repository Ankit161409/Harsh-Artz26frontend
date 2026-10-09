import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Gallery3D.css";

const CharcoalCard3D = ({
  painting,
  index,
  navigate,
  trimWords,
  onDelete,
  isAuthorized,
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
        navigate(`/painting/CharcoalImport/${painting.id}`)
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
              alt={painting.title || "Charcoal artwork"}
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

            {/* FLOATING BADGE */}
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
              <span>Charcoal &amp; Graphite</span>
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

          {/* CARD CONTENT */}
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
            {/* CARD FOOTER */}
            <div className="card-footer">
              <span className="artist-name" />

              <span className="card-curation">
                Original Piece
              </span>
            </div>

            {/* DELETE BUTTON AT BOTTOM-RIGHT */}
            {isAuthorized && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "15px",
                  paddingBottom: "5px",
                }}
              >
                <motion.button
                  type="button"
                  className="delete-art-btn"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#b91c1c",
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  disabled={
                    String(deletingId) === String(painting.id)
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(painting.id);
                  }}
                  style={{
                    padding: "9px 18px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity:
                      String(deletingId) === String(painting.id)
                        ? 0.6
                        : 1,
                  }}
                >
                  {String(deletingId) === String(painting.id)
                    ? "Deleting..."
                    : "Delete"}
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* FLOOR SHADOW */}
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

const CharcoalSketches = () => {
  const navigate = useNavigate();

  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  /*
   * AUTHORIZATION CHECK
   */
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  const isAuthorized =
    username === "harsh" && password === "harsh123";

  /*
   * FETCH CHARCOAL ARTWORKS
   */
  useEffect(() => {
    const fetchArts = async () => {
      try {
        const response = await fetch(
          "https://harsh-arts-backend-2.onrender.com/api/getCharcoals"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch charcoal artworks");
        }

        const data = await response.json();

        setArts(data);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load charcoal artworks from server , server not running..");
      } finally {
        setLoading(false);
      }
    };

    fetchArts();
  }, []);

  /*
   * DELETE CHARCOAL ARTWORK
   */
  const handleDelete = async (id) => {
    if (!isAuthorized) {
      alert("You are not authorized to delete artworks.");
      return;
    }

    if (id === undefined || id === null || id === "") {
      alert("Artwork ID is missing.");
      return;
    }

    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this charcoal artwork?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch(
        `http://localhost:8081/api/deletecharcoal/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete artwork. Status: ${response.status}`
        );
      }

      setArts((previousArts) =>
        previousArts.filter(
          (art) => String(art.id) !== String(id)
        )
      );
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete artwork. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * TRIM DESCRIPTION
   */
  const trimWords = (text = "", wordLimit = 15) => {
    const words = text.split(/\s+/);

    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="background gallery-3d-root">
        <h2>Loading charcoal artworks...</h2>
      </div>
    );
  }

  /*
   * ERROR
   */
  if (error) {
    return (
      <div className="background gallery-3d-root">
        <h2>{error}</h2>

        <button
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
            Curated Exhibition • Charcoal &amp; Graphite
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
          Charcoal Sketches
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
          Dynamic tonal range, textured shading, and raw
          emotional depth captured in charcoal.
        </motion.p>

        {/* ADD ARTS BUTTON */}
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
              className="add-arts-btn"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                navigate("/addImages/addCharcols")
              }
            >
              Add Arts
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* ART GRID */}
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
          <p>No charcoal artworks found.</p>
        ) : (
          arts.map((painting, index) => (
            <CharcoalCard3D
              key={painting.id || index}
              painting={painting}
              index={index}
              navigate={navigate}
              trimWords={trimWords}
              onDelete={handleDelete}
              isAuthorized={isAuthorized}
              deletingId={deletingId}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default CharcoalSketches;