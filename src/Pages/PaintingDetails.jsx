import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./ArtGallery.css";
import VideoLoader2 from "../typesOfPaintings/VideoLoader2";

const API_BASE_URL = 
  "https://harsh-arts-backend-2.onrender.com";
 

/* ✅ Map apiType to Spring Boot endpoint */
const getPaintingEndpoint = (apiType, id) => {
  const type = (apiType || "").toLowerCase().trim();

  if (type === "home" || type === "artgallery") return null;

  let endpoint;
  if (type.includes("charcoal"))                                    endpoint = "getCharcoalById";
  else if (type.includes("pencil") || type.includes("colour"))       endpoint = "getColouredPencilById";
  else if (type === "pen" || (type.includes("pen") && !type.includes("pencil")))          endpoint = "getPenSketchById";
  else if (type.includes("digital"))                                endpoint = "getDigitalArtById";
  else if (type.includes("water"))                                  endpoint = "getWaterColorById";
  else if (type.includes("mixed"))                                  endpoint = "getMixedMediaById";
  else return null;

  return `/api/${endpoint}/${encodeURIComponent(id)}`;
};

/* ✅ Medium label */
const getMediumName = (apiType) => {
  const type = (apiType || "").toLowerCase();
  if (type.includes("charcoal"))                                                          return "Charcoal & Graphite Artwork";
  if (type.includes("digital"))                                                           return "Digital Fine Art";
  if (type.includes("water"))                                                             return "Watercolor Painting";
  if (type.includes("pencil") || type.includes("colour") || type.includes("color"))      return "Colored Pencil Art";
  if (type === "pen" || (type.includes("pen") && !type.includes("pencil")))              return "Ball Pen Sketch";
  if (type.includes("mixed"))                                                             return "Mixed Media Artwork";
  return "Original Exhibition Piece";
};

/* ✅ Base64 / URL image converter */
const getImageSrc = (raw) => {
  if (!raw) return "";
  if (typeof raw === "string" && raw.startsWith("http"))  return raw;
  if (typeof raw === "string" && raw.startsWith("data:")) return raw;
  if (typeof raw === "string") {
    if (raw.startsWith("/9j/"))    return `data:image/jpeg;base64,${raw}`;
    if (raw.startsWith("iVBOR"))  return `data:image/png;base64,${raw}`;
    if (raw.startsWith("R0lGOD")) return `data:image/gif;base64,${raw}`;
    if (raw.startsWith("UklGR"))  return `data:image/webp;base64,${raw}`;
    return `data:image/jpeg;base64,${raw}`;
  }
  if (typeof raw === "object" && raw !== null) {
    return raw.default || raw.src || raw.url || "";
  }
  return "";
};

