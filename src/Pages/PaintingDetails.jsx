 

// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { homePaintings } from "../ArtGalleryData"; 
// import  {Charcoal}  from "../ImportImages/CharcoalImport.js";
// import  {digitalArt}  from "../ImportImages/DigitalImport.js";
// import  {Water}  from "../ImportImages/WaterColorPaintingImport.js";
// import  { Coloured}  from "../ImportImages/ColouredImport.js";
// import  { Mixed}  from "../ImportImages/MixedMediaImport.js";
// import  { Pen}  from "../ImportImages/PenSketchesImport.js";





 
// import "./ArtGallery.css";
// import { motion } from "framer-motion";

// const PaintingDetails = () => {
//   const { apiType, id } = useParams();
//   const navigate = useNavigate();


   
//   let painting;

//   switch (apiType) {
//     case "home":
//       painting = homePaintings[Number(id)];
//       break;

//     case "CharcoalImport":
//       painting = Charcoal[Number(id)];
//       break;
 
//       case "artgallery":
//       painting = homePaintings[Number(id)];
//       break;

//        case "digital":
//       painting = digitalArt[Number(id)];
//       break;

//         case "Water":
//       painting = Water[Number(id)];
//       break;

//         case "Pencil":
//       painting = Coloured[Number(id)];
//       break;

//        case "Mixed":
//       painting = Mixed[Number(id)];
//       break;

//           case "Pen":
//       painting = Pen[Number(id)];
//       break;

  
//     default:
//       painting = null;
//   }

  
//   if (!painting) return <p>Painting not found</p>;

//   // Animation variants
//   const container = {
//     hidden: {},
//     visible: {
//       transition: {
//         staggerChildren: 0.3,
//       },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 40 },
//     visible: { opacity: 1, y: 0 },
//   };

//   return (
//     <motion.div
//       className="container-fluid top"
//       style={{ padding: "40px" }}
//       variants={container}
//       initial="hidden"
//       animate="visible"
//     >
//       <div className="row">

//         {/* Animated Image */}
//         <div className="col-md-5 d-flex justify-content-center">
//           <motion.img
//             src={painting.img}
//             alt={painting.title}
//             variants={item}
//             transition={{ duration: 0.8 }}
//             style={{
//               maxWidth: "600px",
//               width: "100%",
//               borderRadius: "15px",
//             }}
//           />
//         </div>
 
//         {/* Animated Text Section */}
//         <div className="col-md-7">

//           <motion.h1
//             className="text-center lefts"
//             variants={item}
//             transition={{ duration: 0.8 }}
//           >
//        <p className='left '> {painting.title}   </p>
//           </motion.h1>

//           <motion.p
//             style={{ marginTop: "20px", fontSize: "1.1rem" }}
//             variants={item}
//           >
//             {painting.description}
//           </motion.p>


//           <motion.p
//             style={{ marginTop: "20px", fontSize: "1.1rem" }}
//             variants={item}
//           >
       
//        {/*  */}
//           </motion.p>
          

//           <motion.button
//             variants={item}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate(-1)}
//             style={{
//               marginTop: "30px",
//               padding: "10px 20px",
//               backgroundColor: "#6c63ff",
//               color: "white",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//             }}
//           >
//             Back to Gallery
//           </motion.button>

//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default PaintingDetails;

import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { homePaintings } from "../ArtGalleryData";
import { Charcoal } from "../ImportImages/CharcoalImport.js";
import { digitalArt } from "../ImportImages/DigitalImport.js";
import { Water } from "../ImportImages/WaterColorPaintingImport.js";
import { Coloured } from "../ImportImages/ColouredImport.js";
import { Mixed } from "../ImportImages/MixedMediaImport.js";
import { Pen } from "../ImportImages/PenSketchesImport.js";

import "./ArtGallery.css";

/* Helper to get clean medium label */
const getMediumName = (apiType) => {
  const type = (apiType || "").toLowerCase();
  if (type.includes("charcoal")) return "Charcoal & Graphite Artwork";
  if (type.includes("digital")) return "Digital Fine Art";
  if (type.includes("water")) return "Watercolor Painting";
  // Check pencil before pen
  if (type.includes("pencil") || type.includes("colour") || type.includes("color")) return "Colored Pencil Art";
  if (type === "pen" || (type.includes("pen") && !type.includes("pencil"))) return "Ball Pen Sketch";
  if (type.includes("mixed")) return "Mixed Media Artwork";
  return "Original Exhibition Piece";
};

/* Robust lookup for both array index and object ID */
const findInCollection = (collection, id) => {
  if (!collection || !Array.isArray(collection)) return null;
  const numId = Number(id);
  // 1. Direct array index check
  if (!isNaN(numId) && collection[numId] !== undefined) {
    return collection[numId];
  }
  // 2. Fallback check by item.id
  return collection.find((item) => String(item?.id) === String(id)) || null;
};

