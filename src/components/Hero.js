import React from "react";
import { Carousel } from "react-bootstrap";
import heroVideo from "../assets/videos/hero_video_1.mp4";

const HeroSection = () => {
  return (
    <div className="hero-section pb-4">
      <Carousel>
        <Carousel.Item>
          <video className="d-block w-100" autoPlay loop muted>
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default HeroSection;
