import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import NewCard from "../Card/NewCard";
import "./market.css";

const Market = () => {
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setnfts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNFTs().then((item) => {
      setnfts(item.reverse());
    });
  }, []);

  const handleCardClick = (nftDetails) => {
    console.log(nftDetails);
    navigate(`/details/${nftDetails.tokenId}`, { state: { nftDetails } });
  };

  return (
    <>
      <div className="live-heading absolute-center">
        <span className="heading-gradient" style={{ marginTop: "30px" }}>
          MarketPlace
        </span>
      </div>
      <div className="card-container">
        {nfts.map((item, index) => (
          <NewCard
            key={index}
            image={item.image.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
            )}
            title={item.name}
            price={item.price}
            timeRemaining={item.timeRemaining}
            type="buy"
            onclick={() => handleCardClick(item)} // Pass the function itself
          />
        ))}
      </div>
    </>
  );
};

export default Market;
