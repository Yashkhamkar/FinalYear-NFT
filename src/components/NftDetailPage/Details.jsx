import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import classes from "./details.module.css";

const Details = () => {
  const location = useLocation();
  const nfts = location.state?.nftDetails;
  useEffect(() => {
    console.log(nfts);
  }, [nfts]);

  const buyNow = () => {
    console.log("buy now");
    // You can access the details of the selected NFT here using the `nfts` variable.
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
          <button onClick={buyNow} className="n-btn">
            BUY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
