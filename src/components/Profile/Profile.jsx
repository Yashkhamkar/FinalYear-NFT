import React, { useState, useEffect, useContext } from "react";
import "./profile.scss";
import NewCard from "../Card/NewCard";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Listed NFT's");
  const [nfts, setNFTs] = useState([]);
  const [mynfts, setMyNFTs] = useState([]);
  const { fetchMyNFTs, CurrentAccount } = useContext(NFTMarketplaceContext);

  useEffect(() => {
    fetchMyNFTs("fetchItemsListed")
      .then((item) => {
        console.log("Fetched NFTs:", item);
        setNFTs(item.reverse());
      })
      .catch((error) => {
        console.error("Error fetching NFTs:", error);
      });
  }, []);

  useEffect(() => {
    fetchMyNFTs("fetchMyNFTs").then((item) => {
      setMyNFTs(item.reverse());
    });
  }, []);

  const activeNFTs = activeTab === "Listed NFT's" ? nfts : mynfts;

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
        <li className={activeTab === "Listed NFT's" ? "active" : ""}>
          <div className="content__wrapper">
            <div className="card-container">
              {activeNFTs.map((item, index) => (
                <NewCard
                  key={index}
                  image={item.image.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  )}
                  title={item.name}
                  price={item.price}
                  timeRemaining={item.timeRemaining}
                  show={false}
                />
              ))}
            </div>
          </div>
        </li>
        <li className={activeTab === "Owned NFT's" ? "active" : ""}>
          <div className="content__wrapper">
            <div className="card-container">
              {activeNFTs.map((item, index) => (
                <NewCard
                  key={index}
                  image={item.image.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  )}
                  title={item.name}
                  price={item.price}
                  type="resell"
                  show={true}
                />
              ))}
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default Profile;
