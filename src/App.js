import "./App.css";
import Brands from "./components/Brands/Brands";
import Contact from "./components/Contact/Contact";
import Header from "./components/Header/Header";
import Topfold from "./components/Topfold/Topfold";
import { Routes, Route } from "react-router-dom";
import { NFTMarketplaceProvider } from "./context/NFTMarketplaceContext";
import FileUpload from "./components/Create/FileUpload";
import Market from "./components/Market/Market";
import Details from "./components/NftDetailPage/Details";
import Profile from "./components/Profile/Profile";
import Resell from "./components/Resell/Resell";

function App() {
  return (
    <NFTMarketplaceProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Topfold />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create" element={<FileUpload />} />
          <Route path="/market" element={<Market />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/resell/:id" element={<Resell />} />
          <Route path="/nfts" element={<Profile />} />
        </Routes>
      </div>
    </NFTMarketplaceProvider>
  );
}

export default App;
