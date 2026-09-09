// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Coloured } from '../ImportImages/ColouredImport';
 

// // import '../ArtGallery.css';

// const ColouredPencil = () => {
//   const navigate = useNavigate();

//   const trimWords = (text = "", wordLimit = 15) => {
//     const words = text.split(" ");
//     return words.length > wordLimit
//       ? words.slice(0, wordLimit).join(" ") + "..."
//       : text;
//   };
 
 
//   return (
//     <div className="background">
//        <motion.div
        
//               className="hero-content  "
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 hidden: {},
//                 visible: {
//                   transition: {
//                     staggerChildren: 0.25,
//                   },
//                 },
//               }}
//             >
//                <motion.h1
//                className="side"
//                style={{ color: "black" }}
//                         variants={{
//                           hidden: { y: 40, opacity: 0 },
//                           visible: { y: 0, opacity: 1 },
//                         }}
//                         transition={{ duration: 1, ease: "easeOut" }}
//                       >
                
                       
//                       </motion.h1>
//                     </motion.div>
//       {/* Navbar */}
 
//       {/* Gallery */}
//       <motion.div
//         className="gallery-container top"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           hidden: {},
//           visible: {
//             transition: { staggerChildren: 0.1 },
//           },
//         }}
//       >
//         <h1 className="font">Coloured Pencil</h1>
//         {Coloured.map((painting, index) => (
//           <motion.div
//             key={painting.id || index}
//             className="art-card"
//             variants={{
//               hidden: { y: 60, opacity: 0 },
//               visible: { y: 0, opacity: 1 },
//             }}
//             whileHover={{
//               y: -15,
//               scale: 1.02,
//               boxShadow: "0 35px 60px -20px rgba(0,0,0,0.4)",
//             }}
//             transition={{ duration: 0.5, ease: "easeOut" }}
//             onClick={() => navigate(`/painting/Pencil/${index}`)}
//           >
//             <div className="card-image-container">
//               <img
//                 src={painting.img}
//                 alt={painting.title}
//                 className="card-image"
//               />

//               <div className="image-overlay">
//                 <motion.div
//                   className="view-details-btn"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   View Details
//                 </motion.div>
//               </div>
//             </div>

//             <div className="card-content">
//               <motion.h1
//                 className="card-title"
//                 whileHover={{ color: "#a855f7" }}
//               >
//                 {painting.title}
//               </motion.h1>

//               <p className="card-description">
//                 {trimWords(painting.description, 50)}
//               </p>

//               <div className="card-footer">
//                 <span className="artist-name">
//                   by {painting.artist || "Unknown"}
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//   );
// };

// export default ColouredPencil;
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Coloured } from "../ImportImages/ColouredImport.js";
import "./Gallery3D.css";

const ColouredPencilCard3D = ({ painting, index, navigate, trimWords }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const imageSource =
    typeof painting.img === "object" && painting.img !== null
      ? painting.img.default || painting.img.src || painting.img
      : painting.img;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    setRotateX((0.5 - yPercent) * 20);
    setRotateY((xPercent - 0.5) * 20);
    setGlarePos({ x: xPercent * 100, y: yPercent * 100, opacity: 0.45 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      className="art-card-3d-wrapper"
      variants={{
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/painting/Pencil/${index}`)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="art-card-3d-inner"
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.025 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
      >
        <div className="art-card-frame">
          <div className="art-frame-bevel" />

          <div
            className="art-canvas-container"
            style={{
              transform: isHovered ? "translateZ(32px)" : "translateZ(0px)",
              transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <img src={imageSource} alt={painting.title} className="art-canvas-image" />
            <div
              className="art-canvas-glare"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 235, 190, 0.45) 0%, transparent 65%)`,
                opacity: glarePos.opacity,
                transform: "translateZ(38px)",
              }}
            />
            <div
              className="art-card-floating-badge"
              style={{
                transform: isHovered ? "translateZ(48px)" : "translateZ(15px)",
                transition: "transform 0.4s ease",
              }}
            >
              <span className="gallery-badge-dot" />
              <span>Colored Pencil</span>
            </div>

            <div
              className="art-image-overlay"
              style={{ opacity: isHovered ? 1 : 0, transition: "opacity 0.35s ease" }}
            >
              <motion.div
                className="view-details-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  transform: isHovered ? "translateZ(60px)" : "translateZ(20px)",
                  transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              >
                View Details
              </motion.div>
            </div>
          </div>

          <div
            className="art-card-content"
            style={{
              transform: isHovered ? "translateZ(24px)" : "translateZ(0px)",
              transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <motion.h1 className="card-title" whileHover={{ color: "#d4af37" }}>
              {painting.title}
            </motion.h1>
            <p className="card-description">{trimWords(painting.description, 50)}</p>
            <div className="card-footer">
              <span className="artist-name">{/* by {painting.artist || "Unknown"} */}</span>
              <span className="card-curation">Original Piece</span>
            </div>
          </div>
        </div>

        <div
          className="art-card-floor-shadow"
          style={{
            transform: `translateX(${-rotateY * 1.5}px) translateY(${rotateX * 1.2}px)`,
            opacity: isHovered ? 0.95 : 0.45,
            filter: isHovered ? "blur(18px)" : "blur(12px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const ColouredPencil = () => {
  const navigate = useNavigate();

  const trimWords = (text = "", wordLimit = 15) => {
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  return (
    <div className="background gallery-3d-root">
      <div className="gallery-spotlight-beam" />

      <motion.div
        className="hero-content gallery-hero-3d"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div
          className="gallery-badge-pill"
          variants={{ hidden: { y: 25, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="gallery-badge-dot" />
          <span>Curated Exhibition • Colored Pencil Art</span>
        </motion.div>

        <motion.h1
          className="side font gallery-title-3d"
          variants={{ hidden: { y: 35, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Coloured pencil
        </motion.h1>

        <motion.p
          className="gallery-subtitle-3d"
          variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Vibrant pigments, delicate blending, and photorealistic precision in colored pencil.
        </motion.p>

        <motion.div
          className="gallery-hint-banner"
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
         </motion.div>
      </motion.div>

      <motion.div
        className="gallery-container top gallery-grid-3d"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {Coloured.map((painting, index) => (
          <ColouredPencilCard3D
            key={painting.id || index}
            painting={painting}
            index={index}
            navigate={navigate}
            trimWords={trimWords}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ColouredPencil;
