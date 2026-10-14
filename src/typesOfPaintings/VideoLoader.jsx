import React from "react";

const VideoLoader = () => { return ( <div className="video-loader"> 
<video className="video-loader-content" autoPlay muted loop playsInline > 
    <source src="/loading-art.mp4" type="video/mp4" /> Your browser does not support video playback. </video>

<h2>Preparing Your Art Gallery...</h2> <p>Please wait while your charcoal artworks load.</p> </div> ); };

export default VideoLoader;