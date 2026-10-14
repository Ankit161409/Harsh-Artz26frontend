import React from "react";

const VideoLoader = () => { return ( <div className="video-loader"> 
<video className="video-loader-content" autoPlay muted loop playsInline > 
    <source src="/loading-art.mp4" type="video/mp4" />  </video>

  </div> ); };

export default VideoLoader;