// import React from "react";

// const VideoLoader = () => { return ( <div className="video-loader"> 
// <video className="video-loader-content" autoPlay muted loop playsInline > 
//     <source src="/loading-art.gif" type="video/mp4/gif" />  </video>

//   </div> ); };

// export default VideoLoader;

import React from "react";
import "./Gallery3D.css";

const VideoLoader = ({
  title = "Curating Gallery...",
  subtitle = "Please wait while the artworks load",
}) => {
  const gifSrc = `${process.env.PUBLIC_URL || ""}/loading-art.gif`;

  return (
    <div className="video-loader">
      <img
        src={gifSrc}
        alt="Loading..."
        className="video-loader-content"
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