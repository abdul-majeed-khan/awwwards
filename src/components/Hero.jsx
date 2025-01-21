import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import AnimatedTitle from './AnimatedTitle';
// import TextReveal from './TextReveal'
import HyperText from './HyperText';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      
      // Set x values based on screen size
      const xOffset = isMobile ? 10 : 200;
      const xxOffset = isMobile ? 10 : 100;
      const yOffset = isMobile ? 60 : 200;
  
      // Animation for "ABDUL" moving left
      gsap.fromTo(".scroll-heading",
        { x: 0 },
        {
          x: -xxOffset,
          y: yOffset,
          scrollTrigger: {
            trigger: "#video-frame",
            start: "top top",
            end: "bottom center",
            scrub: true,
            toggleActions: "play none none reverse"
          }
        }
      );
  
      // Animation for "MAJEED" moving right
      gsap.fromTo(".bottom-heading",
        { x: 0 },
        {
          x: xOffset,
          y: yOffset,
          scrollTrigger: {
            trigger: "#video-frame",
            start: "top top",
            end: "bottom center",
            scrub: true,
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  
    return () => ctx.revert();
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#video-frame",
        start: "top top",
        end: "bottom center",
        scrub: 1,
      }
    });
  
    // Initial state
    tl.set("#video-frame", {
      scale: 1,
      opacity: 1,
      y: 0,
      rotateX: 0,
      transformPerspective: 1000
    });
  
    // Scroll animation sequence
    tl.to("#video-frame", {
      scale: 0.95,
      opacity: 0.8,
      y: 50,
      rotateX: 10,
      duration: 1,
      ease: "none"
    })
    .to("#video-frame", {
      scale: 0.9,
      opacity: 0.6,
      y: 100,
      rotateX: 20,
      duration: 1,
      ease: "none"
    });
  
    // Add parallax effect to content
    gsap.to(".hero-content", {
      y: -100,
      opacity: 0.8,
      scrollTrigger: {
        trigger: "#video-frame",
        start: "top top",
        end: "bottom center",
        scrub: 1.5,
      }
    });
  }, []);

  // In your Hero.jsx, add this after your existing animations
  const leftTexts = [
    "Full-Stack Developer",
    // "Connect & Play",
    // "Unlock Rewards",
    // "Build Communities"
  ];
  
  const rightTexts = [
    "ML-Ops Engineer",
    // "Digital Innovation",
    // "Web3 Integration",
    // "Real Value Gaming"
  ];
  
  useGSAP(() => {
    // Create a timeline for the sequence
    const textsTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        end: "bottom -200%", // Increased to accommodate more text
        scrub: 1,
        pin: true,
        pinSpacing: true,
      }
    });
  
    // Initial setup
    gsap.set(".scroll-text", { 
      y: "100vh",
      opacity: 0 
    });
  
    // Move cutout image to center
    textsTl.to("#cutout-image", {
      y: "20vh",
      scale: 150,
      duration: 2,
    });
  
    // Animate each pair of texts
    leftTexts.forEach((_, index) => {
      textsTl
        // Bring in texts
        .to(`.left-text-${index}`, {
          y: 0,
          opacity: 1,
          duration: 0.5,
        })
        .to(`.right-text-${index}`, {
          y: 0,
          opacity: 1,
          duration: 0.5,
        }, "<") // Synchronize with left text
  
        // Keep for a moment
        .to({}, { duration: 0.5 })
  
        // Move texts out
        .to(`.left-text-${index}`, {
          x: "-100vh, 100vh",
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
        })
        .to(`.right-text-${index}`, {
          x: "100vh, -100vh",
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
        });

    });
  
    // Final exit for cutout
    textsTl.to("#cutout-image", {
      y: "118vh",
      opacity: 1,
      duration: 1,
    });
  }, []);

  return (
    <div id="hero-section" className="relative h-dvh w-screen overflow-hidden">
      <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-black">
        <div>
          <img 
            src="img/pur.png"
            alt="Hero main"
            className="absolute-center left-0 top-0 size-full object-cover object-center"
          />
        </div>
        {/* Main content container - restructured */}
        <div className="absolute mt-80 inset-0 flex flex-col items-center z-40">
          {/* Top section - hero heading */}
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-4 md:gap-16">
              <HyperText
                text="A B D U L"
                className="special-font hero-heading scroll-heading pointer-events-none tracking-[15px]"
              />
              <HyperText
              text="M A J E E D"
              className="special-font hero-heading bottom-heading pointer-events-none tracking-[15px]"
              />
            </div>
          </div>

          <AnimatedTitle
            title="<b>MJ</b>"
            containerClass="text-center !text-6xl"
            effect="shuffle"
          />

          {/* Bottom section - title and button */}
          <div className="mb-40 flex flex-col items-center text-center ">
            <div className="text-center mb-6">
              <p className="text-lg md:text-xl font-robert-regular pointer-events-none text-blue-100/90">
                Full-Stack Developer | ML Engineer
              </p>
              <p className="text-base md:text-lg font-robert-regular pointer-events-none text-blue-100/70 mt-1">
                Check out my resume
              </p>
            </div>
            
            <Button 
              id="download-resume" 
              title="Download" 
              leftIcon={<TiLocationArrow />} 
              containerClass="!bg-black/50 border border-purple-900 text-gray-300 hover:!bg-violet-900/10 flex-center gap-2 px-6 py-2.5 rounded-full transition-all duration-700"
            />
          </div>
        </div>

        {/* Add the cutout image */}
        <div 
          id="cutout-image"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-1 h-1"
        >
          <img 
            src="/img/ship01-min.png" 
            alt="Cutout"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Left side texts */}
        <div className="fixed top-10 -translate-y-1/2 lg:left-40 left-10 z-40">
          {leftTexts.map((text, index) => (
            <div 
              key={`left-${index}`}
              className={`scroll-text left-text-${index} absolute left-0 lg:w-96 w-50`}
            >
              <h2 className="lg:text-6xl text-xl uppercase font-bold bg-gradient-to-r from-gray-500 to-purple-100 bg-clip-text text-transparent">
                {text}
              </h2>
              <p className="mt-2 text-blue-100/80 text-lg">
                {/* Add descriptions if needed */}
              </p>
            </div>
          ))}
        </div>

        {/* Right side texts */}
        <div className="fixed top-10 -translate-y-1/2 lg:right-40 right-10 z-40">
          {rightTexts.map((text, index) => (
            <div 
              key={`right-${index}`}
              className={`scroll-text right-text-${index} absolute right-0 lg:w-96 w-50 text-right`}
            >
              <h2 className="lg:text-6xl text-xl uppercase font-bold bg-gradient-to-l from-gray-500 to-purple-100 bg-clip-text text-transparent">
                {text}
              </h2>
              <p className="mt-2 text-blue-100/80 text-lg">
                {/* Add descriptions if needed */}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero