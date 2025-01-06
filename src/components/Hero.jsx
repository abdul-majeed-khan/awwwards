import { useState, useRef, useEffect } from 'react'
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

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

  // Heading scroll animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768; // Check if mobile viewport
    
      // Set x values based on screen size
      const xOffset = isMobile ? 100 : 450; 
      const yOffset = isMobile ? 600 : 600;  
      const xxOffset = isMobile ? 100 : 450;  
      const yyOffset = isMobile ? 148 : 12;  

      // Animation for "REDEFINE" coming down and right
      gsap.fromTo(".scroll-heading",
        { y: 0, x: 0 },
        {
          y: yOffset,
          x: xOffset,
          smooth: 2,
          effects: true,
          scrollTrigger: {
            trigger: "#video-frame",
            start: "top top",
            end: "bottom center",
            scrub: true,
            toggleActions: "play none none reverse"
          }
        }
      );
  
      // Animation for "GAMING" going up and left
      gsap.fromTo(".bottom-heading",
        { y: 0, x: 0 },
        {
          y: -yyOffset,
          x: -xxOffset,
          smooth: 2,
          effects: true,
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

  const getImageSrc = (index) => `/img/planet-${index}.jpg`;

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
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
                className="size-64 origin-center scale-150 object-cover object-center"
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

        <div className="absolute left-0 lg:top-48 top-16 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>
            <Button 
              id="watch-trailer" 
              title="Watch Trailer" 
              leftIcon={<TiLocationArrow />} 
              containerClass="!bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>
      <h1 className="special-font hero-heading scroll-heading absolute top-24 left-0 px-5 sm:px-10 text-blue-100 z-40">
        Ab<b>d</b>ul
      </h1>
      <h1 className="special-font hero-heading bottom-heading absolute bottom-5 right-5 text-blue-100 z-40">
        M<b>a</b>jeed
      </h1>
    </div>
  )
}

export default Hero