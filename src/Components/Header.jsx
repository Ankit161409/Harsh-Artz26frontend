  // // // 
  // // /** CORE LIBRARIES IMPORT */
  // // import React, { useEffect, useState } from "react";
  // // import { motion, AnimatePresence } from "framer-motion";
  // // import { useLocation, Link } from "react-router-dom";
  // // import "../App.css";
  // // import "./Header.css";
  // // import favicon from "../Images/additionalImages/favicon.png"


  // // const Header = () => {
  // //   const [scrolled, setScrolled] = useState(false);
  // //   const [menuOpen, setMenuOpen] = useState(false);
  // //   const [galleryOpen, setGalleryOpen] = useState(false); // desktop dropdown hover/focus
  // //   const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false); // mobile accordion

  // //   const location = useLocation();
  // //   const isHome = location.pathname === "/";
  // //   const isArtGallery = location.pathname.startsWith("/art-gallery");
  // //   const isShop = location.pathname === "/shop";
  // //   const isShopDetail = location.pathname === "/shop-detail";
  // //   const isContact = location.pathname === "/lets-connect";

  // //   useEffect(() => {
  // //     const handleScroll = () => {
  // //       if (isHome || isArtGallery || isShop || isContact || isShopDetail) {
  // //         setScrolled(window.scrollY > window.innerHeight - 80);
  // //       } else {
  // //         setScrolled(true);
  // //       }
  // //     };
  // //     handleScroll();
  // //     window.addEventListener("scroll", handleScroll);
  // //     return () => window.removeEventListener("scroll", handleScroll);
  // //   }, [isHome, isArtGallery, isShop, isContact, isShopDetail]);

  // //   const navLinks = [
  // //     { name: "Home", path: "/" },
  // //     {
  // //       name: "Art Gallery",
  // //       // path: "/art-gallery",
  // //       children: [
      
  // //         // { name: "Sketches", path: "/sketches" },
    
  // //         // { name: "Acrylic Paintings", path: "/acrylic-paintings" },
  // //         { name: "Watercolor Paintings", path: "/watercolor-paintings" },
  // //         { name: "Pen Sketches", path: "/pen-sketches" },
  // //         { name: "Charcoal Sketches", path: "/charcoal-sketches" },
  // //         { name: "Mixed Media ", path: "/Mixed-Media" },
  // //         { name: "Digital Art", path: "/digital-art" },
  // //         { name: "Coloured Pencil", path: "/colouredPencil" }
  // //       ],
  // //     },
  // //     { name: "Let's Connect", path: "/lets-connect" },
  // //       { name: "Login", path: "/login" },
  // //   ];

  // //   return (
  // //     <>
  // //       {/* HEADER */}
  // //       <motion.header 
  // //         className={`site-header black ${isHome || isArtGallery || isShop || isContact || isShopDetail
  // //           ? "home-header"
  // //           : "inner-header"
  // //           } ${scrolled ? "scrolled" : ""}`}
  // //         initial={{ y: -80, opacity: 0 }}
  // //         animate={{ y: 0, opacity: 1 }}
  // //         transition={{ duration: 0.8, ease: "easeOut" }}
  // //       >
  // //         <div className="header-inner color-black">
  // //           {/* LOGO */}
  // //           <div className="logo">
  // //             {/* <Link to="/">HArsh Artz</Link> */}
  // //              <img src={favicon}
  // //     alt="Harsh Artz"
  // //     className="site-logo"
  // //   />
  // //           </div>

  // //           {/* DESKTOP NAV */}
  // //           <nav className="main-nav">
  // //             {navLinks.map((item, i) => {
  // //               const hasChildren = !!item.children;
  // //               if (!hasChildren) {
  // //                 return (
  // //                   <Link key={i} to={item.path} className="nav-link">
  // //                     {item.name}
  // //                   </Link>
  // //                 );
  // //               }

  // //               // Art Gallery with dropdown
  // //               return (
  // //                 <div
  // //                   key={i}
  // //                   className={`nav-item has-dropdown ${galleryOpen ? "open" : ""}`}
  // //                   onMouseEnter={() => setGalleryOpen(true)}
  // //                   onMouseLeave={() => setGalleryOpen(false)}
  // //                 >
  // //                   <Link to={item.path} className="nav-link dropdown-trigger">
  // //                     {item.name}
  // //                   </Link>
  // //                   <div className="dropdown">
  // //                     {item.children.map((child, ci) => (
  // //                       <Link key={ci} to={child.path} className="dropdown-link">
  // //                         {child.name}
  // //                       </Link>
  // //                     ))}
  // //                   </div>
  // //                 </div>
  // //               );
  // //             })}
  // //           </nav>

  // //           {/* MOBILE MENU BTN */}
  // //           <button
  // //             className="menu-btn blue"
  // //             aria-label="Open menu"
  // //             aria-expanded={menuOpen}
  // //             onClick={() => setMenuOpen(true)}
  // //           >
  // //             ☰
  // //           </button>
  // //         </div>
  // //       </motion.header>

  // //       {/* SIDEBAR (MOBILE) */}
  // //       <AnimatePresence>
  // //         {menuOpen && (
  // //           <>
  // //             {/* OVERLAY */}
  // //             <motion.div
  // //               className="sidebar-overlay"
  // //               onClick={() => setMenuOpen(false)}
  // //               initial={{ opacity: 0 }}
  // //               animate={{ opacity: 1 }}
  // //               exit={{ opacity: 0 }}
  // //             />

  // //             {/* SIDEBAR PANEL */}
  // //             <motion.aside
  // //               className="sidebar"
  // //               initial={{ x: "-100%" }}
  // //               animate={{ x: 0 }}
  // //               exit={{ x: "-100%" }}
  // //               transition={{ duration: 0.4, ease: "easeOut" }}
  // //             >
  // //               <div className="sidebar-top">
  // //                 <Link to="/" className="sidebar-logo" onClick={() => setMenuOpen(false)}>
  // //                   Artist harsh gautam
  // //                 </Link>
  // //                 <button
  // //                   className="sidebar-close"
  // //                   aria-label="Close menu"
  // //                   onClick={() => setMenuOpen(false)}
  // //                 >
  // //                   ✕
  // //                 </button>
  // //               </div>

  // //               <nav className="sidebar-nav">
  // //                 {navLinks.map((item, i) => {
  // //                   const hasChildren = !!item.children;
  // //                   if (!hasChildren) {
  // //                     return (
  // //                       <Link
  // //                         key={i}
  // //                         to={item.path}
  // //                         className="sidebar-link"
  // //                         onClick={() => setMenuOpen(false)}
  // //                       >
  // //                         {item.name}
  // //                       </Link>
  // //                     );
  // //                   }

  // //                   // Mobile accordion for Art Gallery
  // //                   return (
  // //                     <div key={i} className="sidebar-accordion">
  // //                       <button
  // //                         className="sidebar-link accordion-trigger"
  // //                         aria-expanded={mobileGalleryOpen}
  // //                         onClick={() => setMobileGalleryOpen((v) => !v)}
  // //                       >
  // //                         {item.name}
  // //                         <span className="accordion-caret">{mobileGalleryOpen ? "−" : "+"}</span>
  // //                       </button>
  // //                       <AnimatePresence initial={false}>
  // //                         {mobileGalleryOpen && (
  // //                           <motion.div
  // //                             className="accordion-panel"
  // //                             initial={{ height: 0, opacity: 0 }}
  // //                             animate={{ height: "auto", opacity: 1 }}
  // //                             exit={{ height: 0, opacity: 0 }}
  // //                             transition={{ duration: 0.25 }}
  // //                           >
  // //                             {item.children.map((child, ci) => (
  // //                               <Link
  // //                                 key={ci}
  // //                                 to={child.path}
  // //                                 className="sidebar-sublink"
  // //                                 onClick={() => setMenuOpen(false)}
  // //                               >
  // //                                 {child.name}
  // //                               </Link>
  // //                             ))}
  // //                           </motion.div>
  // //                         )}
  // //                       </AnimatePresence>
  // //                     </div>
  // //                   );
  // //                 })}
  // //               </nav>

  // //               <div className="sidebar-footer">
  // //                 <p>+91 98111 85352</p>
  // //                 <p>harshartz56@gmail.com</p>
  // //               </div>
  // //             </motion.aside>
  // //           </>
  // //         )}
  // //       </AnimatePresence>
  // //     </>
  // //   );
  // // };

  // // export default Header;



  // /* CORE LIBRARIES IMPORT */
  // import React, { useEffect, useState } from "react";
  // import { motion, AnimatePresence } from "framer-motion";
  // import { useLocation, Link } from "react-router-dom";
  // import "../App.css";
  // import "./Header.css";
  // import favicon from "../Images/additionalImages/favicon.png";

  // const Header = () => {
  //   const [scrolled, setScrolled] = useState(false);
  //   const [menuOpen, setMenuOpen] = useState(false);
  //   const [galleryOpen, setGalleryOpen] = useState(false);
  //   const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

  //   const location = useLocation();

  //   const isHome = location.pathname === "/";
  //   const isArtGallery = location.pathname.startsWith("/art-gallery");
  //   const isShop = location.pathname === "/shop";
  //   const isShopDetail = location.pathname === "/shop-detail";
  //   const isContact = location.pathname === "/lets-connect";

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       if (isHome || isArtGallery || isShop || isContact || isShopDetail) {
  //         setScrolled(window.scrollY > window.innerHeight - 80);
  //       } else {
  //         setScrolled(true);
  //       }
  //     };

  //     handleScroll();
  //     window.addEventListener("scroll", handleScroll);

  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, [isHome, isArtGallery, isShop, isContact, isShopDetail]);

  //   const navLinks = [
  //     { name: "Home", path: "/" },
  //     {
  //       name: "Art Gallery",
  //       path: "/art-gallery",
  //       children: [
  //         { name: "Watercolor Paintings", path: "/watercolor-paintings" },
  //         { name: "Pen Sketches", path: "/pen-sketches" },
  //         { name: "Charcoal Sketches", path: "/charcoal-sketches" },
  //         { name: "Mixed Media", path: "/Mixed-Media" },
  //         { name: "Digital Art", path: "/digital-art" },
  //         { name: "Coloured Pencil", path: "/colouredPencil" },
  //       ],
  //     },
  //     { name: "Let's Connect", path: "/lets-connect" },
  //     { name: "Login", path: "/login" },
  //   ];

  //   // Close menus when navigating to another page.
  //   useEffect(() => {
  //     setMenuOpen(false);
  //     setGalleryOpen(false);
  //     setMobileGalleryOpen(false);
  //   }, [location.pathname]);

  //   return (
  //     <>
  //       {/* HEADER */}
  //       <motion.header
  //         className={`site-header black ${
  //           isHome || isArtGallery || isShop || isContact || isShopDetail
  //             ? "home-header"
  //             : "inner-header"
  //         } ${scrolled ? "scrolled" : ""}`}
  //         initial={{ y: -80, opacity: 0 }}
  //         animate={{ y: 0, opacity: 1 }}
  //         transition={{ duration: 0.8, ease: "easeOut" }}
  //       >
  //         <div className="header-inner color-black">
  //           {/* LOGO */}
  //           <div className="logo">
  //             <Link to="/" aria-label="Harsh Artz home">
  //               <img
  //                 src={favicon}
  //                 alt="Harsh Artz"
  //                 className="site-logo"
  //               />
  //             </Link>
  //           </div>

  //           {/* DESKTOP NAVIGATION */}
  //           <nav className="main-nav">
  //             {navLinks.map((item, i) => {
  //               const hasChildren = Boolean(item.children);

  //               if (!hasChildren) {
  //                 return (
  //                   <Link
  //                     key={i}
  //                     to={item.path}
  //                     className="nav-link"
  //                   >
  //                     {item.name}
  //                   </Link>
  //                 );
  //               }

  //               return (
  //                 <div
  //                   key={i}
  //                   className={`nav-item has-dropdown ${
  //                     galleryOpen ? "open" : ""
  //                   }`}
  //                   onMouseEnter={() => setGalleryOpen(true)}
  //                   onMouseLeave={() => setGalleryOpen(false)}
  //                 >
  //                   <Link
  //                     to={item.path}
  //                     className="nav-link dropdown-trigger"
  //                     aria-haspopup="true"
  //                     aria-expanded={galleryOpen}
  //                     onClick={(e) => {
  //                       // Open the dropdown instead of navigating
  //                       // when the gallery link is clicked.
  //                       e.preventDefault();
  //                       setGalleryOpen((open) => !open);
  //                     }}
  //                   >
  //                     {item.name}
  //                     <span className="nav-dropdown-caret">
  //                       {galleryOpen ? "▲" : "▼"}
  //                     </span>
  //                   </Link>

  //                   {/* EACH OPTION HAS ITS OWN ROW */}
  //                   <AnimatePresence>
  //                     {galleryOpen && (
  //                       <motion.div
  //                         className="dropdown"
  //                         initial={{ opacity: 0, y: 8 }}
  //                         animate={{ opacity: 1, y: 0 }}
  //                         exit={{ opacity: 0, y: 8 }}
  //                         transition={{ duration: 0.2 }}
  //                       >
  //                         {item.children.map((child, ci) => (
  //                           <Link
  //                             key={ci}
  //                             to={child.path}
  //                             className="dropdown-link"
  //                             onClick={() => setGalleryOpen(false)}
  //                           >
  //                             {child.name}
  //                           </Link>
  //                         ))}
  //                       </motion.div>
  //                     )}
  //                   </AnimatePresence>
  //                 </div>
  //               );
  //             })}
  //           </nav>

  //           {/* MOBILE MENU BUTTON */}
  //           <button
  //             type="button"
  //             className="menu-btn blue"
  //             aria-label="Open menu"
  //             aria-expanded={menuOpen}
  //             onClick={() => setMenuOpen(true)}
  //           >
  //             ☰
  //           </button>
  //         </div>
  //       </motion.header>

  //       {/* MOBILE SIDEBAR */}
  //       <AnimatePresence>
  //         {menuOpen && (
  //           <>
  //             {/* OVERLAY */}
  //             <motion.div
  //               className="sidebar-overlay"
  //               onClick={() => setMenuOpen(false)}
  //               initial={{ opacity: 0 }}
  //               animate={{ opacity: 1 }}
  //               exit={{ opacity: 0 }}
  //             />

  //             {/* SIDEBAR PANEL */}
  //             <motion.aside
  //               className="sidebar"
  //               initial={{ x: "-100%" }}
  //               animate={{ x: 0 }}
  //               exit={{ x: "-100%" }}
  //               transition={{ duration: 0.4, ease: "easeOut" }}
  //             >
  //               <div className="sidebar-top">
  //                 <Link
  //                   to="/"
  //                   className="sidebar-logo"
  //                   onClick={() => setMenuOpen(false)}
  //                 >
  //                   Artist Harsh Gautam
  //                 </Link>

  //                 <button
  //                   type="button"
  //                   className="sidebar-close"
  //                   aria-label="Close menu"
  //                   onClick={() => setMenuOpen(false)}
  //                 >
  //                   ✕
  //                 </button>
  //               </div>

  //               <nav className="sidebar-nav">
  //                 {navLinks.map((item, i) => {
  //                   const hasChildren = Boolean(item.children);

  //                   if (!hasChildren) {
  //                     return (
  //                       <Link
  //                         key={i}
  //                         to={item.path}
  //                         className="sidebar-link"
  //                         onClick={() => setMenuOpen(false)}
  //                       >
  //                         {item.name}
  //                       </Link>
  //                     );
  //                   }

  //                   return (
  //                     <div key={i} className="sidebar-accordion">
  //                       <button
  //                         type="button"
  //                         className="sidebar-link accordion-trigger"
  //                         aria-expanded={mobileGalleryOpen}
  //                         onClick={() =>
  //                           setMobileGalleryOpen((open) => !open)
  //                         }
  //                       >
  //                         <span>{item.name}</span>
  //                         <span className="accordion-caret">
  //                           {mobileGalleryOpen ? "−" : "+"}
  //                         </span>
  //                       </button>

  //                       <AnimatePresence initial={false}>
  //                         {mobileGalleryOpen && (
  //                           <motion.div
  //                             className="accordion-panel"
  //                             initial={{ height: 0, opacity: 0 }}
  //                             animate={{ height: "auto", opacity: 1 }}
  //                             exit={{ height: 0, opacity: 0 }}
  //                             transition={{ duration: 0.25 }}
  //                           >
  //                             {item.children.map((child, ci) => (
  //                               <Link
  //                                 key={ci}
  //                                 to={child.path}
  //                                 className="sidebar-sublink"
  //                                 onClick={() => {
  //                                   setMenuOpen(false);
  //                                   setMobileGalleryOpen(false);
  //                                 }}
  //                               >
  //                                 {child.name}
  //                               </Link>
  //                             ))}
  //                           </motion.div>
  //                         )}
  //                       </AnimatePresence>
  //                     </div>
  //                   );
  //                 })}
  //               </nav>

  //               <div className="sidebar-footer">
  //                 <p>+91 98111 85352</p>
  //                 <p>harshartz56@gmail.com</p>
  //               </div>
  //             </motion.aside>
  //           </>
  //         )}
  //       </AnimatePresence>
  //     </>
  //   );
  // };

  // export default Header;

  import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import "../App.css";
