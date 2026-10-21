import React from "react";
import "./Gallery3D.css";

const VideoLoader2 = ({
  title = "Curating Gallery...",
  subtitle = "Please wait while the artworks load",
  size = "min(720px, 94vw)",
}) => {
  const gifSrc = `${process.env.PUBLIC_URL || ""}/patrickLoader.gif`;

  return (
    <div className="video-loader">
      <img
        src={gifSrc}
        alt="Loading..."
        className="video-loader-content"
        style={{
          width: size,
          maxWidth: "55vw",
          maxHeight: "35vh",
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

export default VideoLoader2;