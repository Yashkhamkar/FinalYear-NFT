import React, { useState, useEffect, useContext } from "react";
import "./profile.scss";
import NewCard from "../Card/NewCard";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Listed NFT's");
  const [nfts, setNFTs] = useState([]);
  const [mynfts, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading status
  const { fetchMyNFTs, CurrentAccount } = useContext(NFTMarketplaceContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch data
    fetchMyNFTs("fetchItemsListed")
      .then((item) => {
        console.log("Fetched NFTs:", item);
        setNFTs(item.reverse());
      })
      .catch((error) => {
        console.error("Error fetching NFTs:", error);
      })
      .finally(() => setLoading(false)); // Set loading to false after fetching data
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMyNFTs("fetchMyNFTs")
      .then((item) => {
        setMyNFTs(item.reverse());
      })
      .finally(() => setLoading(false));
  }, []);

  const activeNFTs = activeTab === "Listed NFT's" ? nfts : mynfts;

  const resell = (item) => {
    navigate(`/resell/${item.tokenId}`, { state: { item } });
  };

  return (
    <section className="wrapper profile-body">
      <ul className="tabs">
        <li
          className={activeTab === "Listed NFT's" ? "active" : ""}
          onClick={() => setActiveTab("Listed NFT's")}
        >
          Listed NFT's
        </li>
        <li
          className={activeTab === "Owned NFT's" ? "active" : ""}
          onClick={() => setActiveTab("Owned NFT's")}
        >
          Owned NFT's
        </li>
      </ul>

      <ul className="tab__content">
        {activeTab === "Listed NFT's" ? (
          <li className={activeTab === "Listed NFT's" ? "active" : ""}>
            <div className="content__wrapper">
              {loading ? (
                <Loader /> // Render loader while data is being fetched
              ) : (
                <div className="card-container">
                  {activeNFTs.map((item, index) => (
                    <NewCard
                      key={index}
                      image={item.image.replace(
                        "ipfs://",
                        "https://gateway.pinata.cloud/ipfs/"
                      )}
                      title={item.name}
                      showButton={false} // Pass showButton prop with value false
                      price={item.price}
                      timeRemaining={item.timeRemaining}
                    />
                  ))}
                </div>
              )}
            </div>
          </li>
        ) : (
          <li className={activeTab === "Owned NFT's" ? "active" : ""}>
            <div className="content__wrapper">
              {loading ? (
                <Loader />
              ) : (
                <div className="card-container" style={{ marginTop: "20px" }}>
                  {activeNFTs.map((item, index) => (
                    <NewCard
                      key={index}
                      image={item.image.replace(
                        "ipfs://",
                        "https://gateway.pinata.cloud/ipfs/"
                      )}
                      title={item.name}
                      price={item.price}
                      type={"resell"}
                      onclick={() => resell(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};

export default Profile;
