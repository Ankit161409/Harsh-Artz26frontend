import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // Navigation countdown & status states
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [showHint, setShowHint] = useState(false);

  // Runaway / dodging button state
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0, rotate: 0 });

  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // Credentials are required to unlock the login button
  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

  // Clear timers on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // When both ID & Password are typed, reset button back to center and keep it still
  useEffect(() => {
    if (isFormValid) {
      setBtnOffset({ x: 0, y: 0, rotate: 0 });
      setShowHint(false);
    }
  }, [isFormValid]);

  // Handle runaway button hover: jumps to a new position away from cursor whenever hovered
  const handleButtonHover = (e) => {
    if (isFormValid) return;

    setBtnOffset((prev) => {
      // Possible dodge destination offsets
      const offsets = [
        { x: -75, y: -25 },
        { x: 75, y: -25 },
        { x: -75, y: 25 },
        { x: 75, y: 25 },
        { x: -85, y: 0 },
        { x: 85, y: 0 },
        { x: 0, y: -30 },
        { x: 0, y: 30 },
      ];

      // Keep only offsets noticeably different from the current position so it always jumps
      const distantOffsets = offsets.filter(
        (pos) => Math.abs(pos.x - prev.x) > 40 || Math.abs(pos.y - prev.y) > 20
      );

      // Prioritize opposite direction of the cursor if cursor coordinates are available
      if (e && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const cursorOnRight = cursorX > btnCenterX;
        const cursorOnBottom = cursorY > btnCenterY;

        // If cursor is on right, prefer moving left (x < 0); if on bottom, prefer moving top (y < 0)
        const oppositeOffsets = distantOffsets.filter(
          (pos) =>
            (cursorOnRight ? pos.x < 0 : pos.x > 0) ||
            (cursorOnBottom ? pos.y < 0 : pos.y > 0)
        );

        if (oppositeOffsets.length > 0) {
          const choice =
            oppositeOffsets[Math.floor(Math.random() * oppositeOffsets.length)];
          return { ...choice, rotate: (Math.random() - 0.5) * 14 };
        }
      }

      const fallback =
        distantOffsets[Math.floor(Math.random() * distantOffsets.length)] ||
        offsets[0];
      return { ...fallback, rotate: (Math.random() - 0.5) * 14 };
    });

    setShowHint(true);
  };

  // Handle Back button click with 2-second delay
  const handleBack = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    setCountdown(2);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    timerRef.current = setTimeout(() => {
      try {
        navigate("/");
      } catch {
        window.location.href = "/";
      }
    }, 2000);
  };

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

  // Login submission: saves credentials and auto-redirects without alert or extra button presses
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      handleButtonHover(e);
      return;
    }

    // Save details to sessionStorage
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("isLoggedIn", "true");

    setIsSuccess(true);
    setIsNavigating(true);
    setCountdown(1);

    // Auto-redirect to home smoothly without alert
    timerRef.current = setTimeout(() => {
      try {
        navigate(-1);
      } catch {
        window.location.href = "/";
      }
    }, 1200);
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

       
          
          {/* Success Banner Alert */}
          {isSuccess && (
            <div style={styles.successAlert}>
              🎉 Login Successful! Welcome back, <strong>{username}</strong>! Redirecting to Home...
            </div>
          )}

          {/* Navigation Banner Alert (for Back button) */}
          {isNavigating && !isSuccess && (
            <div style={styles.navAlert}>
              Redirecting to home in <strong>{countdown}s</strong>...
            </div>
          )}

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

            {/* Runaway Button Area */}
            <div style={styles.buttonArea}>
              <button
                ref={buttonRef}
                type="submit"
                onMouseEnter={handleButtonHover}
                onMouseOver={handleButtonHover}
                onClick={(e) => {
                  if (!isFormValid) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleButtonHover(e);
                  }
                }}
                onTouchStart={(e) => {
                  if (!isFormValid) {
                    e.preventDefault();
                    handleButtonHover(e);
                  }
                }}
                disabled={isNavigating && isSuccess}
                style={{
                  ...styles.button,
                  width: isFormValid ? "100%" : "85%",
                  transform: `translate3d(${btnOffset.x}px, ${btnOffset.y}px, 40px) rotate(${btnOffset.rotate}deg)`,
                  transition: isFormValid
                    ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.3s ease, background 0.3s ease, box-shadow 0.3s ease"
                    : "transform 0.15s ease-out, width 0.3s ease",
                  background: isSuccess
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : isFormValid
                    ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
                    : "linear-gradient(135deg, #475569 0%, #334155 100%)",
                  boxShadow: isSuccess
                    ? "0 6px 0 #047857, 0 12px 25px rgba(16, 185, 129, 0.5)"
                    : isFormValid
                    ? "0 6px 0 #4f46e5, 0 12px 25px rgba(99, 102, 241, 0.5)"
                    : "0 6px 0 #1e293b, 0 8px 15px rgba(0, 0, 0, 0.4)",
                  cursor: isSuccess
                    ? "default"
                    : isFormValid
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                <span style={styles.buttonText}>
                  {isSuccess
                    ? "✓ Logging in..."
                    : isFormValid
                    ? "Sign In 🔓"
                    : "Sign In 🔒"}
                </span>
              </button>
            </div>

           
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
    background:
      "radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, transparent 70%)",
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
    background:
      "radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)",
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
    padding: "32px 32px 36px 32px",
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
  topBar: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "12px",
    transform: "translateZ(40px)",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "8px",
    padding: "6px 12px",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    outline: "none",
  },
  successAlert: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    border: "1px solid rgba(16, 185, 129, 0.45)",
    borderRadius: "8px",
    color: "#6ee7b7",
    fontSize: "13px",
    padding: "10px 14px",
    textAlign: "center",
    marginBottom: "16px",
    transform: "translateZ(45px)",
  },
  navAlert: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    border: "1px solid rgba(99, 102, 241, 0.4)",
    borderRadius: "8px",
    color: "#c7d2fe",
    fontSize: "13px",
    padding: "8px 12px",
    textAlign: "center",
    marginBottom: "16px",
    transform: "translateZ(45px)",
  },
  warningAlert: {
    backgroundColor: "rgba(234, 179, 8, 0.15)",
    border: "1px solid rgba(234, 179, 8, 0.4)",
    borderRadius: "8px",
    color: "#fde047",
    fontSize: "12px",
    padding: "8px 12px",
    textAlign: "center",
    marginTop: "12px",
    transform: "translateZ(35px)",
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
    transform: "translateZ(55px)",
  },
  title: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 6px 0",
    transform: "translateZ(45px)",
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
    transform: "translateZ(35px)",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
    transition: "border 0.2s, box-shadow 0.2s",
  },
  buttonArea: {
    width: "100%",
    minHeight: "70px",
    margin: "8px 0 4px 0",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transformStyle: "preserve-3d",
  },
  button: {
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    position: "relative",
    userSelect: "none",
  },
  buttonText: {
    transform: "translateZ(20px)",
    display: "inline-block",
  },
  secondaryBackBtn: {
    marginTop: "16px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "center",
    transform: "translateZ(30px)",
    transition: "color 0.2s",
    outline: "none",
  },
};