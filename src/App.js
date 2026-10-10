import './App.css';
import './MediaQueries.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './Components/ScrollToTop';
import Home from './Pages/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ThePersonBehind from './Pages/ThePersonBehind';
import ArtGallery from './Pages/ArtGallery';
import Login from './Pages/Login';
import Shop from './Pages/Shop';
import LetsConnect from './Pages/LetsConnect';
import Charcoals from './typesOfPaintings/CharcoalSketches';
import Digital from './typesOfPaintings/DigitalArt';
import ColouredPencil from './typesOfPaintings/ColouredPencil';
import MixedMedia from './typesOfPaintings/MixedMedia';
import PenSketches from './typesOfPaintings/PenSketches';
import WatercolorPaintings from './typesOfPaintings/WatercolorPaintings';
import AddImage from './AddImages/AddImages';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import PaintingDetails from './Pages/PaintingDetails';




function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/the-person-behind" element={<ThePersonBehind />} />
          <Route path="/art-gallery" element={<ArtGallery />} />

          <Route path="/charcoal-sketches" element={<Charcoals />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/lets-connect" element={<LetsConnect />} />
          <Route path="/digital-art" element={<Digital />} />
          <Route path="/colouredPencil" element={<ColouredPencil />} />
          <Route path="/Mixed-Media" element={<MixedMedia />} />
          <Route path="/pen-sketches" element={<PenSketches />} />
          <Route path="/watercolor-paintings" element={<WatercolorPaintings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addImages/:painting" element={<AddImage/>} />
<Route path="/paintingDetails/:apiType/:id"  element={<PaintingDetails/>}
/>




        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
