 

/** CORE LIBRARIES IMPORT */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/** IMAGE IMPORT */
import ArtistImg from "../Images/additionalImages/Harsh.jpeg";

const AboutArtist = () => {
  return (
    <section className="about-artist-section">
      <div className="content-wrapper">

        {/* IMAGE */}
        <motion.div
          className="artist-img"
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img src={ArtistImg} alt="Artist Harsh Gautam" />
        </motion.div>

        {/* TEXT */}
        <motion.div
          className="artist-text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >

          {/* TITLE */}
          <motion.h2
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Artist Harsh Gautam
          </motion.h2>

          {/* ABOUT ME */}
          <motion.h3
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            About Me
          </motion.h3>

          <motion.p
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            I’m <b>Harsh Gautam</b>—a <b>self-taught artist</b> who doesn’t just
            draw, I <b>build visuals that hit.</b>
          </motion.p>

          <motion.p
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            My work is all about <b>precision, attitude, and impact.</b> From{" "}
            <b>hyper-realistic portraits to anime and pop-culture-inspired pieces</b>,
            I push every detail until it feels alive, raw, and impossible to
            ignore.
          </motion.p>

          <motion.p
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            I blend <b>traditional sketching with digital tools</b> to create art
            that stands out in a world full of copies. <b>No shortcuts.</b>{" "}
            <b>No generic work.</b> Just <b>sharp lines, deep shadows, and real emotion.</b>
          </motion.p>

          <motion.p
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Through <b>Harsh Artz</b>, I create custom pieces that actually mean
            something—not just art you look at, but <b>art you feel.</b>
          </motion.p>

          <motion.p
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <b>If it’s got my name on it, it’s made to leave a mark.</b>
          </motion.p>

          {/* LINKS */}
          <br />

          <Link className="hero-link" to="/art-gallery">
            Art Gallery
          </Link>

          <Link className="hero-link" to="/lets-connect">
            Let&apos;s Connect
          </Link>

        </motion.div>
      </div>
    </section>
  );
};

export default AboutArtist;