const PaintingDetails = () => {
  const { apiType, id } = useParams();
  const navigate = useNavigate();

  const [painting, setPainting]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const frameRef = useRef(null);
  const [rotateX, setRotateX]     = useState(0);
  const [rotateY, setRotateY]     = useState(0);
  const [glarePos, setGlarePos]   = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed]   = useState(false);
  const [autoOrbit, setAutoOrbit] = useState(false);

  /* ✅ Fetch painting */
  useEffect(() => {
    const controller = new AbortController();

    const fetchPainting = async () => {
      setLoading(true);
      setError("");
      setPainting(null);

      if (!apiType || !id) {
        setError("Painting type or ID is missing.");
        setLoading(false);
        return;
      }

      const endpoint = getPaintingEndpoint(apiType, id);
      if (!endpoint) {
        setError(`No API configured for category "${apiType}".`);
        setLoading(false);
        return;
      }

      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log("🔗 Fetching:", fullUrl);

      try {
        const response = await fetch(fullUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        console.log("📡 Response status:", response.status);

        if (response.status === 503) {
          throw new Error("Server is starting up, please wait 30 seconds and retry!");
        }
        if (response.status === 404) {
          throw new Error("Painting not found.");
        }
        if (!response.ok) {
          throw new Error(`Server error. HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API Data:", data);
        setPainting(data);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("❌ API Error:", err.message);
          setError(err.message || "Unable to load painting details.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchPainting();
    return () => controller.abort();
  }, [apiType, id, retryCount]);

  /* Reset 3D view on route change */
  useEffect(() => {
    setIsZoomed(false);
    setAutoOrbit(false);
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  }, [apiType, id]);

  /* ✅ Get image source - handles base64 + URL */
  const rawImage =
    painting?.img ??
    painting?.imageUrl ??
    painting?.image ??
    painting?.imagePath ??
    painting?.imageData ??
    painting?.base64Image ??
    painting?.photo;

  const imageSource = getImageSrc(rawImage);

  /* 3D mouse handlers */
  const handleMouseMove = (e) => {
    if (!frameRef.current || autoOrbit) return;
    const rect = frameRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;
    setRotateX((0.5 - yPercent) * 26);
    setRotateY((xPercent - 0.5) * 26);
    setGlarePos({ x: xPercent * 100, y: yPercent * 100, opacity: 0.42 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!autoOrbit) {
      setRotateX(0);
      setRotateY(0);
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  const reset3DView = () => {
    setAutoOrbit(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const mediumLabel = getMediumName(apiType);

  /* ✅ Loading screen */
 if (loading) {
  return <VideoLoader2 />;
}

  /* ✅ Error screen with retry */
  if (error || !painting) {
    return (
      <div className="painting-not-found-3d">
        <p>❌ {error || "Painting not found."}</p>
        {error?.includes("starting") || error?.includes("503") ? (
          <p style={{ color: "#888", fontSize: "0.85em", margin: "8px 0" }}>
            🔄 Free server is waking up — wait 30 sec and retry!
          </p>
        ) : null}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button
            type="button"
            className="btn-back-3d"
            onClick={() => setRetryCount((c) => c + 1)}
          >
            🔄 Retry
          </button>
          <button
            type="button"
            className="btn-back-3d"
            onClick={() => navigate(-1)}
          >
            &larr; Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="painting-details-3d-root upperse">
      <div className="details-spotlight-beam" />

      <div className="details-content-wrapper">
        <div className="details-grid-layout">

          {/* 1. INTERACTIVE 3D ARTWORK */}
          <div className="stage-3d-column">
            <div
              ref={frameRef}
              className={`artwork-3d-viewport ${isZoomed ? "zoomed" : ""}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: "1200px" }}
            >
              <motion.div
                className={`artwork-3d-rig ${autoOrbit ? "auto-orbiting" : ""}`}
                animate={{
                  rotateX: autoOrbit ? [12, -12, 12] : rotateX,
                  rotateY: autoOrbit ? [-18, 18, -18] : rotateY,
                  scale: isHovered || isZoomed ? 1.03 : 1,
                }}
                transition={
                  autoOrbit
                    ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    : { type: "spring", stiffness: 280, damping: 24 }
                }
                style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
              >
                <div className="frame-3d-exterior">
                  <div className="frame-gold-fillet" />

                  <div
                    className="canvas-3d-surface"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0d0f17",
                      transform: isHovered ? "translateZ(35px)" : "translateZ(0px)",
                      transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  >
                    {/* ✅ Fixed image */}
                    {imageSource ? (
                      <img
                        src={imageSource}
                        alt={painting.title || "Artwork"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          borderRadius: "10px",
                          pointerEvents: "none",
                        }}
                        onError={(e) => {
                          console.error("❌ Image load failed");
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <p style={{ color: "#fff" }}>Artwork image unavailable</p>
                    )}

                    <div
                      className="canvas-varnish-glare"
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 235, 190, 0.45) 0%, transparent 65%)`,
                        opacity: glarePos.opacity,
                        transform: "translateZ(40px)",
                        mixBlendMode: "screen",
                      }}
                    />
                  </div>

                  <div
                    className="floating-3d-badge"
                    style={{
                      transform: isHovered ? "translateZ(65px)" : "translateZ(20px)",
                      transition: "transform 0.4s ease",
                    }}
                  >
                    <span className="badge-dot" />
                    <span>{mediumLabel}</span>
                  </div>
                </div>

                <div className="frame-floor-shadow" />
              </motion.div>
            </div>

            <div className="stage-controls-bar">
              <button
                type="button"
                className={`tool-btn ${autoOrbit ? "active" : ""}`}
                onClick={() => setAutoOrbit((prev) => !prev)}
              >
                {autoOrbit ? "⏸ Stop Orbit" : "🔄 3D Orbit"}
              </button>
              <button
                type="button"
                className={`tool-btn ${isZoomed ? "active" : ""}`}
                onClick={() => setIsZoomed((prev) => !prev)}
              >
                {isZoomed ? "🔍 Zoom Out" : "🔍 Zoom In"}
              </button>
              <button type="button" className="tool-btn" onClick={reset3DView}>
                ⟲ Reset Angle
              </button>
            </div>

            <div className="stage-hint">
              <span>✦ Hover and tilt mouse to inspect canvas in 3D space</span>
            </div>
          </div>

          {/* 2. PAINTING DETAILS */}
          <div className="details-info-column">
            <motion.div
              className="info-3d-glass-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="info-top-header">
                <span className="provenance-tag">Exhibition Piece</span>
                <span className="provenance-year">The Haat of Art 2026</span>
              </div>

              <h1 className="title-art-3d">
                {painting.title || "Untitled Artwork"}
              </h1>

              {painting.description && (
                <p className="description-art-3d">{painting.description}</p>
              )}

              <div className="artwork-meta-box">
                <div className="meta-item">
                  <span className="meta-label">Medium</span>
                  <span className="meta-value">{mediumLabel}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Exhibition</span>
                  <span className="meta-value">The Haat of Art • 2026</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Availability</span>
                  <span className="meta-value status-available">
                    {painting.availability || "Original Available"}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Authenticity</span>
                  <span className="meta-value">
                    {painting.authenticity || "Signed by Harsh Artz"}
                  </span>
                </div>
              </div>

              <div className="action-buttons-group">
                <motion.button
                  type="button"
                  className="btn-back-3d"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                >
                  &larr; Back to Gallery
                </motion.button>
                <Link to="/Lets-connect" className="btn-inquire-3d">
                  <span>Inquire About Artwork &rarr;</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. FULLSCREEN ZOOM MODAL */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="zoom-inspect-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="zoom-modal-content"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="zoom-close-btn"
                onClick={() => setIsZoomed(false)}
                aria-label="Close zoom view"
              >
                &times;
              </button>
              {imageSource && (
                <img
                  src={imageSource}
                  alt={painting.title || "Artwork"}
                  className="zoom-modal-img"
                />
              )}
              <div className="zoom-modal-caption">
                <h3>{painting.title || "Untitled Artwork"}</h3>
                <p>{mediumLabel}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaintingDetails;