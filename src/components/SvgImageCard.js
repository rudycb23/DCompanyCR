import React from "react";
import "../App.css";

const SvgImageCard = ({ src, title }) => {
  return (
    <div className="svg-image-card">
      <img src={src} className="svg-image" alt="SVG Element" />
      <div className="svg-image-overlay">
        <p>{title}</p>
      </div>
    </div>
  );
};

export default SvgImageCard;
