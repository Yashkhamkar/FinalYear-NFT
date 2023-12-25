import React from "react";
import "./button.css";
const Button = (props) => {
  const { btnType, btnText, btnClick, customClass } = props;
  return (
    <div
      className={`${
        btnType === "PRIMARY"
          ? `button primary-btn ${customClass}`
          : `button secondary-btn ${customClass}`
      }`}
      onClick={btnClick}
    >
      {btnText}
    </div>
  );
};

export default Button;