import "./Header.css";
import favicon from "../Images/additionalImages/favicon.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);

  const location = useLocation();

  const isHome = location.pathname === "/";
  const isArtGallery = location.pathname.startsWith("/art-gallery");
  const isShop = location.pathname === "/shop";
  const isShopDetail = location.pathname === "/shop-detail";
  const isContact = location.pathname === "/lets-connect";

  /* ✅ Scroll handler */
  useEffect(() => {
    const handleScroll = () => {
      if (isHome || isArtGallery || isShop || isContact || isShopDetail) {
        setScrolled(window.scrollY > window.innerHeight - 80);
      } else {
        setScrolled(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, isArtGallery, isShop, isContact, isShopDetail]);

  /* ✅ Close menus on route change */
  useEffect(() => {
    setMenuOpen(false);
    setGalleryOpen(false);
    setMobileGalleryOpen(false);
  }, [location.pathname]);

  /* ✅ Body scroll lock when sidebar open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Art Gallery",
      path: "/art-gallery",
      children: [
        { name: "Watercolor Paintings", path: "/watercolor-paintings" },
        { name: "Pen Sketches", path: "/pen-sketches" },
        { name: "Charcoal Sketches", path: "/charcoal-sketches" },
        { name: "Mixed Media", path: "/Mixed-Media" },
        { name: "Digital Art", path: "/digital-art" },
        { name: "Coloured Pencil", path: "/colouredPencil" },
      ],
    },
    { name: "Let's Connect", path: "/lets-connect" },
    { name: "Login", path: "/login" },
  ];

  return (
    <>
      {/* ================================ */}
      {/* HEADER                           */}
      {/* ================================ */}
      <motion.header
        className={`site-header black ${
          isHome || isArtGallery || isShop || isContact || isShopDetail
            ? "home-header"
            : "inner-header"
        } ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="header-inner color-black">

          {/* LOGO */}
          <div className="logo">
            <Link to="/" aria-label="Harsh Artz home">
              <img
                src={favicon}
                alt="Harsh Artz"
                className="site-logo"
              />
            </Link>
          </div>

          {/* ================================ */}
          {/* DESKTOP NAVIGATION               */}
          {/* ================================ */}
          <nav className="main-nav">
            {navLinks.map((item, i) => {
              const hasChildren = Boolean(item.children);

              if (!hasChildren) {
                return (
                  <Link key={i} to={item.path} className="nav-link">
                    {item.name}
                  </Link>
                );
              }

              // Art Gallery dropdown
              return (
                <div
                  key={i}
                  className={`nav-item has-dropdown ${galleryOpen ? "open" : ""}`}
                  onMouseEnter={() => setGalleryOpen(true)}
                  onMouseLeave={() => setGalleryOpen(false)}
                >
                  <button
                    type="button"
                    className="nav-link dropdown-trigger"
                    aria-haspopup="true"
                    aria-expanded={galleryOpen}
                    onClick={() => setGalleryOpen((open) => !open)}
                  >
                    {item.name}
                    <span className="nav-dropdown-caret">
                      {galleryOpen ? " ▲" : " ▼"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {galleryOpen && (
                      <motion.div
                        className="dropdown"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.children.map((child, ci) => (
                          <Link
                            key={ci}
                            to={child.path}
                            className="dropdown-link"
                            onClick={() => setGalleryOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="menu-btn blue"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </motion.header>

      {/* ================================ */}
      {/* MOBILE SIDEBAR                   */}
      {/* ================================ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="sidebar-overlay"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* SIDEBAR PANEL */}
            <motion.aside
              className="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* SIDEBAR TOP — Logo + Close */}
              <div className="sidebar-top">
                <Link
                  to="/"
                  className="sidebar-logo"
                  onClick={() => setMenuOpen(false)}
                >
                  Artist Harsh Gautam
                </Link>
                <button
                  type="button"
                  className="sidebar-close"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* SIDEBAR NAV LINKS */}
              <nav className="sidebar-nav">
                {navLinks.map((item, i) => {
                  const hasChildren = Boolean(item.children);

                  // Simple link
                  if (!hasChildren) {
                    return (
                      <Link
                        key={i}
                        to={item.path}
                        className="sidebar-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  }

                  // Art Gallery accordion
                  return (
                    <div key={i} className="sidebar-accordion">
                      {/* Accordion Header */}
                      <button
                        type="button"
                        className="sidebar-link accordion-trigger"
                        aria-expanded={mobileGalleryOpen}
                        onClick={() =>
                          setMobileGalleryOpen((open) => !open)
                        }
                      >
                        <span>{item.name}</span>
                        <span className="accordion-caret">
                          {mobileGalleryOpen ? "−" : "+"}
                        </span>
                      </button>

                      {/* Accordion Sub-links */}
                      <AnimatePresence initial={false}>
                        {mobileGalleryOpen && (
                          <motion.div
                            className="accordion-panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.children.map((child, ci) => (
                              <Link
                                key={ci}
                                to={child.path}
                                className="sidebar-sublink"
                                onClick={() => {
                                  setMenuOpen(false);
                                  setMobileGalleryOpen(false);
                                }}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* SIDEBAR FOOTER */}
              <div className="sidebar-footer">
                <p>+91 98111 85352</p>
                <p>harshartz56@gmail.com</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;