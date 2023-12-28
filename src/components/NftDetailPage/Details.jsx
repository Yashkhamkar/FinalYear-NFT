import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import classes from "./details.module.css";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";

const Details = () => {
  const location = useLocation();
  const nfts = location.state?.nftDetails;
  const { buyNft, CurrentAccount } = useContext(NFTMarketplaceContext);

  const buyNow = () => {
    buyNft(nfts);
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left} style={{ marginTop: "130px" }}>
          <img
            src={nfts.image.replace(
              "ipfs://",
              "https://gateway.pinata.cloud/ipfs/"
            )}
            alt={nfts?.title}
          />
        </div>
        <div className={classes.right} style={{ marginTop: "150px" }}>
          <h2 className={classes.title}>NFT Name:- {nfts?.name}</h2>
          <div className={classes.price}>
            Price: <span>ETH</span> {nfts?.price}
          </div>
          <div className={classes.productDesc}>
            <div>Description: </div>
            <p>
              {nfts?.description?.length > 50
                ? `${nfts?.description}`.slice(0, 50)
                : nfts?.description}
            </p>
          </div>
          {CurrentAccount === nfts.seller.toLowerCase() ? (
            <p>You cannot buy your own nft</p>
          ) : (
            <button onClick={buyNow} className="p-btn">
              BUY
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
