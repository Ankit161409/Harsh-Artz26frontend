import React, { useState, useRef } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const cardRef = useRef(null);

  // Calculate 3D tilt angles based on cursor position
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt limits: -14 to +14 degrees
    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);
    alert("Login details saved!");
  };

  return (
    <div style={styles.container}>
      {/* 3D Background Ambient Orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Perspective Wrapper */}
      <div style={styles.perspectiveWrapper}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            ...styles.card,
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${
              isHovered ? 1.03 : 1
            }, ${isHovered ? 1.03 : 1}, 1)`,
            transition: isHovered
              ? "transform 0.08s ease-out"
              : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {/* Dynamic Light Sheen / Glare */}
          <div
            style={{
              ...styles.glare,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
              opacity: glare.opacity,
            }}
          />

          <form onSubmit={handleSubmit} style={styles.formContent}>
            {/* 3D Floating Icon (High depth) */}
            <div style={styles.icon3d}>
              <span style={{ fontSize: "28px" }}>🔐</span>
            </div>

            {/* 3D Floating Title */}
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Enter your credentials to continue</p>

            {/* Inputs (Medium depth) */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            {/* 3D Tactile Push Button */}
            <button type="submit" style={styles.button}>
              <span style={styles.buttonText}>Sign In</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(ellipse at top, #1e2640 0%, #0d111b 100%)",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, transparent 70%)",
    top: "12%",
    left: "18%",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)",
    bottom: "10%",
    right: "15%",
    filter: "blur(50px)",
    pointerEvents: "none",
  },
  perspectiveWrapper: {
    perspective: "1200px",
    zIndex: 10,
  },
  card: {
    width: "380px",
    padding: "40px 32px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: `
      0 30px 60px -12px rgba(0, 0, 0, 0.55),
      0 18px 36px -18px rgba(0, 0, 0, 0.6),
      inset 0 1px 1px rgba(255, 255, 255, 0.3)
    `,
    position: "relative",
    transformStyle: "preserve-3d",
    cursor: "default",
  },
  glare: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "20px",
    pointerEvents: "none",
    transition: "opacity 0.2s ease-out",
  },
  formContent: {
    display: "flex",
    flexDirection: "column",
    transformStyle: "preserve-3d",
  },
  icon3d: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    margin: "0 auto 16px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.5)",
    transform: "translateZ(55px)", // Floats high above the card
  },
  title: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 6px 0",
    transform: "translateZ(45px)", // Floats above card
    textShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    textAlign: "center",
    margin: "0 0 24px 0",
    transform: "translateZ(35px)",
  },
  inputGroup: {
    marginBottom: "18px",
    transformStyle: "preserve-3d",
  },
  label: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "13px",
    marginBottom: "6px",
    fontWeight: "500",
    transform: "translateZ(30px)",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    boxSizing: "border-box",
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    transform: "translateZ(35px)", // Floats at intermediate depth
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
    transition: "border 0.2s, box-shadow 0.2s",
  },
  button: {
    marginTop: "10px",
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transform: "translateZ(50px)", // Floats prominently
    boxShadow: `
      0 6px 0 #3730a3,
      0 12px 20px rgba(79, 70, 229, 0.45)
    `,
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
    position: "relative",
  },
  buttonText: {
    transform: "translateZ(20px)",
    display: "inline-block",
  },
};