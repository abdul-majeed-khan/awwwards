import { useState, useRef, useEffect } from 'react'
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
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);

  const totalImages = 4;  // Update this to match your number of images
  const nextImageRef = useRef(null);

  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  }

  const upcomingImageIndex = (currentIndex % totalImages) + 1;

  const handleMiniImageClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingImageIndex);
  }

  useEffect(() => {
    if(loadedImages === totalImages - 1) {
      setIsLoading(false);
    }
  }, [loadedImages])

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-image", { visibility: "visible" });
        gsap.to("#next-image", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power2.inOut",
        });
        gsap.from("#current-image", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power2.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      
      // Set x values based on screen size
      const xOffset = isMobile ? 10 : 220;
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
      scale: 16,
      duration: 1,
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
    

  const getImageSrc = (index) => `/img/planet-${index}.jpg`;

  return (
    <div id="hero-section" className="relative h-dvh w-screen overflow-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
      <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div onClick={handleMiniImageClick} className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100">
              <img 
                ref={nextImageRef}
                src={getImageSrc(upcomingImageIndex)}
                alt={`Hero ${upcomingImageIndex}`}
                id="current-image"
                className="size-64 origin-center scale-150 object-cover object-center overlay-black/80"
                onLoad={handleImageLoad}
              />
            </div>
          </div>
          <img 
            ref={nextImageRef}
            src={getImageSrc(currentIndex)}
            alt={`Hero ${currentIndex}`}
            id="next-image"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoad={handleImageLoad}
          />

          <img 
            src={getImageSrc(currentIndex === totalImages - 1 ? 1 : currentIndex)}
            alt="Hero main"
            className="absolute-center left-0 top-0 size-full object-cover object-center"
            onLoad={handleImageLoad}
          />
        </div>
        {/* Main content container - restructured */}
        <div className="absolute mt-80 inset-0 flex flex-col items-center z-40">
          {/* Top section - hero heading */}
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-4 md:gap-8">
              <HyperText
                text="ABDUL"
                className="special-font hero-heading scroll-heading pointer-events-none text-blue-100 tracking-[15px]"
              />
              <HyperText
              text="MAJEED"
                className="special-font hero-heading bottom-heading pointer-events-none text-blue-100 tracking-[15px]"
              />
            </div>
          </div>

          <AnimatedTitle
            title="<b>MJ</b>"
            containerClass="!text-blue-100 text-center"
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
              containerClass="!bg-yellow-300 hover:!bg-yellow-400 flex-center gap-2 px-6 py-2.5 rounded-full transition-all duration-200"
            />
          </div>
        </div>

        {/* Add the cutout image */}
        <div 
          id="cutout-image"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-10 h-10"
        >
          <img 
            src="/img/ship1-min.png" 
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
              <h2 className="lg:text-6xl text-xl uppercase font-bold bg-gradient-to-r from-gray-500 to-yellow-100 bg-clip-text text-transparent">
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
              <h2 className="lg:text-6xl text-xl uppercase font-bold bg-gradient-to-l from-gray-500 to-yellow-100 bg-clip-text text-transparent">
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