const PaintingDetails = () => {
  const { apiType, id } = useParams();
  const navigate = useNavigate();

  // 3D Tilt & Inspection States
  const frameRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [autoOrbit, setAutoOrbit] = useState(false);

  // Case-insensitive, robust collection selector
  const type = (apiType || "").toLowerCase().trim();
  let painting = null;

  if (type === "home" || type === "artgallery") {
    painting = findInCollection(homePaintings, id);
  } else if (type.includes("charcoal")) {
    painting = findInCollection(Charcoal, id);
  } else if (type.includes("pencil") || type.includes("colour") || type.includes("color")) {
    // CRITICAL: Checked BEFORE "pen" because "pencil".includes("pen") is true!
    painting = findInCollection(Coloured, id);
  } else if (type === "pen" || (type.includes("pen") && !type.includes("pencil"))) {
    painting = findInCollection(Pen, id);
  } else if (type.includes("digital")) {
    painting = findInCollection(digitalArt, id);
  } else if (type.includes("water")) {
    painting = findInCollection(Water, id);
  } else if (type.includes("mixed")) {
    painting = findInCollection(Mixed, id);
  }

  // If painting not found
  if (!painting) {
    return (
      <div className="painting-not-found-3d">
        <p>Painting not found</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-back-3d"
        >
          &larr; Back to Gallery
        </button>
      </div>
    );
  }

  // Extract valid image source (handles module imports and string paths)
  const imageSource =
    typeof painting.img === "object" && painting.img !== null
      ? painting.img.default || painting.img.src || painting.img
      : painting.img;

  // 3D Mouse Movement
  const handleMouseMove = (e) => {
    if (!frameRef.current || autoOrbit) return;
    const rect = frameRef.current.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    const tiltX = (0.5 - yPercent) * 26;
    const tiltY = (xPercent - 0.5) * 26;

    setRotateX(tiltX);
    setRotateY(tiltY);
    setGlarePos({
      x: xPercent * 100,
      y: yPercent * 100,
      opacity: 0.42,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

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

  return (
    <div className="painting-details-3d-root">
      {/* Overhead Volumetric Spotlight */}
      <div className="details-spotlight-beam" />

      <div className="details-content-wrapper">
        <div className="details-grid-layout">
          {/* ================================================= */}
          {/* 1. INTERACTIVE 3D ARTWORK STAGE                   */}
          {/* ================================================= */}
          <div className="stage-3d-column">
            <div
              ref={frameRef}
              className={`artwork-3d-viewport ${isZoomed ? "zoomed" : ""}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
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
                style={{
                  transformStyle: "preserve-3d",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* 3D Physical Museum Frame */}
                <div className="frame-3d-exterior">
                  <div className="frame-gold-fillet" />

                  {/* Canvas surface with native <img> for guaranteed loading of filenames with parentheses */}
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
                    />

                    {/* Specular Varnish Glare Effect */}
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

                  {/* 3D Floating Category Pill */}
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

                {/* 3D Floor Shadow */}
                <div className="frame-floor-shadow" />
              </motion.div>
            </div>

            {/* 3D Interactive Tool Bar */}
            <div className="stage-controls-bar">
              <button
                type="button"
                className={`tool-btn ${autoOrbit ? "active" : ""}`}
                onClick={() => setAutoOrbit(!autoOrbit)}
                title="Toggle 3D continuous auto-orbit"
              >
                {autoOrbit ? "⏸ Stop Orbit" : "🔄 3D Orbit"}
              </button>

              <button
                type="button"
                className={`tool-btn ${isZoomed ? "active" : ""}`}
                onClick={() => setIsZoomed(!isZoomed)}
                title="Toggle zoom inspection"
              >
                {isZoomed ? "🔍 Zoom Out" : "🔍 Zoom In"}
              </button>

              <button
                type="button"
                className="tool-btn"
                onClick={reset3DView}
                title="Reset 3D camera angle"
              >
                ⟲ Reset Angle
              </button>
            </div>

            <div className="stage-hint">
              <span>✦ Hover and tilt mouse to inspect canvas in 3D space</span>
            </div>
          </div>

          {/* ================================================= */}
          {/* 2. 3D DETAILS & PROVENANCE GLASS CARD             */}
          {/* ================================================= */}
          <div className="details-info-column">
            <motion.div
              className="info-3d-glass-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Provenance Header */}
              <div className="info-top-header">
                <span className="provenance-tag">Exhibition Piece</span>
                <span className="provenance-year">The Haat of Art 2026</span>
              </div>

              {/* EXACT ORIGINAL TITLE */}
              <h1 className="title-art-3d">{painting.title}</h1>

              {/* EXACT ORIGINAL DESCRIPTION */}
              {painting.description && (
                <p className="description-art-3d">{painting.description}</p>
              )}

              {/* Artwork Metadata Grid */}
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
                  <span className="meta-value status-available">Original Available</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Authenticity</span>
                  <span className="meta-value">Signed by Artist</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-group">
                {/* EXACT ORIGINAL BUTTON: "Back to Gallery" */}
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

      {/* Fullscreen 3D Modal Inspect */}
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
              >
                &times;
              </button>
              <img
                src={imageSource}
                alt={painting.title}
                className="zoom-modal-img"
              />
              <div className="zoom-modal-caption">
                <h3>{painting.title}</h3>
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