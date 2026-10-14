 

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { homePaintings } from "../ArtGalleryData";
import "./ArtGallery.css";

// --- LIVING 3D STARRY SKY CANVAS ---
const StarrySky = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse parallax offsets
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / width - 0.5) * 40;
      targetMouseY = (e.clientY / height - 0.5) * 40;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Generate 250 Stars
    const numStars = 250;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      depth: Math.random() * 0.8 + 0.2, // for 3D parallax depth
    }));

    // Shooting Stars (Meteors)
    const shootingStars = [];
    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg
        opacity: 1,
      });
    };

    let shootingStarTimer = 0;

    // Render Loop
    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Twinkling Stars with Parallax
      stars.forEach((star) => {
        // Twinkle
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.twinkleDir = 1;
        }

        // Parallax position
        const px = star.x + mouseX * star.depth;
        const py = star.y + mouseY * star.depth;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
      });

      // 2. Spawn and Draw Shooting Stars
      shootingStarTimer++;
      if (shootingStarTimer > 180 && Math.random() < 0.03) {
        createShootingStar();
        shootingStarTimer = 0;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        grad.addColorStop(0.4, `rgba(168, 85, 247, ${s.opacity * 0.8})`);
        grad.addColorStop(1, `rgba(168, 85, 247, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.015;

        if (s.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="starry-sky-canvas" />;
};

// --- 3D INTERACTIVE ART CARD ---
const ArtCard3D = ({ painting, index, navigate, trimWords }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="art-card"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      variants={{
        hidden: { y: 60, opacity: 0, scale: 0.95 },
        visible: { y: 0, opacity: 1, scale: 1 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // onClick={() => navigate(`/painting/artgallery/${index}`)}
    >
      <div className="card-image-container">
        <img src={painting.img} alt={painting.title} className="card-image" />
        <div className="image-overlay">
          <motion.div
            className="view-details-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details ✦
          </motion.div>
        </div>
      </div>

      <div className="card-content">
        <motion.h1 className="card-title" whileHover={{ color: "#c084fc" }}>
          {painting.title}
        </motion.h1>

        <p className="card-description">
          {trimWords(painting.description, 50)}
        </p>

        <div className="card-footer">
          <span className="artist-name">
            by {painting.artist || "Harsh artz"}
          </span>
          <span className="star-constellation-icon">✧</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN ART GALLERY COMPONENT ---
const ArtGallery = () => {
  const navigate = useNavigate();

  const trimWords = (text = "", wordLimit = 15) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div className="art-gallery-page">
      {/* 1. Living Animated 3D Starfield & Shooting Stars */}
      <StarrySky />

      {/* 2. Cosmic Nebula Gradients */}
      <div className="nebula-cloud nebula-purple" />
      <div className="nebula-cloud nebula-cyan" />
      <div className="nebula-cloud nebula-pink" />

      {/* 3. Header */}
      <div className="gallery-header-section">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sky-subtitle"
        >
          ✦ CELESTIAL EXHIBITION ✦
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sky-title"
        >
          Art Beneath the Stars
        </motion.h1>
      </div>

      {/* 4. 3D Gallery Cards */}
      <motion.div
        className="gallery-container top"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {homePaintings.map((painting, index) => (
          <ArtCard3D
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

export default ArtGallery;