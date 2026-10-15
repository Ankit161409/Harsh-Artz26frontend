import React from "react";
import "./Gallery3D.css";

const VideoLoader = ({
  title = "Curating Gallery...",
  subtitle = "Please wait while the artworks load",
  size = "min(720px, 94vw)",
}) => {
  const gifSrc = `${process.env.PUBLIC_URL || ""}/loading-art.gif`;

  return (
    <div className="video-loader">
      <img
        src={gifSrc}
        alt="Loading..."
        className="video-loader-content"
        style={{
          width: size,
          maxWidth: "96vw",
          maxHeight: "75vh",
          objectFit: "contain",
        }}
        onError={(e) => {
          if (e.currentTarget.src !== "/loading-art.gif") {
            e.currentTarget.src = "/loading-art.gif";
          }
        }}
      />
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default VideoLoader;