// /**CORE LIBRARIES IMPORT */
// import React from "react";
// import { motion } from "framer-motion";

// const Hero = () => {
//   return (
//     <section className="hero">
      
//       {/* OVERLAY */}
//       <motion.div
//         className="hero-overlay"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1.2, ease: "easeOut" }}
//       />

//       {/* CONTENT */}
//       <motion.div
//         className="hero-content"
//         initial="hidden"
//         animate="visible"
//         variants={{
//           hidden: {},
//           visible: {
//             transition: {
//               staggerChildren: 0.25,
//             },
//           },
//         }}
//       >
//         <motion.p
//         style={{ color: "#FFD700" }}
//           variants={{
//             hidden: { y: 30, opacity: 0 },
//             visible: { y: 0, opacity: 1 },
//           }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         >
//           Explore His World
//         </motion.p>

//         <motion.h1
//           variants={{
//             hidden: { y: 40, opacity: 0 },
//             visible: { y: 0, opacity: 1 },
//           }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         >
//           Artist  <br /> HArsh GauTam
//         </motion.h1>
//       </motion.div>

//     </section>
//   );
// };

// export default Hero;


/** CORE LIBRARIES IMPORT */
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import posterImg from "../Images/additionalImages/poster1.png";
  

const Hero = () => {
  const heroRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0.15 });
  const [isHovered, setIsHovered] = useState(false);

  // Real-time 3D mouse parallax tracking
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    // Smooth tilt angle calculation
    const tiltX = (0.5 - yPercent) * 16;
    const tiltY = (xPercent - 0.5) * 16;

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
    setGlarePos({ x: 50, y: 50, opacity: 0.15 });
  };

  return (
    <section
      ref={heroRef}
      className="hero hero-3d-root"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1200px" }}
    >
      {/* 3D PARALLAX BACKGROUND POSTER LAYER */}
      <motion.div
        className="hero-3d-bg-layer"
        animate={{
          x: -rotateY * 1.8,
          y: rotateX * 1.8,
          scale: isHovered ? 1.05 : 1.02,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 28 }}
        style={{
          backgroundImage: `url(${posterImg})`,
        }}
      />

      {/* 3D VOLUMETRIC SPOTLIGHT & OVERLAY */}
      <motion.div
        className="hero-overlay hero-3d-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div
          className="hero-3d-spotlight"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(212, 175, 55, ${glarePos.opacity}) 0%, transparent 65%)`,
          }}
        />
      </motion.div>

      {/* 3D FLOATING SPATIAL RIG */}
      <motion.div
        className="hero-3d-rig"
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 24,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* 3D GLASS PEDESTAL CARD & ORIGINAL CONTENT */}
        <motion.div
          className="hero-content hero-3d-card"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.25,
              },
            },
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle 3D Museum Plaque Accents */}
          <div className="hero-3d-fillet" />

          {/* 3D Floating Exhibition Pill */}
          <motion.div
            className="hero-3d-badge"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              transform: isHovered ? "translateZ(55px)" : "translateZ(30px)",
              transition: "transform 0.4s ease",
            }}
          >
             
          </motion.div>

          {/* EXACT ORIGINAL PARAGRAPH */}
          <motion.p
            className="hero-3d-lead"
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              color: "#FFD700",
              transform: isHovered ? "translateZ(75px)" : "translateZ(45px)",
              transition: "transform 0.4s ease",
            }}
          >
            Explore His World
          </motion.p>

          {/* EXACT ORIGINAL HEADING */}
          <motion.h1
            className="hero-3d-title"
            variants={{
              hidden: { y: 40, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              transform: isHovered ? "translateZ(95px)" : "translateZ(60px)",
              transition: "transform 0.4s ease",
            }}
          >
            Artist <br /> HArsh GauTam
          </motion.h1>

          {/* 3D Interactive Depth Hint */}
          <motion.div
            className="hero-3d-depth-hint"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ delay: 0.8, duration: 1 }}
            style={{
              transform: isHovered ? "translateZ(45px)" : "translateZ(20px)",
              transition: "transform 0.4s ease",
            }}
          >
        
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating 3D Scroll Down Prompt */}
      <motion.div
        className="hero-3d-scroll-indicator"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="scroll-arrow">&darr;</span>
      </motion.div>
    </section>
  );
};

export default Hero;