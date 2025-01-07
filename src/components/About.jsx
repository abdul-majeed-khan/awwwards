import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    })
    .to(".image-overlay", {
      opacity: 0.3,
      duration: 0.5
    }, "<")
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-blue-100 text-sm uppercase md:text-[10px]">
          Welcome to My World
        </p>

        <AnimatedTitle
          title="Ab<b>o</b>ut <b>M</b>e"
          containerClass="mt-5 !text-blue-100 text-center"
          // effect="spiral"
        />

        <div className="about-subtext text-blue-100">
          <p>The Game of Games begins—your life, now an epic MMORPG</p>
          <p className="text-blue-100">
            Zentry unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      {/* Clip Section */}
      <div className="h-dvh w-screen relative" id="clip">
        {/* Image Container */}
        <div className="mask-clip-path about-image relative overflow-hidden">
          {/* Overlay Layer */}
          <div className="image-overlay absolute inset-0 bg-black/60 z-10" />
          
          {/* Main Image */}
          <img
            src="img/hacker-green-min.jpg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover transform scale-105"
          />
          
          {/* Grain Effect */}
          {/* <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" /> */}
        </div>
      </div>
    </div>
  );
};

export default About;