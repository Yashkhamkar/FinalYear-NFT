import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import Swal from "sweetalert2";

const Resell = () => {
  const { createSale } = useContext(NFTMarketplaceContext);
  const location = useLocation();
  const nfts = location.state?.item;
  const [price, setprice] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setimage] = useState();
  const resellNft = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createSale(nfts.tokenURI, price, true, nfts.tokenId);
      setLoading(false);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Error Resell NFT",
        icon: "error",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <div className="live-heading absolute-center">
        <span className="heading-gradient" style={{ marginTop: "30px" }}>
          Resell
        </span>
      </div>
      <div className="formbold-main-wrapper">
        {loading && (
          <div className="terminal-loader">
            <div className="terminal-header">
              <div className="terminal-title">Status</div>
              <div className="terminal-controls">
                <div className="control close"></div>
                <div className="control minimize"></div>
                <div className="control maximize"></div>
              </div>
            </div>
            <div className="texti">Creating...</div>
          </div>
        )}
        {!loading && (
          <div className="formbold-form-wrapper">
            <>
              <div className="formbold-mb-5">
                <label htmlFor="price" className="formbold-form-label">
                  Resell Price
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  placeholder="Enter resell price"
                  className="formbold-form-input"
                  value={price}
                  onChange={(e) => setprice(e.target.value)}
                />
              </div>
              <button className="formbold-btn w-full" onClick={resellNft}>
                Resell Nft
              </button>
            </>
          </div>
        )}
      </div>
    </>
  );
};

export default Resell;
