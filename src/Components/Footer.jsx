/**CORE LIBRARIES IMPORT */
import React from "react";
import { motion } from "framer-motion";

/**ICONS IMPORT */
import { FaEnvelope, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.2 },
        },
      }}
      style={{
        position: "relative",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px 50px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left corner small clickable credit */}
      <motion.a
        href="https://ankit-portfolio-001.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          left: "1rem",
          bottom: "1rem",
          fontSize: "0.7rem",
          color: "#888",
          textDecoration: "none",
        }}
        whileHover={{ scale: 1.05, color: "#c8401a" }}
        whileTap={{ scale: 0.95 }}
      >
        Made with ❤️ by Ankit
      </motion.a>

      {/* COPYRIGHT TEXT */}
      <motion.p
        className="section-text main-text"
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          textAlign: "center",
          margin: "0 0 10px 0",
          width: "100%",
        }}
      >
        Ⓒ 2026 - Harsh Gautam. All rights reserved.
      </motion.p>

      {/* POLICY TEXT */}
      <motion.p
        className="section-text main-text"
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto 20px auto",
          width: "100%",
        }}
      >
        Our Shipping & Returns Policy, Privacy Policy, and Terms & Conditions govern all transactions and use of this website.
      </motion.p>

      {/* SOCIAL ICONS */}
      <motion.div
        className="social-icons"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "18px",
          width: "100%",
        }}
      >
        <motion.a
          href="https://www.instagram.com/harsh_artz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          className="section-text"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaInstagram />
        </motion.a>

        <motion.a
          href="https://youtube.com"
          className="section-text"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaYoutube />
        </motion.a>

        <motion.a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=harshartz56@gmail.com"
          className="section-text"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEnvelope />
        </motion.a>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;