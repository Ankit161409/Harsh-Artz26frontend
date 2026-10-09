import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

export default function AddImage() {
  const { painting } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // 3D Tilt & Lighting State
  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      x: 0,
      y: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !image) {
      alert("Please enter a title and select an image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      const response = await fetch(`http://localhost:8081/api/${painting}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Success:", data);

      alert("Post uploaded successfully!");

      setTitle("");
      setImage(null);
      setPreview("");
      document.getElementById("imageInput").value = "";
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Ambient 3D floating background spheres */}
      <div style={styles.ambientSphere1} />
      <div style={styles.ambientSphere2} />

      {/* Perspective Container */}
      <div style={styles.perspectiveContainer}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            ...styles.card,
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${
              tilt.y
            }deg) scale3d(
              ${tilt.isHovered ? 1.02 : 1},
              ${tilt.isHovered ? 1.02 : 1},
              1
            )`,
            transition: tilt.isHovered
              ? "transform 0.08s ease-out"
              : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {/* Dynamic Light Sheen / Specular Glare */}
          <div
            style={{
              ...styles.glare,
              opacity: tilt.isHovered ? 0.35 : 0,
              background: `radial-gradient(
                circle at ${tilt.glareX}% ${tilt.glareY}%,
                rgba(255,255,255,0.7) 0%,
                transparent 60%
              )`,
            }}
          />

          {/* Layer 0: 3D Back Button */}
          <div style={styles.layerBackBtn}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.backButton}
              title="Go Back"
            >
              <span style={styles.backIcon}>←</span>
              <span>Back</span>
            </button>
          </div>

          {/* Layer 1: Title */}
          <div style={styles.layerTitle}>
            <h2 style={styles.title}>
              Create {painting ? painting.charAt(0).toUpperCase() + painting.slice(1) : "Art"} Post
            </h2>
            <p style={styles.subtitle}>
              Upload your artwork to the 3D gallery
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Layer 2: Title Input */}
            <div style={styles.layerInput}>
              <label style={styles.label}>Artwork Title</label>
              <input
                type="text"
                placeholder="e.g. Whispers in Charcoal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Layer 3: 3D File Upload Drop Box */}
            <div style={styles.layerUpload}>
              <label htmlFor="imageInput" style={styles.uploadZone}>
                <div style={styles.uploadIcon}>🎨</div>
                <span style={styles.uploadText}>
                  {image ? image.name : "Click to select or drop charcoal piece"}
                </span>
                <span style={styles.uploadSubtext}>
                  PNG, JPG, WEBP accepted
                </span>
              </label>

              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Layer 4: 3D Image Preview */}
            {preview && (
              <div style={styles.layerPreview}>
                <div style={styles.previewContainer}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={styles.previewImage}
                  />
                  <div style={styles.previewBadge}>3D Preview</div>
                </div>
              </div>
            )}

            {/* Layer 5: Pushable 3D Button */}
            <div style={styles.layerButton}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button3d,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <span style={styles.buttonTop}>
                  {loading ? "Uploading Artwork..." : "Publish to Gallery"}
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
  pageWrapper: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(ellipse at 50% 20%, #1a1e28 0%, #0d0f14 100%)",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

  ambientSphere1: {
    position: "absolute",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
    top: "5%",
    left: "15%",
    filter: "blur(40px)",
    pointerEvents: "none",
  },

  ambientSphere2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
    bottom: "10%",
    right: "15%",
    filter: "blur(40px)",
    pointerEvents: "none",
  },

  perspectiveContainer: {
    perspective: "1200px",
    zIndex: 2,
  },

  card: {
    width: "420px",
    maxWidth: "92vw",
    padding: "35px 30px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(30, 34, 45, 0.75) 0%, rgba(18, 20, 28, 0.85) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: `
      0 20px 50px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 1px rgba(255, 255, 255, 0.2)
    `,
    transformStyle: "preserve-3d",
    position: "relative",
    color: "#ffffff",
    boxSizing: "border-box",
  },

  glare: {
    position: "absolute",
    inset: 0,
    borderRadius: "24px",
    pointerEvents: "none",
    zIndex: 10,
    transition: "opacity 0.25s ease",
  },

  layerBackBtn: {
    transform: "translateZ(40px)",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "16px",
  },

  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.07)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    transition: "all 0.2s ease",
  },

  backIcon: {
    fontSize: "15px",
    lineHeight: "1",
  },

  layerTitle: {
    transform: "translateZ(35px)",
    textAlign: "center",
    marginBottom: "25px",
  },

  title: {
    margin: "0 0 6px 0",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    background: "linear-gradient(180deg, #FFFFFF 0%, #B0B7C3 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 8px 18px rgba(0, 0, 0, 0.4)",
  },

  subtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#8c96a7",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    transformStyle: "preserve-3d",
  },

  layerInput: {
    transform: "translateZ(25px)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#a0aec0",
  },

  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#f8fafc",
    background: "rgba(15, 17, 23, 0.65)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
    transition: "all 0.2s ease",
  },

  layerUpload: {
    transform: "translateZ(30px)",
  },

  uploadZone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 15px",
    borderRadius: "14px",
    background: "rgba(22, 26, 36, 0.5)",
    border: "1.5px dashed rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
  },

  uploadIcon: {
    fontSize: "28px",
    marginBottom: "6px",
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
  },

  uploadText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#cbd5e1",
    textAlign: "center",
    wordBreak: "break-all",
  },

  uploadSubtext: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "3px",
  },

  layerPreview: {
    transform: "translateZ(50px)",
    display: "flex",
    justifyContent: "center",
  },

  previewContainer: {
    position: "relative",
    borderRadius: "14px",
    padding: "6px",
    background: "rgba(255, 255, 255, 0.08)",
    boxShadow:
      "0 15px 35px rgba(0, 0, 0, 0.6), 0 0 15px rgba(99, 102, 241, 0.3)",
    transform: "rotate(-2deg)",
    transition: "transform 0.3s ease",
  },

  previewImage: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    display: "block",
  },

  previewBadge: {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(8px)",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },

  layerButton: {
    transform: "translateZ(40px)",
    marginTop: "5px",
  },

  button3d: {
    width: "100%",
    background: "#3b3691",
    borderRadius: "14px",
    border: "none",
    padding: 0,
    outlineOffset: "4px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.4)",
  },

  buttonTop: {
    display: "block",
    padding: "14px 20px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    transform: "translateY(-4px)",
    transition: "transform 0.15s cubic-bezier(0.3, 0.7, 0.4, 1.5)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  },
};