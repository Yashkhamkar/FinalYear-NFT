import React from "react";
import "./newcard.css";

const NewCard = ({
  image,
  title,
  price,
  timeRemaining,
  type,
  onclick,
  showButton = true, // Add a showButton prop with a default value of true
}) => {
  const handleClick = () => {
    onclick();
  };

  return (
    <div>
      <section>
        <div className="card-body">
          <img src={image} alt="" className="nft-image" />
          <div className="card-content">
            <h1>{title}</h1>
            <div className="icon">
              <div className="first-icon">
                <img
                  src="https://ahmednassar855.github.io/hosted-assets1/icon-ethereum.svg"
                  alt=""
                  className="icon-ethereum"
                />
                <p>{price}</p>
              </div>
              {type === "auction" ? (
                <div className="second-icon">
                  <img
                    src="https://ahmednassar855.github.io/hosted-assets1/icon-clock.svg"
                    alt=""
                    className="icon-clock"
                  />
                  <p>{timeRemaining}</p>
                </div>
              ) : null}
            </div>
            <div className="line"></div>

            <div className="avatar">
              {showButton && ( // Conditionally render the button based on showButton prop
                <button
                  className="n-btn"
                  style={{
                    marginTop: "10px",
                    marginLeft: "13px",
                    cursor: "pointer",
                  }}
                  onClick={handleClick}
                >
                  {type === "auction"
                    ? "BID NOW"
                    : type === "resell"
                    ? "RESELL"
                    : "BUY NOW"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewCard;
